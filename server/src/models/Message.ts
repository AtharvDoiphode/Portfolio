import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    subject: { type: String, default: "" },
    needs: { type: [String], default: [] },
    budget: { type: String, default: "" },
    timeline: { type: String, default: "" },
    body: { type: String, required: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    // Replies sent from the admin panel (newest last).
    replies: { type: [{ body: { type: String, maxlength: 5000 }, sentAt: { type: Date, default: Date.now }, _id: false }], default: [] },
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

export const Message = model("Message", MessageSchema);
