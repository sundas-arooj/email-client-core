import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '../state/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userEmail = params.get('userEmail');
        if (userEmail) {
            dispatch(loadUser(userEmail)).then(() => {
                navigate('/sync');
            });
        }
    }, [dispatch, navigate, location]);

    return <div>Authenticating...</div>;
};

export default AuthCallback;
