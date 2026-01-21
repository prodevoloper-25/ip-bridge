import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase.js';
import {
  collection, onSnapshot, query, orderBy
} from 'firebase/firestore';

const InnovationCard = ({ data }) => {
  const displayDate = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : "No Date";

  return (
    <div className="innovation-card-wrapper">
      <div className="innovation-card-content">
        <div className="innovation-card-header">
          <h3 className="innovation-card-title">
            {typeof data.title === 'object' ? data.title.title : data.title}
          </h3>
        </div>

        {/* NEW: Metadata row for Difficulty and Date below the title */}
        <div className="innovation-card-meta-row">
          <span className="difficulty-badge">Diff: {data.difficulty}/10</span>
          <span className="innovation-card-date">{displayDate}</span>
        </div>
        
        <p className="innovation-card-summary">
          {typeof data.summary === 'object' ? data.summary.description : data.summary}
        </p>
        
        <div className="innovation-card-section">
          <h4 className="innovation-card-section-title">Potential Products</h4>
          <ul className="product-idea-list">
            {data.ideas?.map((idea, i) => (
              <li key={i}>
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

  if (loading) return <div className="gallery-page-loading">Loading Trending Innovations...</div>;

  return (
    <div className="gallery-page-container">
      <h2 className="gallery-page-title">Trending Inventions</h2>
      <div className="innovation-grid">
        {innovations.length === 0 ? (
          <p className="gallery-page-empty">No patents found in the database.</p>
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