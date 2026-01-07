import React from 'react';
import UploadPage from '../src/pages/UploadPage';
import GalleryPage from '../src/pages/GalleryPage';
import '../src/styles.css';

// Mock data representing what Gemini would save to Firebase
const MOCK_DATA = [
  {
    id: 1,
    title: "Ultra-Efficient Solid State Cooling",
    summary: "A thermal management system using graphene-based polymers to dissipate heat 400% faster than copper.",
    difficulty: 7,
    ideas: ["Silent Gaming Laptops", "Everlasting EV Batteries", "Compact Space Satellites"]
  },
  {
    id: 2,
    title: "Atmospheric Water Harvester",
    summary: "A passive metal-organic framework (MOF) that pulls drinkable water from 10% humidity air using only solar heat.",
    difficulty: 4,
    ideas: ["Desert Survival Kits", "Off-grid Greenhouse Irrigation", "Emergency Disaster Relief Unit"]
  }
];

function App() {
  return (
    <div className="container">
      <header style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>IP-BRIDGE</h1>
        <p style={{ color: '#94a3b8' }}>Turning Dusty Patents into Future Products</p>
      </header>
      
      <UploadPage />
      <GalleryPage innovations={MOCK_DATA} />
    </div>
  );
}

export default App;