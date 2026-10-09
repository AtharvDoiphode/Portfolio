import { Schema, model } from "mongoose";

// One document. The PDF is stored in MongoDB (max 5 MB) so it works without any extra file service.
const ResumeSchema = new Schema(
  {
    key: { type: String, unique: true, default: "main" },
    filename: { type: String, default: "resume.pdf" },
    size: { type: Number, default: 0 },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

export const Resume = model("Resume", ResumeSchema);
