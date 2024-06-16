import React from 'react';

const EmailList = ({ emails }) => {
    return (
      <div>
        <h2>Emails</h2>
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <strong>From:</strong> {email.sender} <br />
              <strong>Subject:</strong> {email.subject} <br />
              <strong>Received:</strong> {email.received_date} <br />
              <strong>Preview:</strong> {email.body_preview} <br />
              <strong>Status:</strong> {email.is_read ? "Read" : "Unread"}
            </li>
          ))}
        </ul>
      </div>
    );
};

export default EmailList;
