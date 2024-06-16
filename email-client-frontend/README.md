# Email Client Frontend

This is Email Client Frontend repository! This is the frontend application for managing emails, built with React. It communicates with the backend server to authenticate users, retrieve email data, and display it in a user-friendly interface.

## Features

- Register user account
- User authentication via OAuth with Outlook
- Display of synchronized email data
- Real-time updates for email changes

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sundas-arooj/email-client-core.git

2. Navigate to the frontend directory:
    ```bash
    cd email-client-frontend

3. Install dependencies:
    ```bash
    npm install

4. Configure environment variables:

Create and configure the .env file in root directory

## Usage
1. Start the development server:

    ```bash
    npm start
2. Open your browser and visit [http://localhost:3001](http://localhost:3001) to access the Email Client application.

3. Register your account by clicking on `Add Outlook Account` and Authenticate with your Outlook account to sync email data.

## Technologies Used

- React
- React Router
- Axios (HTTP client)
- Socket.IO Client (for real-time updates)
