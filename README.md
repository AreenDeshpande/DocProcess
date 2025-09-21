# 📝 Government ID Text & Feature Extraction

## 🌟 Project Overview
Welcome to the **Government ID Text & Feature Extraction** project! This system is designed to extract text and key details from images and PDFs of Indian government-issued IDs. We leverage the **Llama 3.2 Vision Model** for Optical Character Recognition (OCR) and build our web interface using the **MERN stack (MongoDB, Express.js, React, Node.js)**. 

This project can be used for:
✅ Identity verification  
✅ Automated document processing  
✅ Seamless form filling  

---

## 🚀 Installation & Setup

### 🔧 Prerequisites
Ensure you have the following installed on your system:
- **Node.js** ✨ (for backend & frontend)
- **MongoDB** 📂 (for database)
- **Llama 3.2 Vision Model API Key** 🔑 (for OCR)
- **Git** (for version control)

### 📚 Setup Guide
1. **Clone the Repository**
   ```bash
   git clone (https://github.com/Arinjay-04/Document-Processing-Using-OCR/)
   cd Document-Processing-Using-OCR
   ```

2. **Backend Setup (💪 Node.js & Express.js)**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Add your Llama 3.2 Vision Model API key & MongoDB URI
   npm start
   ```

3. **Frontend Setup (🎨 React.js)**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Database Setup (📂 MongoDB)**
   - Start your MongoDB instance.
   - Ensure the connection string in `.env` is correctly set.

---

## 🔮 Core Modules & Functionalities

### 🎯 1. OCR Extraction Module (Llama 3.2 Vision Model)
- Extracts text & structured data from Aadhaar, PAN, Voter ID, and Driving License.
- Returns JSON output with key details.

### 🔧 2. Feature Extraction & Validation
- Extracts **Name, DOB, Address, and ID Number**.
- Validates extracted text against predefined formats.

### 🛡️ 3. Secure Database Storage (MongoDB)
- Stores extracted data securely.
- Maintains logs for future reference.

### 🎨 4. Frontend UI (React.js)
- Intuitive interface to upload IDs.
- Allows users to **verify, edit, and submit** extracted details.

---

## 🔍 How to Use?

### Uploading an ID for Extraction
1. Open the web application.
2. Upload an image or PDF of a government-issued ID.
3. Click **"Extract Text"**.

### Processing & Output
- The system processes the file & extracts text.
- Extracted details appear on the frontend.
- Users can **verify, edit, and submit** the details.

---

## 🌐 API Endpoints

### 📃 Upload Image/PDF for Extraction
```http
POST /api/extract
Content-Type: multipart/form-data
Body: { file: <image/pdf> }
```

### 🔄 Retrieve Extracted Data
```http
GET /api/data/:id
```

---

## 🌟 Future Enhancements
🔎 AI-powered fraud detection  
🌍 Multi-language support for regional IDs  
📄 Support for additional document types  

---

## 👥 Contributors
- **Arinjay Patil** 
- **Prasad Gujar** 
- **Avadhut Bhong** 
- **Areen Deshpande** 
- **Rushikesh Gaikwad** 

---

## 🔒 License
This project is licensed under the **MIT License**. Feel free to use & contribute! 🚀
