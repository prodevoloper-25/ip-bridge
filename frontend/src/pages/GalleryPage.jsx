import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase.js';
import {
  collection, onSnapshot, query, orderBy
} from 'firebase/firestore';

const InnovationCard = ({ data }) => {
  // Safe conversion for the date
  const displayDate = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : "No Date";

  return (
    <div className="innovation-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '1.5rem', 
      border: '1px solid #334155', 
      borderRadius: '12px', 
      marginBottom: '1rem',
      background: '#0f172a' 
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          
          {/* FIX: If data.title is an object {title, description, keywords}, 
              access it as data.title.title */}
          <h3 style={{ color: '#818cf8', margin: 0 }}>
            {typeof data.title === 'object' ? data.title.title : data.title}
          </h3>

          <div style={{ textAlign: 'right' }}>
            <span className="difficulty-badge" style={{ 
              fontSize: '0.7rem', 
              background: '#1e293b', 
              color: '#94a3b8',
              padding: '2px 8px', 
              borderRadius: '10px',
              border: '1px solid #334155',
              display: 'block',
              marginBottom: '4px'
            }}>
              Diff: {data.difficulty}/10
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{displayDate}</span>
          </div>
        </div>
        
        {/* FIX: Check if summary is an object or string */}
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0.8rem 0', lineHeight: '1.5' }}>
          {typeof data.summary === 'object' ? data.summary.description : data.summary}
        </p>
        
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
          <h4 style={{ fontSize: '0.7rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Potential Products
          </h4>
          <ul className="product-idea-list" style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {data.ideas?.map((idea, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                {/* Ensure idea is a string */}
                {typeof idea === 'object' ? JSON.stringify(idea) : idea}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [innovations, setInnovations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Correctly accessing the collection
    const q = query(collection(db, "patents"), orderBy("score", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Mapping over docs to extract data and the document ID
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setInnovations(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading Trending Innovations...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>Trending Inventions</h2>
      <div className="innovation-grid">
        {innovations.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No patents found in the database.</p>
        ) : (
          innovations.map((item) => (
            <InnovationCard key={item.id} data={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryPage;