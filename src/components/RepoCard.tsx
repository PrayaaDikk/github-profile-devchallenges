import { formattedNumber, timeAgo } from "../scripts/utils";

interface RepoCardProps {
	title: string;
	description: string;
	license?: string;
	fork_count: number;
	stargazer_count: number;
	updated_at: string;
}

export default function RepoCard({
	title,
	description,
	license,
	fork_count,
	stargazer_count,
	updated_at,
}: RepoCardProps) {
	return (
		<main className="bg-card px-[1.2em] py-[1.4em] rounded-xl grid grid-cols-1 gap-y-3 shadow-sm hover:shadow-xl duration-300">
			<h2>{title}</h2>
			{description ? (
				<p className="text-lightGrayTheme">{description}</p>
			) : (
				<p className="text-slateTheme2">No description</p>
			)}
			<footer className="flex items-center gap-x-4 text-lightGrayTheme">
				{license && (
					<div className="flex items-center gap-x-1">
						<img
							src="resources/Chield_alt.svg"
							alt="license-icon"
						/>
						<p>{license.toUpperCase()}</p>
					</div>
				)}
				<div className="flex items-center gap-x-1">
					<img src="resources/Nesting.svg" alt="fork-icon" />
					<p>{formattedNumber(fork_count ?? 0)}</p>
				</div>
				<div className="flex items-center gap-x-1">
					<img src="resources/Star.svg" alt="star-icon" />
					<p>{formattedNumber(stargazer_count ?? 0)}</p>
				</div>
				<p className="text-xs">{timeAgo(updated_at)}</p>
			</footer>
		</main>
	);
}
