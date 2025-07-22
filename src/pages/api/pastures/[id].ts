import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("Antwerpse-Hondenweiden");
  const pastures = db.collection("pastures");
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid pasture ID." });
  }

  switch (req.method) {
    case "GET": {
      try {
        const pasture = await pastures.findOne({ _id: new ObjectId(id) });
        if (!pasture) {
          return res.status(404).json({ error: "Pasture not found." });
        }
        return res.status(200).json(pasture);
      } catch (e) {
        return res.status(400).json({ error: "Invalid ID format." });
      }
    }

    case "PUT": {
      const updatedPasture = req.body;

      if (!updatedPasture || typeof updatedPasture !== "object") {
        return res.status(400).json({ error: "Expected pasture data in body." });
      }

      try {
        delete updatedPasture._id;

        const result = await pastures.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedPasture }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Pasture not found." });
        }

        return res.status(200).json({ message: "Pasture updated." });
      } catch (e) {
        return res.status(400).json({ error: "Invalid ID format." });
      }
    }

    case "DELETE": {
      try {
        const result = await pastures.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Pasture not found." });
        }

        const picturesFolderPath = path.join(process.cwd(), "pictures", id);

        // Delete pictures folder asynchronously, log errors but don't block response
        fs.rmdir(picturesFolderPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Failed to delete pictures folder:", err);
          }
        });

        return res.status(200).json({ message: "Pasture deleted." });
      } catch (e) {
        return res.status(400).json({ error: "Invalid ID format." });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
