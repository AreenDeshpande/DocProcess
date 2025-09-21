import asyncHandler from "express-async-handler";
import Document from "../models/documentModel.js";
import Together from "together-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
// console.log(__filename);
const __dirname = path.dirname(__filename);

// Initialize Together client with explicit API key
const client = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// System message to enforce JSON output
const systemMessage = `You are a JSON-only response API. You must ALWAYS respond with valid JSON objects only. Never include any explanatory text or markdown formatting. If you cannot extract certain information, use "NA" as the value.`;

// Strict JSON format prompt
const prompt = `Return ONLY a JSON object with exactly this structure, no other text:
{
  "document_type": "type of ID (Aadhar/PAN/Voter/DL)",
  "id_number": "extracted ID number",
  "name": "full name",
  "dob": "date of birth",
  "gender": "gender",
  "address": "full address",
  "father_name": "father's name"
}`;

// @desc    Process a document image
// @route   POST /api/documents/process
// @access  Private
const processDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  const imagePath = req.file.path;
  try {
    const finalImageUrl = `data:image/jpeg;base64,${encodeImage(imagePath)}`;

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: finalImageUrl } },
          ],
        },
        {
          role: "assistant",
          content:
            "I will only respond with a valid JSON object containing the extracted information.",
        },
        {
          role: "user",
          content: "Remember to return ONLY the JSON object, no other text.",
        },
      ],
      model: req.body.model || "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      temperature: 0.1,
      max_tokens: 500,
    });

    let responseContent = chatCompletion.choices[0].message.content;
    console.log("Raw response:", responseContent);

    // Clean up the response
    responseContent = responseContent.trim();

    let parsedData;
    try {
      // Remove any non-JSON content
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }

      responseContent = jsonMatch[0];
      parsedData = JSON.parse(responseContent);

      // Validate and normalize the data
      const defaultFields = [
        "document_type",
        "id_number",
        "name",
        "dob",
        "gender",
        "address",
        "father_name",
      ];

      // Ensure all fields exist and normalize values
      defaultFields.forEach((field) => {
        parsedData[field] = parsedData[field]?.toString().trim() || "NA";
      });

      // Save to database
      const document = await Document.create({
        user: req.user._id,
        ...parsedData,
        originalImage: req.file.filename,
      });

      // Return successful response
      res.status(200).json(document);
    } catch (jsonError) {
      console.error("Parsing error:", jsonError);
      console.error("Response content:", responseContent);

      // Try to extract information from text if JSON parsing fails
      const extractedData = {
        document_type: "NA",
        id_number: "NA",
        name: "NA",
        dob: "NA",
        gender: "NA",
        address: "NA",
        father_name: "NA",
      };

      // Return error with extracted data
      res.status(400).json({
        message: "Failed to parse document information",
        error: jsonError.message,
        rawResponse: responseContent,
        extractedData: extractedData,
      });
    }

    // Clean up the uploaded file
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  } catch (error) {
    console.error("Processing error:", error);
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    res.status(400).json({
      message: "Error processing document",
      error: error.message,
    });
  }
});

// @desc    Get all processed documents for a user
// @route   GET /api/documents
// @access  Private
const getProcessedDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id });
  res.json(documents);
});

// Helper function to encode images to base64
function encodeImage(imagePath) {
  const imageFile = fs.readFileSync(imagePath);
  return Buffer.from(imageFile).toString("base64");
}

export { processDocument, getProcessedDocuments };
