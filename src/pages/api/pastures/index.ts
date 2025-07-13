import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("Antwerpse-Hondenweiden");
  const pastures = db.collection("pastures");

  switch (req.method) {
    case "GET": {
      const data = await pastures.find({}).toArray();
      return res.status(200).json(data);
    }
    case "POST": {
      const pasture = req.body;

      if (!pasture || typeof pasture !== "object") {
        return res.status(400).json({ error: "Expected a pasture object in the body." });
      }

      // Remove _id if present to let MongoDB create a new one
      if ("_id" in pasture) {
        delete pasture._id;
      }

      const result = await pastures.insertOne(pasture);
      return res.status(201).json({ message: "Pasture created.", id: result.insertedId });
    }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
