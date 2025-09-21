import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    document_type: {
      type: String,
      required: true,
    },
    id_number: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      default: "NA",
    },
    gender: {
      type: String,
      default: "NA",
    },
    address: {
      type: String,
      default: "NA",
    },
    father_name: {
      type: String,
      default: "NA",
    },
    photo_present: {
      type: Boolean,
      default: false,
    },
    qr_present: {
      type: Boolean,
      default: false,
    },
    issue_date: {
      type: String,
      default: "NA",
    },
    valid_until: {
      type: String,
      default: "NA",
    },
    originalImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
