import React, { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert(err.message); }
  };

  const handleGoogle = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (err) { alert(err.message); }
  };

  return (
    <div className="auth-card">
      <h2>Login to IP-BRIDGE</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <button onClick={handleGoogle} className="btn-google">Sign in with Google</button>
      <p onClick={onSwitch}>Don't have an account? <span>Sign Up</span></p>
    </div>
  );
};

export default Login;