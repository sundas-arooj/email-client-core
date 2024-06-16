import React, { useState } from 'react';
import config from '../config/config';

const Login = () => {
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    window.location.href = `${config.FRONT_END_URL}/auth/callback?userEmail=${email}`;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <h2>Login with Outlook</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input type="email" value={email} onChange={handleEmailChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
