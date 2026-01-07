import React, { useState } from 'react';
import { db } from '../config/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

const UploadPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  // ⚠️ MVP WARNING: In production, call Gemini from a backend (Cloud Function) 
  // to keep your API Key hidden. For a local MVP, this works:
  const genAI = new GoogleGenerativeAI("AIzaSyAo-ZHJgu5Vc-rQr5nOB99bZ7bUNw6GS_I");

  const handleDecode = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      // 1. Initialize Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // 2. The "Product Architect" Prompt
      const prompt = `
        Act as a World-Class Product Architect. I will provide a patent description. 
        Ignore the legal jargon and identify the core engineering secret.
        
        Output strictly in this JSON format:
        {
          "title": "Short catchy product-focused title",
          "summary": "One sentence simplified explanation of the tech",
          "ideas": ["Idea 1", "Idea 2", "Idea 3"],
          "difficulty": integer between 1 and 10
        }

        Patent text: ${text}
      `;

      // 3. Get AI Response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanJson = JSON.parse(response.text().replace(/```json|```/g, ""));

      // 4. Save to Firestore
      await addDoc(collection(db, "patents"), {
        ...cleanJson,
        score: 0,
        upvotes: 0,
        downvotes: 0,
        createdAt: serverTimestamp(),
        rawText: text // Optional: keep for reference
      });

      alert("Patent Rescued! It's now live in the gallery.");
      setText('');
    } catch (error) {
      console.error("AI Transformation Error:", error);
      alert("Failed to decode. Ensure your API key is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px' }}>
      <h2 style={{ color: 'white' }}>Rescue an Invention</h2>
      <p style={{ color: '#94a3b8' }}>Paste the patent abstract below. Our AI will decode it into a product blueprint.</p>
      
      <textarea 
        style={{ 
          width: '100%', height: '150px', background: '#0f172a', color: 'white', 
          border: '1px solid #334155', borderRadius: '8px', padding: '1rem', margin: '1rem 0' 
        }}
        placeholder="Paste 'Legalese' (Abstract or Description) here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <button 
        className="btn-primary" 
        onClick={handleDecode}
        disabled={loading}
        style={{ 
          width: '100%', padding: '1rem', background: '#6366f1', color: 'white', 
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
        }}
      >
        {loading ? "AI is Decoding Secrets..." : "Transform Patent"}
      </button>
    </div>
  );
};

export default UploadPage;