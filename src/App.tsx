import React, { useState, useEffect, useRef } from "react";
import { formattedNumber } from "./scripts/utils";
import RepoCard from "./components/RepoCard";

type GithubUser = {
	id?: number;
	login?: string;
	name: string;
	bio: string | null;
	avatar_url: string;
	followers: number;
	following: number;
	location: string | null;
};

type GithubRepo = {
	id: number;
	name: string;
	description: string;
	license?: { key: string } | null;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	html_url: string;
};

export default function App() {
	const [user, setUser] = useState<GithubUser | null>(null);
	const [repos, setRepos] = useState<GithubRepo[]>([]);
	const [search, setSearch] = useState<string>("");
	const [username, setUsername] = useState<string>("github");
	const [suggestions, setSuggestions] = useState<GithubUser[]>([]);
	const [isActive, setIsActive] = useState<boolean>(false);
	const [viewButtonRepos, setViewButtonRepos] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	// getting user data function
	async function getUser(user: string) {
		try {
			const res = await fetch(`https://api.github.com/users/${user}`);
			const data = await res.json();
			setUser(data);
		} catch (error) {
			console.error("Failed fetching data user: " + error);
		}
	}

	// getting user repositories function
	async function getRepos(user: string, slice: boolean = false) {
		setViewButtonRepos(false);
		try {
			const res = await fetch(
				`https://api.github.com/users/${user}/repos`
			);
			let data = await res.json();

			if (data.length > 4) {
				if (slice) {
					data = data.slice(0, 4);
				}
				setViewButtonRepos(true);
			}

			setRepos(data);
		} catch (error) {
			console.error("Failed fetching data repository: " + error);
		}
	}

	// running API user while username changes
	useEffect(() => {
		getUser(username);
	}, [username]);

	// running API repos while username or isActive changes
	useEffect(() => {
		getRepos(username, isActive ? false : true);
	}, [username, isActive]);

	// Fetches user suggestions from GitHub API based on search query
	useEffect(() => {
		async function getSuggestions() {
			if (search.trim() === "") {
				setSuggestions([]);
				return;
			}

			try {
				const res = await fetch(
					`https://api.github.com/search/users?q=${search}`
				);
				const data = await res.json();
				setSuggestions(data.items?.slice(0, 5) || []);
			} catch (error) {
				console.error("Failed fetching suggestions: " + error);
			}
		}

		const delayDebounce = setTimeout(() => {
			getSuggestions();
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [search]);

	// handling search with enter
	function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && search.trim()) {
			setUsername(search.trim());
			setSuggestions([]);
			setSearch("");
			if (inputRef.current) inputRef.current.value = "";
			setIsActive(false);
		}
	}

	// handling click for suggestion
	function handleClickUser(username: string) {
		setUsername(username);
		setSearch("");
		setSuggestions([]);
		if (inputRef.current) inputRef.current.value = "";
		setIsActive(false);
	}

	return (
		<section className="min-h-screen bg-slateTheme max-xs:text-xs">
			<header className="relative">
				<img
					src="resources/hero-image-github-profile.jpg"
					alt="hero-image"
					className="w-full h-[250px] object-center object-cover"
				/>
				<div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full px-[30px] mt-8">
					<label
						htmlFor="username"
						className="flex items-center gap-x-4 p-[1em] bg-slateTheme rounded-xl w-full max-w-[500px] mx-auto"
					>
						<img src="resources/Search.svg" alt="searchh-icon" />
						<input
							type="text"
							id="username"
							placeholder="Username"
							className="w-full appearance-none focus:outline-none bg-transparent placeholder:text-slateTheme2"
							autoComplete="off"
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={handleSearch}
							ref={inputRef}
						/>
					</label>

					{/* display suggestions */}
					{suggestions.length > 0 && (
						<ul className="mt-2 p-[0.5em] bg-slateTheme rounded-xl w-full max-w-[500px] mx-auto max-h-[150px] overflow-y-scroll flex flex-col gap-2 custom-scrollbar">
							{suggestions.map((suggestion) => (
								<li
									className="rounded-xl w-full max-w-[500px] mx-auto bg-blackTheme flex items-center cursor-pointer"
									key={suggestion?.id}
									onClick={() =>
										handleClickUser(suggestion?.login ?? "")
									}
								>
									<div className="p-[1em]">
										<img
											src={suggestion?.avatar_url}
											alt="user-avatar"
											className="max-w-[5em] object-cover object-center rounded-xl overflow-hidden"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<h2>{suggestion?.login}</h2>
										{suggestion?.bio ? (
											<p>{suggestion?.bio}</p>
										) : (
											<p className="text-slateTheme2">
												No bio
											</p>
										)}
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</header>

			{/* main content */}
			<main className="bg-slateTheme min-h-screen pt-[1em] px-[1.875em] md:px-[3.75em] pb-12">
				<section className="max-w-[1160px] mx-auto">
					<nav className="flex flex-col gap-8 md:flex-row relative">
						<img
							src={user?.avatar_url}
							alt="user-avatar"
							className="absolute w-28 xs:w-32 object-cover object-center -top-[55px] left-0 right-0 bg-slateTheme rounded-2xl p-2"
						/>
						<ul className="flex flex-wrap gap-4 h-fit w-full mt-[6.25em] md:mt-0 md:ml-[9.5em]">
							<li className="p-[0.5em] flex gap-x-2 bg-blackTheme rounded-2xl [&>p]:p-3 [&>div]:mx-1">
								<p>Followers</p>
								<div className="h-full w-[1px] bg-slateTheme2"></div>
								<p>{formattedNumber(user?.followers ?? 0)}</p>
							</li>
							<li className="p-[0.5em] flex gap-x-2 bg-blackTheme rounded-2xl [&>p]:p-3 [&>div]:mx-1">
								<p>Following</p>
								<div className="h-full w-[1px] bg-slateTheme2"></div>
								<p>{formattedNumber(user?.following ?? 0)}</p>
							</li>
							<li className="p-[0.5em] flex gap-x-2 bg-blackTheme rounded-2xl [&>p]:p-3 [&>div]:mx-1">
								<p>Location</p>
								<div className="h-full w-[1px] bg-slateTheme2"></div>
								<p
									className={
										user?.location ? "" : "text-slateTheme2"
									}
								>
									{user?.location ?? "No location"}
								</p>
							</li>
						</ul>
					</nav>

					{/* information about user */}
					<article className="mt-8 mb-6">
						<h1 className="text-[2em]">{user?.name}</h1>
						<p className={user?.bio ? "" : "text-slateTheme2"}>
							{user?.bio ?? "No bio"}
						</p>
					</article>

					{/* list repositories */}
					<main className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{repos.map((repo) => (
							<RepoCard
								key={repo?.id}
								title={repo?.name ?? undefined}
								description={repo?.description ?? undefined}
								license={repo.license?.key ?? undefined}
								fork_count={repo?.forks_count ?? 0}
								stargazer_count={repo?.stargazers_count ?? 0}
								updated_at={repo?.updated_at ?? ""}
								html_url={repo?.html_url ?? ""}
							/>
						))}
					</main>
					<footer className="mt-12 w-fit mx-auto">
						<button
							type="button"
							className={`cursor-pointer hover:text-lightGrayTheme duration-300 ${
								viewButtonRepos ? "" : "hidden"
							}`}
							onClick={() => setIsActive(!isActive)}
						>
							{isActive ? "Show less" : "View all repositories"}
						</button>
					</footer>
				</section>
			</main>
		</section>
	);
}
