import axios from 'axios';
import config from '../config/config';

export const fetchEmails = async (email, folderId) => {
    const response = await axios.get(`${config.API_URL}/api/emails`, {
        params: { email, folderId }
    });
    return response.data;
};

export const fetchUser = async (email) => {
    const response = await axios.get(`${config.API_URL}/user/${email}`);
    return response.data;
};

export const fetchFolders = async (email) => {
    const response = await axios.get(`${config.API_URL}/folder/${email}`);
    return response.data;
};

export const registerUser = async (email, password) => {
    const response = await axios.post(`${config.API_URL}/user/register`, { 
        email,
        password 
    });
    return response.data;
};
