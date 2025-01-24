import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema({
    question: { type: String, required: true },
});

const connection = mongoose.createConnection(process.env.MONGODB_URI, { dbName: "Cluster0" });
const Question = connection.model("Question", questionSchema); 
	
export default Question;
