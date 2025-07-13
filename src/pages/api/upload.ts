import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // We'll manually parse
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const buffers: Uint8Array[] = [];
  const id = req.headers["x-pasture-id"] as string | undefined;
  const filename = req.headers["x-file-name"] as string | undefined;

  if (!id || !filename) {
    return res.status(400).json({ error: "Missing ID or filename in headers." });
  }

  req.on("data", (chunk) => buffers.push(chunk));
  req.on("end", () => {
    const buffer = Buffer.concat(buffers);
    const folderPath = path.join(process.cwd(), "public", "pictures", id);

    // Ensure folder exists
    fs.mkdirSync(folderPath, { recursive: true });

    // Delete all files inside the folder to ensure only one image per pasture
    try {
      const existingFiles = fs.readdirSync(folderPath);
      for (const file of existingFiles) {
        fs.unlinkSync(path.join(folderPath, file));
      }
    } catch (err) {
      console.error("Failed to clean existing images:", err);
      // Not fatal, just log
    }

    // Save new file
    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, buffer);

    res.status(200).json({ imagePath: `/pictures/${id}/${filename}` });
  });

  req.on("error", (err) => {
    console.error("Error during upload:", err);
    res.status(500).json({ error: "Failed to upload." });
  });
}
