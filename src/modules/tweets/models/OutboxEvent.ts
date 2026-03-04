import { OUTBOX_STATUS_TYPES } from "@/common/constants/enums";
import mongoose from "mongoose";
const { Schema } = mongoose;

const OutboxEventSchema = new Schema(
  {
    aggregateId: { type: Schema.Types.ObjectId, required: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: OUTBOX_STATUS_TYPES,
      default: OUTBOX_STATUS_TYPES.PENDING,
    },
    lockedBy: { type: String, require: true },
    lockedAt: { type: Date, require: true },
  },
  { timestamps: true },
);

OutboxEventSchema.index({ status: 1, createdAt: 1 });

export default mongoose.model("OutboxEvent", OutboxEventSchema);
