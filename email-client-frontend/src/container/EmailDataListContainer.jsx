import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadEmails } from '../state/emailSlice';
import EmailData from '../component/EmailDataList';
import config from '../config/config';
import io from 'socket.io-client';

const EmailDataListContainer = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.details);
    const emails = useSelector((state) => state.emails.items);
    const emailStatus = useSelector((state) => state.emails.status);
    const socket = io(`${config.API_URL}`);

    useEffect(() => {
        socket.on('emailUpdated', (data) => {
            dispatch(loadEmails(user.email));
        });
    
        socket.on('emailDeleted', (data) => {
            dispatch(loadEmails(user.email));
        });
    
        return () => {
          socket.off('emailUpdated');
          socket.off('emailDeleted');
        };
      }, [dispatch, socket, user]);

    useEffect(() => {
        if (user) {
            dispatch(loadEmails(user.email));
        }
    }, [dispatch, user]);

    return (
        <div>
            <h1>Email Sync Page</h1>
            {emailStatus === 'loading' && <div>Loading emails...</div>}
            {emailStatus === 'succeeded' && <EmailData emails={emails} />}
            {emailStatus === 'failed' && <div>Error loading emails</div>}
        </div>
    );
};

export default EmailDataListContainer;
