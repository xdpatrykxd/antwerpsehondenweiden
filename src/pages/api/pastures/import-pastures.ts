import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Antwerpse-Hondenweiden");
    const pastures = db.collection("pastures");

    const filePath = path.join(process.cwd(), "src", "data", "oldPastures.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const oldPastures = JSON.parse(fileContents);

    if (!Array.isArray(oldPastures)) {
      return res.status(400).json({ error: "Invalid data format, expected an array" });
    }

    // Optional: If you want to prevent duplicates, you could clear the collection first or check for existing ones

    // Insert all pastures
    const insertResult = await pastures.insertMany(oldPastures);

    return res.status(200).json({
      message: `Imported ${insertResult.insertedCount} pastures successfully.`,
    });
  } catch (error: any) {
    console.error("Import failed:", error);
    return res.status(500).json({ error: error.message || "Import failed" });
  }
}
