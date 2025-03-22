import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import mongoose from "mongoose";
import Task from "@/db/models/Tasks";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions); 

  if (!session) {
    return res.status(403).json({ message: "No access" });
  }

  const { task, x, points, pointsAfterFinish } = req.body; 

  console.log(req.body);

  if (!task) {
    return res.status(400).json({ message: "Task data is missing or incomplete" });
  }

  if(!points || points < 0 || points > 10000) {
    return res.status(400).json({ message: "Points are missing, too low or too high" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(x)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    const newQuestion = new Task({
      task: task,
      points: points,
      pointsAfterFinish: pointsAfterFinish,
    });

    await newQuestion.save();  

    const game = await Game.findById(x).populate("questions"); 

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    game.questions.push(newQuestion._id);

    await game.save();

    return res.status(201).json({ message: "Game updated", game }); 
  } catch (error) {
    console.error("Error while updating game:", error);
    return res.status(500).json({ message: "Error updating game", error: error.message });
  }
}
