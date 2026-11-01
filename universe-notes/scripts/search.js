import { readFile } from "node:fs/promises";

const searchTerm = process.argv.slice(2).join(" ").trim();
if (!searchTerm) {
  console.error("Usage: npm run search -- <word>");
  process.exitCode = 1;
} else {
  const query = searchTerm.toLowerCase();
  const notesUrl = new URL("../notes/keynote-highlights.json", import.meta.url);
  const { highlights } = JSON.parse(await readFile(notesUrl, "utf8"));
  const matches = highlights.filter(({ title, summary }) =>
    `${title}\n${summary}`.toLowerCase().includes(query),
  );
  const topics = new Map();

  for (const { topic, title, summary } of matches) {
    const topicHighlights = topics.get(topic) ?? [];
    topicHighlights.push({ title, summary });
    topics.set(topic, topicHighlights);
  }

  if (matches.length === 0) {
    console.log(`No highlights found for "${searchTerm}".`);
  } else {
    console.log(
      [...topics]
        .map(
          ([topic, topicHighlights]) =>
            `${topic}\n${topicHighlights
              .map(({ title, summary }) => `  - ${title}\n    ${summary}`)
              .join("\n")}`,
        )
        .join("\n\n"),
    );
  }
}
