import axios from 'axios';
import config from '../config/config';

export const fetchEmails = async (email) => {
    const response = await axios.get(`${config.API_URL}/api/emails`, {
        params: { email }
    });
    return response.data;
};

export const fetchUser = async (email) => {
    const response = await axios.get(`${config.API_URL}/user/${email}`);
    return response.data;
};

export const registerUser = async (email, password) => {
    const response = await axios.post(`${config.API_URL}/user/register`, { 
        email,
        password 
    });
    return response.data;
};
