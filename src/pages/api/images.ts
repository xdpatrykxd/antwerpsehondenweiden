import fs from "fs";
import path from "path";

const PICTURES_DIR = path.join(process.cwd(), "public", "pictures");

function getAllImages(dir: string, basePath = "/pictures/"): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImages(filePath, path.join(basePath, file)));
    } else {
      if (/\.(png|jpe?g|gif|svg|webp)$/i.test(file)) {
        results.push(path.join(basePath, file));
      }
    }
  });

  return results;
}

import type { NextApiRequest, NextApiResponse } from "next";

type Data = string[] | { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const images = getAllImages(PICTURES_DIR);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to load images" });
  }
}
