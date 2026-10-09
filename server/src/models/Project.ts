import { Schema, model } from "mongoose";

export const CATEGORIES = ["Websites", "AI Videos", "Excel", "Research"] as const;
export type Category = (typeof CATEGORIES)[number];

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true },
    cat: { type: String, enum: CATEGORIES, required: true },
    desc: { type: String, default: "", maxlength: 200 },
    long: { type: String, default: "", maxlength: 2000 },
    tags: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    liveLabel: { type: String, default: "" },
    codeUrl: { type: String, default: "" },
    codeLabel: { type: String, default: "" },
    ph: { type: String, default: "" }, // caption shown on the striped placeholder until a cover is uploaded
    coverUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  },
);

export const Project = model("Project", ProjectSchema);
