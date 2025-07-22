import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        return res
          .status(400)
          .json({ error: "Expected pasture data in body." });
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
        // Delete pasture in DB
        const result = await pastures.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Pasture not found." });
        }

        // Call internal API to delete images folder
        const imagesApiUrl = `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/images?folderName=${id}`;
        try {
          const response = await fetch(imagesApiUrl, { method: "DELETE" });
          if (!response.ok) {
            const data = await response.json();
            console.error("Failed to delete images folder:", data.error);
          }
        } catch (err) {
          console.error("Error calling DELETE /api/images:", err);
        }

        return res.status(200).json({ message: "Pasture deleted." });
      } catch (err) {
        return res.status(500).json({ error: "Server error." });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
