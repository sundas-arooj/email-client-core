import React, { useState, useEffect } from 'react';
import { registerUser } from '../utils/api';

const AddAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  }, [authUrl]);

  const handleRegister = async () => {
    try {
      const response = await registerUser(email, password);
      setAuthUrl(response.authUrl);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
      }}
    >
      <input
        style={{ marginBottom: "10px" }}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={{ marginBottom: "10px" }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {authUrl && (
        <div>
          <a href={authUrl}>Link Outlook Account</a>
        </div>
      )}
    </div>
  );
};

export default AddAccount;
