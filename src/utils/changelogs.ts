import { marked } from "marked";

const loadChangelog = (name: string) => {
	return import(`../../changelogs/${name}.md?raw`);
};

export const getAllChangelogs = async () => {
	const files = import.meta.glob("../../changelogs/*.md");
	let contents = "";

	const mapped = await Promise.all(
		Object.keys(files).map(async (key) => {
			const filenameWithoutExtension = key.match(/\/([0-9-]+).md$/)![1];
			const { default: text } = await loadChangelog(filenameWithoutExtension);
			const intl = new Intl.DateTimeFormat("ar-EG");
			const date = new Date(filenameWithoutExtension);
			const title = intl.format(date);

			return {
				text,
				title,
				date,
			};
		})
	);

	mapped.sort((a, b) => b.date.getTime() - a.date.getTime());

	mapped.forEach(({ title, text }) => {
		contents += `<h2 data-title>تحديثات ${title}</h2><div data-content>${marked.parse(
			text
		)}</div>`;
	});

	return contents;
};

export const shouldDisplayChangelogs = () => {
	const latestReadChangelogDate = localStorage.getItem("latest-changelog");
	const latestUpdateDate = import.meta.env.BUILD_TIMESTAMP;
	const shouldDisplay =
		!latestReadChangelogDate ||
		new Date(latestReadChangelogDate).getTime() <=
			new Date(latestUpdateDate).getTime();

	return shouldDisplay;
};
