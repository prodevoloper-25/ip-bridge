// src/utils/getUserId.js

export const getUserId = () => {
  // Check if a user ID already exists in this browser's memory
  let userId = localStorage.getItem('ip_bridge_user_id');
  
  // If no ID exists, create a new random one
  if (!userId) {
    // Generates a string like "guest_x92k1ls0"
    userId = 'guest_' + Math.random().toString(36).substr(2, 9);
    
    // Save it so the user stays the same when they refresh
    localStorage.setItem('ip_bridge_user_id', userId);
  }
  
  return userId;
};