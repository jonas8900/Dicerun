import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME

async function dbConnect() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: DATABASE_NAME, 
        });
        console.log("Erfolgreich verbunden mit MongoDB!");
    } catch (error) {
        console.error("Fehler bei der Verbindung zur Datenbank:", error);
    }
}

export default dbConnect;
