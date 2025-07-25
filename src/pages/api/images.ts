import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const PICTURES_DIR = path.join(process.cwd(), "public", "pictures");

function getAllImages(dir: string, basePath = "/pictures/"): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(
        getAllImages(filePath, path.join(basePath, file))
      );
    } else {
      if (/\.(png|jpe?g|gif|svg|webp)$/i.test(file)) {
        results.push(path.join(basePath, file));
      }
    }
  });

  return results;
}

type Data = string[] | { error: string } | { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const images = getAllImages(PICTURES_DIR);
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to load images" });
    }
  } else if (req.method === "DELETE") {
    const folderName = req.query.folderName;

    if (!folderName || typeof folderName !== "string") {
      return res.status(400).json({ error: "Missing or invalid folder name." });
    }

    const folderPath = path.join(PICTURES_DIR, folderName);

    try {
      if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: "Folder does not exist." });
      }

      fs.rmSync(folderPath, { recursive: true, force: true });
      return res.status(200).json({ message: "Folder deleted." });
    } catch (err) {
      console.error("Failed to delete folder:", err);
      return res.status(500).json({ error: "Could not delete folder." });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
