import fs from "fs";
import path from "path";
import matter from "gray-matter";

const writeupsDirectory = path.join(process.cwd(), "_writeups");

export interface WriteupMetadata {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  author: string;
}

export interface Writeup extends WriteupMetadata {
  content: string;
}

export function getAllWriteups(): WriteupMetadata[] {
  const fileNames = fs.readdirSync(writeupsDirectory);
  const allWriteupsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(writeupsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as Omit<WriteupMetadata, "id">),
    };
  });

  return allWriteupsData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getWriteupData(id: string): Writeup {
  const fullPath = path.join(writeupsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as Omit<WriteupMetadata, "id">),
  };
}
