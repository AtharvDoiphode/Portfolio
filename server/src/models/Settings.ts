import { Schema, model } from "mongoose";

const clean = {
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id;
    return ret;
  },
};

const SettingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "main" },
    profile: {
      name: { type: String, default: "" },
      headline: { type: String, default: "" },
      location: { type: String, default: "" },
      email: { type: String, default: "" },
      photoUrl: { type: String, default: "" }, // badge photo (3:4)
      introPhotoUrl: { type: String, default: "" }, // intro section (4:5)
      aboutPhotoUrl: { type: String, default: "" }, // about section (4:5)
    },
    services: [{ glyph: String, hue: Number, title: String, short: String, desc: String }],
    skills: [{ group: String, items: [String] }],
    stats: [{ value: String, label: String }],
    links: [{ g: String, hue: Number, name: String, sub: String, href: String }],
  },
  { timestamps: true, toJSON: clean },
);

export const Settings = model("Settings", SettingsSchema);
