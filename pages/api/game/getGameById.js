import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import User from "@/db/models/User";
import Task from "@/db/models/Tasks";


export default async function handler(request, response) {
    await dbConnect();

      const session = await getServerSession(request, response, authOptions); 
      
      if (!session) {
        return response.status(403).json({ message: "No access" });
      }

      if (request.method === "GET") {
        try {

          const { id } = request.query; 
          
          const game = await Game.findById(id).populate('questions');
          let players = null;

    
          if (game.length === 0) {
            return response.status(404).json({ message: "Spiel nicht gefunden" });
          } else {
            players = await User.find({ _id: { $in: game.players } }).select("_id firstname lastname").lean();
          }

        
    
          return response.status(200).json({ game, players });
        } catch (error) {
          console.error("Fehler beim Abrufen der Spiele:", error);
          return response.status(400).json({ error: error.message });
        }
      } else {
        response.status(405).json({ error: "Methode nicht erlaubt" });
      }
    }
