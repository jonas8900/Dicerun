import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Kein Zugriff!" });
  }

  res.status(200).json({ message: "Willkommen Gamemaster!", user: session.user });
}
