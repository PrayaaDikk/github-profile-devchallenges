export function formattedNumber(number: number): string {
	if (number !== undefined) {
		return new Intl.NumberFormat("en-Us").format(number);
	}
	return "Undefined";
}
