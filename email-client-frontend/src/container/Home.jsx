import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Email Sync</h1>
            <Link to="/add-account">Add Outlook Account</Link><br/><br/>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Home;
