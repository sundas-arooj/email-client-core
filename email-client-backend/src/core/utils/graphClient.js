const { ConfidentialClientApplication } = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

const emailModel = require('../business-models/email');
const userModel = require('../business-models/user');
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

    const subscription = await graphClient
      .api('/subscriptions')
      .post({
        changeType: 'created,updated,deleted',
        notificationUrl: `${process.env.APP_URL}/notification`,
        resource: `me/mailFolders('inbox')/messages?$select=subject,receivedDateTime,from,bodyPreview,isRead`,
        expirationDateTime: new Date(new Date().getTime() + 3600 * 1000 * 48).toISOString(), // 48 hours from now
        clientState: 'secretClientValue',
        includeResourceData: true
      });

    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

exports.processNotification = async (notification) => {
  const emailId = notification.value[0].resourceData.id;
  const eventType = notification.value[0].changeType;
  const userEmail = notification.value[0].resourceData.userPrincipalName;
  const io = socketIO.getIO();

  if (eventType === 'deleted') {
    await emailModel.deleteEmail(emailId);
    io.emit('emailDeleted', { emailId });
  } else {
    const { accessToken } = await userModel.fetchUserTokens(userEmail);
    const emailData = await this.getEmailData(accessToken, emailId);
    await emailModel.indexOrUpdateEmail(emailData);
    io.emit('emailUpdated', { emailData });
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
      .select('id,subject,receivedDateTime,from,bodyPreview,isRead')
      .get();
  
    return emailData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}