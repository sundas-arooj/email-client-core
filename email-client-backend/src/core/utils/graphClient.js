const { ConfidentialClientApplication } = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

const emailModel = require('../business-models/email');
const userModel = require('../business-models/user');
const folderModel = require('../business-models/folder');
const socketIO = require('./socketIO');

const msalConfig = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  }
};
  
const pca = new ConfidentialClientApplication(msalConfig);

exports.getOutlookEmails = async (accessToken, email) => {
  try {
    const graphClient = Client.init({
    authProvider: async (done) => {
        try {
        done(null, accessToken);
        } catch (err) {
        done(err, null);
        }
    }
    });

    const result = await graphClient
      .api('/me/mailfolders/inbox/messages')
      .top(100)
      .select('subject,receivedDateTime,from,bodyPreview,isRead')
      .get();

    // Save emails to local database
    for (const message of result.value) {
      await emailModel.indexOrUpdateEmail(message, email);
    }

    // Create a subscription for webhook notifications
    await this.createSubscription(accessToken);
  } catch (error) {
    console.error('Error syncing emails:', error);
    throw error;
  }
}

exports.createSubscription = async (accessToken) => {
  try {
    const graphClient = Client.init({
      authProvider: async (done) => {
        done(null, accessToken);
      }
    });

    // Define the subscription payload
    const subscriptionPayload = {
      changeType: 'created,updated,deleted',
      notificationUrl: `${process.env.APP_URL}/notification`,
      resource: 'me/mailFolders',
      expirationDateTime: new Date(new Date().getTime() + 3600 * 1000 * 48).toISOString(), // 48 hours from now
      clientState: 'secretClientValue',
      includeResourceData: true
    };

    // Create the subscription
    const subscription = await graphClient.api('/subscriptions').post(subscriptionPayload);

    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

exports.processNotification = async (notification) => {
  try {
    const userEmail = notification.value[0].resourceData.userPrincipalName;
    const io = socketIO.getIO();

    for (const change of notification.value) {
      const eventType = change.changeType;
      const folderId = change.resourceData.id;

      if (eventType === 'deleted') {
        await emailModel.deleteFolder(folderId);
        io.emit('folderDeleted', { folderId });
      } else {
        const { accessToken } = await userModel.fetchUserTokens(userEmail);
        const graphClient = Client.init({
          authProvider: async (done) => {
            done(null, accessToken);
          }
        });
    
        await this.fetchEmailsFromFolder(graphClient, folderId, userEmail);

        io.emit('folderUpdated', { folderId });
      }
    }
  } catch (error) {
    console.error('Error processing notification:', error);
    throw error;
  }
};

exports.getAuthUrl = async (email) => {
  const authCodeUrlParameters = {
    scopes: ['https://graph.microsoft.com/.default'],
    redirectUri: `${process.env.APP_URL}/auth/outlook/callback`,
    state: email,
  };

  const tokenResponse = await pca.getAuthCodeUrl(authCodeUrlParameters);

  return tokenResponse;
};

exports.getAuthToken = async (code) => {
  const tokenRequest = {
    code: code,
    scopes: ['https://graph.microsoft.com/.default'],
    redirectUri: `${process.env.APP_URL}/auth/outlook/callback`,
  };

  const tokenResponse = await pca.acquireTokenByCode(tokenRequest);

  const userDetails = tokenResponse.account;
  const accessToken = tokenResponse.idToken;

  return { accessToken, email: userDetails.username };
};

exports.getEmailData = async (accessToken, emailId) => {
  try {
    const graphClient = Client.init({
      authProvider: async (done) => {
        try {
          done(null, accessToken);
        } catch (err) {
          done(err, null);
        }
      }
    });
  
    const emailData = await graphClient
      .api(`/me/messages/${emailId}`)
      .get();
  
    return emailData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.fetchEmailsFromFolder = async (graphClient, folderId, email) => {
  try {
    const messages = await graphClient
      .api(`/me/mailFolders/${folderId}/messages`)
      .get(); // Fetch all data

    for (const message of messages.value) {
      await emailModel.indexOrUpdateEmail(message, email, folderId);
    }
  } catch (error) {
    console.error(`Error fetching emails from folder ${folderId}:`, error);
  }
};

exports.fetchAllEmails = async (accessToken, email, isCronJob = false) => {
  if (!accessToken || !email) {
    console.error('No access token or email provided');
    return;
  }

  try {
    const graphClient = Client.init({
      authProvider: async (done) => {
        done(null, accessToken);
      }
    });

    // Fetch all mail folders
    await this.fetchMailFolders(graphClient, email);

    if (!isCronJob) {
      await this.createSubscription(accessToken);
    }
  } catch (error) {
    console.error('Error fetching all emails:', error);
  }
}

exports.fetchMailFolders = async (graphClient, email, parentFolderId = null) => {
  const endpoint = parentFolderId ? `/me/mailFolders/${parentFolderId}/childFolders` : '/me/mailFolders';
  const mailFolders = await graphClient.api(endpoint).get();

  for (const folder of mailFolders.value) {
    await this.fetchEmailsFromFolder(graphClient, folder.id, email);
    await folderModel.storeFolderData(folder, email, parentFolderId);
    await this.fetchMailFolders(graphClient, email, folder.id); // Recursively fetch sub-folders
  }
};
