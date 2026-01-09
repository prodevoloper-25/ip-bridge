import React, { useState } from 'react';
import { db } from '../config/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

const gemUrl = process.env.REACT_APP_GEMINI_API_KEY;

const UploadPage = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize Gemini with your API Key
  console.log(gemUrl);
  const genAI = new GoogleGenerativeAI(gemUrl);

  // Helper to convert file to generative part (base64)
  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleDecode = async () => {
  if (!text.trim() && !file) return;
  setLoading(true);

  // Helper function for a "sleep" delay
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const runAITransformation = async (attempt = 1) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const prompt = `Act as a Product Architect. Analyze the provided patent text or image.
Output ONLY a JSON object with the following structure:

{
  "title": "A professional, high-level marketing name for the invention",
  "difficulty": "X/10",
  "summary": "A single detailed paragraph explaining how the technology works and its core utility.",
  "ideas": [
    "Product Name 1: A description of a real-world use case or specific product application.",
    "Product Name 2: A description of a second real-world use case or specific product application.",
    "Product Name 3: A description of a third real-world use case or specific product application."
  ]
}

Instructions:
1. The 'difficulty' should be an estimate (e.g., 8/10) but should be a number eg(8).
2. The 'ideas' array MUST contain exactly 3 items.
3. Each idea must follow the format 'Product Name: Description'.
4. Do not include markdown formatting like \`\`\`json.`;

      let result;
      if (file) {
        const imagePart = await fileToGenerativePart(file);
        result = await model.generateContent([prompt, text, imagePart]);
      } else {
        result = await model.generateContent(prompt + ` Text: ${text}`);
      }

      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, ""));
    } catch (error) {
      // If error is 503 (Overloaded) and we haven't retried yet
      if (error.message.includes("503") && attempt < 2) {
        console.log("Model overloaded. Retrying in 3 seconds...");
        await delay(3000);
        return runAITransformation(attempt + 1);
      }
      throw error; // If it fails again or isn't a 503, throw the error
    }
  };

  try {
    const cleanJson = await runAITransformation();

    await addDoc(collection(db, "patents"), {
      ...cleanJson,
      score: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: serverTimestamp(),
      rawText: text || "Uploaded via File"
    });

    alert("Patent Rescued!");
    setText('');
    setFile(null);
  } catch (error) {
    console.error("Final AI Error:", error);
    alert("The AI server is very busy right now. Please wait a minute and try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="upload-section" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px' }}>
      <h2 style={{ color: 'white' }}>Rescue an Invention</h2>
      <p style={{ color: '#94a3b8' }}>Paste text OR upload an image/PDF of the patent blueprint.</p>
      
      <textarea 
        style={{ 
          width: '100%', height: '120px', background: '#0f172a', color: 'white', 
          border: '1px solid #334155', borderRadius: '8px', padding: '1rem', margin: '1rem 0' 
        }}
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="file" 
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: '#94a3b8', fontSize: '0.9rem' }}
        />
        {file && <p style={{ color: '#4ade80', fontSize: '0.8rem' }}>File selected: {file.name}</p>}
      </div>
      
      <button 
        className="btn-primary" 
        onClick={handleDecode}
        disabled={loading}
        style={{ 
          width: '100%', padding: '1rem', background: '#6366f1', color: 'white', 
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
        }}
      >
        {loading ? "AI is Decoding..." : "Transform Patent"}
      </button>
    </div>
  );
};

export default UploadPage;