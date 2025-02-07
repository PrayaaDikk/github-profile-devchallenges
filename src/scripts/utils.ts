export function formattedNumber(number: number): string {
	if (number !== undefined) {
		return new Intl.NumberFormat("en-Us").format(number);
	}
	return "Undefined";
}

export function timeAgo(timestamp: string): string {
	const now = new Date();
	const past = new Date(timestamp);
	const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	const intervals: { [key: string]: number } = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
		second: 1,
	};

	for (const [unit, seconds] of Object.entries(intervals)) {
		const value = Math.floor(diffInSeconds / seconds);
		if (value > 0) {
			return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
		}
	}

	return "Just now";
}
