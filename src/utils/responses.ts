import { csvParse } from "d3-dsv";

export const mapRequestToParsedCSV = async <T>(request: Promise<Response>) => {
	const response = await request;
	const text = await response.text();

	return csvParse(text) as T;
};
