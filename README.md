# Email Client Core

## Overview
The Email Client project is a full-stack application that allows users to register and log in using their Outlook accounts, sync their email data with an Elasticsearch database, and monitor real-time changes in their inbox using webhooks.

## Setup
1. Clone the repository:

   ```bash
    git clone https://github.com/sundas-arooj/email-client-core.git

2. Setup Elasticsearch with docker compose
Run in terminal:
    ```bash
    cd email-client-backend
    docker-compose up

3. Follow the setup guide mentioned in both projects separtely 

### Backend
The backend is built with Node.js and Express, handling authentication, data synchronization, and real-time updates.

## Frontend
The frontend is built with React and connects to the backend services to display and update email data in real-time. It uses Redux for state management and Socket.IO for real-time updates.
