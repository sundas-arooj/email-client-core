const cron = require('node-cron');
const { fetchAllEmails } = require('../../core/utils/graphClient');
const userModel = require('../../core/business-models/user');

const runJob = async () => {
    console.log('Running cron job to sync all mailbox data');
    const users = await userModel.fetchAllUsers(); // Implement this function to get all users from your database
  
    for (const user of users) {
      await fetchAllEmails(user.accessToken, user.email, true);
    }
};

cron.schedule('*/10 * * * *', runJob);

module.exports = { runJob };