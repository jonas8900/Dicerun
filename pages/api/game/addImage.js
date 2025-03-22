import formidable from "formidable";
import AWS from "aws-sdk";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import User from "@/db/models/User";

AWS.config.update({
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(403).json({ message: "No access" });
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024,  
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Die Datei ist zu groß. Bitte wählen Sie eine Datei, die kleiner als 3 MB ist." });
      }
      console.error(err);
      return res.status(400).json({ error: "Fehler beim Verarbeiten der Formulardaten." });
    }

    const { gameId } = fields;
    const file = files.image?.[0];


    if (!file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen." });
    }

    const filePath = file.filepath;

    if (!filePath) {
      return res.status(400).json({ error: "Der Dateipfad ist undefiniert." });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "Dateipfad existiert nicht." });
    }

    const fileStats = fs.statSync(filePath);
    if (fileStats.size === 0) {
      return res.status(400).json({ error: "Datei ist leer." });
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.on("error", (err) => {
      console.error("File Stream Error:", err);
      return res.status(500).json({ error: "Fehler beim Lesen der Datei." });
    });

    const str = file.originalFilename;
    const newFilename = str.lastIndexOf(".") !== -1 ? str.slice(0, str.lastIndexOf(".")) + ".webp" : str + ".webp";

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `games/${Date.now()}-${newFilename}`,
      Body: fileStream,
      ContentType: file.mimetype || "application/octet-stream", 
      CacheControl: "public, max-age=31536000",
    };

    try {
      const uploadStart = Date.now();
      const s3Response = await s3.upload(uploadParams).promise();
      console.log("S3 upload time:", Date.now() - uploadStart, "ms");

      const fileUrl = s3Response.Location;

      const game = await Game.findById(gameId);

      if (!game) {
        return res.status(404).json({ error: "Spiel nicht gefunden" });
      }

      game.files.push(fileUrl);

      await game.save();

      return res.status(200).json({ message: "Datei erfolgreich hochgeladen!", fileUrl });
    } catch (error) {
      console.error("Fehler beim Hochladen der Datei:", error);
      return res.status(500).json({ error: error.message });
    }
  });
}
