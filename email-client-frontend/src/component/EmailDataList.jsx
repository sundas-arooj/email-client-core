import React from 'react';

const EmailDataList = ({ emails, folders, selectedFolder, fetchEmails }) => {
  const renderEmails = (emails) => {
    return emails.map((email) => (
      <li key={email.id}>
        <strong>From:</strong> {email.sender} <br />
        <strong>To:</strong> {email.ToRecipients.map(recipient => recipient.EmailAddress).join(', ')} <br />
        <strong>CC:</strong> {email.CcRecipients.map(recipient => recipient.EmailAddress).join(', ')} <br />
        <strong>BCC:</strong> {email.BccRecipients.map(recipient => recipient.EmailAddress).join(', ')} <br />
        <strong>Subject:</strong> {email.subject} <br />
        <strong>Received:</strong> {new Date(email.receivedDate).toLocaleString()} <br />
        <strong>Body Preview:</strong> {email.bodyPreview} <br />
        <strong>Status:</strong> {email.isRead ? "Read" : "Unread"} <br />
        <strong>Importance:</strong> {email.Importance} <br />
        <strong>Flag:</strong> {email.flag} <br />
        <strong>Body:</strong> <div dangerouslySetInnerHTML={{ __html: email.UniqueBody.Value }} />
      </li>
    ));
  };

  const renderFolders = (folders) => {
    return folders.map((folder) => (
      <li key={folder.folderId} onClick={() => fetchEmails(folder)}>
        {folder.folderName}
        {folder.subFolders && folder.subFolders.length > 0 && (
          <ul>
            {renderFolders(folder.subFolders)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div>
      <h2>Emails</h2>
      <div>
        <h3>Folders</h3>
        <ul>
          {renderFolders(folders)}
        </ul>
      </div>
      <div>
        <h3>Selected Folder: {selectedFolder.folderName}</h3>
        <ul>
          {renderEmails(emails)}
        </ul>
      </div>
    </div>
  );
};

export default EmailDataList;

