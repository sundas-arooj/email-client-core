# Email Client Backend

## Overview
This application allows users to register and log in using their Outlook accounts, sync their email data with an Elasticsearch database, and monitor real-time changes in their inbox using webhooks. It utilizes OAuth2 for authentication, the Microsoft Graph API for accessing email data, and Elasticsearch for storing and indexing emails.


## Features

- OAuth authentication with Outlook
- Syncing email data to Elasticsearch
- Real-time updates using webhooks
- RESTful API endpoints for user registration and email retrieval

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sundas-arooj/email-client-core.git

2. Navigate to the frontend directory:
    ```bash
    cd email-client-backend

3. Install dependencies:
    ```bash
    npm install

4. Configure environment variables:

Create and configure the .env file in root directory

5. Run the app
    ```bash
    npm start
    
Server is running on [http://localhost:3000](http://localhost:3000)

## Environment Variables
Ensure you have a `.env` file with the following variables:
- `PORT`: Port on which the server runs.
- `OUTLOOK_CLIENT_ID`: Client ID from your Outlook app registration.
- `OUTLOOK_CLIENT_SECRET`: Client secret from your Outlook app registration.
- `APP_URL`: Base URL of your application (e.g., http://localhost:3000).
- `FRONTEND_URL`: Base URL of your frontend application (e.g., http://localhost:3001).
- `ELASTICSEARCH_URL`: Base URL of elasticsearch (e.g., http://localhost:9200).

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **MSAL (Microsoft Authentication Library)**: Handles OAuth2 authentication.
- **Microsoft Graph Client**: Accesses Microsoft Graph API.
- **Elasticsearch**: Search and analytics engine.
- **Axios**: HTTP client for making API requests.
- **bcrypt**: Library for hashing passwords.
- **dotenv**: Loads environment variables from a .env file.

## Endpoints
1. **User Registration**
   - **Endpoint**: `/user/register`
   - **Method**: POST
   - **Description**: Registers a new user and provides an OAuth URL for Outlook login.
   - **Request Body**: `{ "email": "user@example.com", "password": "password" }`
   - **Response**: `{ "authUrl": "https://login.microsoftonline.com/...", "user": { id: 1, email: "email@outlook.com", ...} }`

2. **OAuth Authentication**
   - **Endpoint**: `/auth/outlook`
   - **Method**: GET
   - **Description**: Initiates the OAuth flow by redirecting the user to Outlook login.

3. **OAuth Callback**
   - **Endpoint**: `/auth/outlook/callback`
   - **Method**: GET
   - **Description**: Handles the callback from Outlook after user authentication. Saves user details, creates a subscription for notifications, and syncs email data.

4. **Webhook Notification**
   - **Endpoint**: `/webhook/outlook-notification`
   - **Method**: POST
   - **Description**: Receives notifications from Microsoft Graph about changes in the user's inbox. Processes the notifications to update email data in Elasticsearch.

5. **Get Emails Data by user email**
   - **Endpoint**: `/api/emails?email=email@outlook.com`
   - **Method**: GET
   - **Description**: Retrieve emailData for user with email
   - **Params**: `email` (Email)

6. **Get Email by ID**
   - **Endpoint**: `/user/:email`
   - **Method**: GET
   - **Description**: Retrieves user by its email from Elasticsearch.
   - **Params**: `email` (Email)

## Project Structure
1. **App file**
    - The file app.js is the starting point of the project

2. **Routes**
    - It in src/api/routes folder
    - All the endpoint routes defined in this folder in different files

3. **Controllers**
    - It in src/api/controller folder
    - All the functions called against routes are in these files
    - Each route file has its controller file

4. **Services**
    - It in src/services folder
    - Any logical changes or calling functions for db operations defined in these file
    - Each controller file has its service file

5. **Business Models**
    - It in src/core/business-models folder
    - All the DB related operations are defined in these files
    - We have separate file for each index

6. **Utils**
    - It in src/core/utils folder
    - All the general reusable functions are defined in util files

7. **Config**
    - It in /config folder
    - It contain passport file for configuration to authenticate the user

## Functions
1. **createUser**
   - **Description**: Creates a new user in Elasticsearch with a hashed password.
   - **Parameters**: `email` (string), `password` (string)

2. **updateUserTokens**
   - **Description**: Updates the user's access token in Elasticsearch.
   - **Parameters**: `email` (string), `accessToken` (string), `refreshToken` (string)

3. **fetchUserTokens**
   - **Description**: Retrieves the tokens for a user from Elasticsearch.
   - **Parameters**: `email` (string)

4. **getOutlookEmails**
   - **Description**: Get the latest emails from the user's inbox to Elasticsearch.
   - **Parameters**: `accessToken` (string), `email` (string)

5. **createSubscription**
   - **Description**: Creates a subscription with Microsoft Graph to receive notifications about changes in the user's inbox.
   - **Parameters**: `accessToken` (string)

6. **processNotification**
   - **Description**: Processes notifications from Microsoft Graph and updates email data in Elasticsearch.
   - **Parameters**: `notifications` (array)

7. **deleteEmail**
   - **Description**: Deletes an email from Elasticsearch.
   - **Parameters**: `emailId` (string)

8. **indexOrUpdateEmail**
   - **Description**: Indexes or updates an emailData in Elasticsearch.
   - **Parameters**: `emailData` (object), `email` (string)

9. **getEmailData**
   - **Description**: Retrieves email data from Microsoft Graph.
   - **Parameters**: `accessToken` (string), `emailId` (string)

10. **getEmailById**
    - **Description**: Retrieves an email from Elasticsearch by its ID.
    - **Parameters**: `emailId` (string)
