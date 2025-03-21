import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import mongoose from "mongoose";
import Task from "@/db/models/Tasks";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(403).json({ message: "No access" });
    }

    const { gameId, taskId } = req.body;
    console.log(req.body);

    if (!mongoose.Types.ObjectId.isValid(gameId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid game ID or task ID" });
    }

    try {
      const game = await Game.findById(gameId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      game.questions = game.questions.filter((task) => task.toString() !== taskId);
      await game.save();

      await Task.findByIdAndDelete(taskId);

      return res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      console.error("Error while deleting task:", error);
      return res.status(500).json({ message: "Error deleting task", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
