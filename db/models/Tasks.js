import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  task: { type: String, required: true },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
