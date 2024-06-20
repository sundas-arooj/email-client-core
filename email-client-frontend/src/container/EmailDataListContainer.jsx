import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadEmails } from '../state/emailSlice';
import { loadFolders } from '../state/folderSlice';
import io from 'socket.io-client';
import EmailDataList from '../component/EmailDataList';
import config from '../config/config';

const EmailDataListContainer = () => {
  const [foldersHierarchy, setFoldersHierarchy] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.details);
  const emails = useSelector((state) => state.emails.items);
  const emailStatus = useSelector((state) => state.emails.status);
  const folders = useSelector((state) => state.folders.items);
  const socket = io(`${config.API_URL}`);

  useEffect(() => {
    if (user) {
        fetchInitialData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  useEffect(() => {
    socket.on('folderUpdated', (data) => {
      dispatch(loadEmails(user.email, selectedFolder));
    });

    socket.on('folderDeleted', (data) => {
      dispatch(loadEmails(user.email, selectedFolder));
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

  const fetchInitialData = async () => {
    try {
      dispatch(loadFolders(user.email));
      setFoldersHierarchy(buildFolderHierarchy());

      // Fetch emails for the default folder initially
      const defaultFolder = getDefaultFolder();
      if (defaultFolder) {
        dispatch(loadEmails(user.email, defaultFolder.folderId));
        setSelectedFolder(defaultFolder);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const getDefaultFolder = () => {
    // Assuming the default folder is the Inbox
    return folders.find(folder => folder.folderName === 'Inbox');
  };

  const buildFolderHierarchy = () => {
    const folderMap = {};
    folders.forEach(folder => folderMap[folder.folderId] = { ...folder, subFolders: [] });

    const rootFolders = [];
    folders.forEach(folder => {
      if (folder.parentFolderId) {
        folderMap[folder.parentFolderId].subFolders.push(folderMap[folder.folderId]);
      } else {
        rootFolders.push(folderMap[folder.folderId]);
      }
    });

    return rootFolders;
  };

  const fetchEmails = async (folder) => {
    try {
        dispatch(loadEmails(user.email, folder.folderId));
        setSelectedFolder(folder);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  return (
    <div>
        <h1>Email Sync Page</h1>
        {emailStatus === 'loading' && <div>Loading emails...</div>}
        {emailStatus === 'succeeded' && <EmailDataList
            emails={emails}
            folders={foldersHierarchy}
            selectedFolder={selectedFolder}
            fetchEmails={fetchEmails}
        /> }
        {emailStatus === 'failed' && <div>Error loading emails</div>}
    </div>
  );
};

export default EmailDataListContainer;
