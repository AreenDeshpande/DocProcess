import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  processDocument,
  getProcessedDocuments,
} from "../controllers/documentController.js";
import multer from "multer";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Protected routes - only authenticated users can access
router.post("/process", protect, upload.single("image"), processDocument);
router.get("/documents", protect, getProcessedDocuments);

export default router;
