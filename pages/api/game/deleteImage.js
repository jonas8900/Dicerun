import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import { getServerSession } from "next-auth";
import AWS from "aws-sdk";
import { authOptions } from "../auth/[...nextauth]";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // AWS region of your S3 bucket
});

export default async function handler(req, res) {
  // Ensure the correct request method (DELETE)
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Connect to the database
  await dbConnect();

  // Retrieve session from request
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ message: "No access" });
  }

  const { gameId, fileId } = req.body;

  console.log(req.body);

  if (!gameId || !fileId) {
    return res.status(400).json({ message: "Game ID and File URL are required" });
  }

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const fileIndex = game.files.findIndex((file) => file === fileId);

    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found in the game" });
    }

    const deletedFileUrl = game.files.splice(fileIndex, 1)[0];

    if (deletedFileUrl) {
      const urlParts = new URL(deletedFileUrl);
      const key = urlParts.pathname.substring(1); 

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      };

      await s3.deleteObject(deleteParams).promise();
      console.log("S3 file deleted:", key);
    }

    await game.save();

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Error deleting the image", error: error.message });
  }
}
