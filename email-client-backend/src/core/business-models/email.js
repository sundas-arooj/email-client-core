const elasticsearch = require('../utils/elasticsearch');
const userModel = require('./user');
const folderModel = require('./folder');

exports.indexEmail = async (emailData, email, folderId) => {
    const userId = await userModel.fetchUserByEmail(email).then(user => user.id);
    await elasticsearch.index({
        index: 'emails',
        id: emailData.Id,
        body: {
            userId: userId,
            subject: emailData.Subject,
            sender: emailData.From.Mailbox.EmailAddress,
            bodyPreview: emailData.Preview,
            receivedDate: emailData.DateTimeReceived,
            isRead: emailData.IsRead,
            flag: emailData.Flag.FlagStatus,
            folderId: folderId,
            ...emailData
        }
    });
};

exports.indexOrUpdateEmail = async (emailData, email, folderId) => {
    const emailId = emailData.id;
  
    // Check if the email document already exists
    const emailExists = await elasticsearch.exists({
      index: 'emails',
      id: emailId
    });
  
    if (emailExists) {
      await this.updateEmail(emailData, folderId);
    } else {
      await this.indexEmail(emailData, email, folderId);
    }
  }
  
exports.getEmailById = async (emailId) => {
    try {
        const email = await elasticsearch.get({
            index: 'emails',
            id: emailId
        });
        return email._source;
    } catch (error) {
        console.error('Error getting email by id:', error);
        throw error;
    }
};

exports.getEmails = async (email, folderId) => {
    const userId = await userModel.fetchUserByEmail(email).then(user => user.id);
    const result = await elasticsearch.search({
        index: 'emails',
        body: {
            query: {
                match: { userId: userId, folderId: folderId }
            }
        }
    });

    const folder = await folderModel.getFolderById(folderId);
    const emails = result.hits.hits.map(hit => hit._source);

    // Map folder details to emails
    const emailsWithFolderDetails = emails.map(email => {
        return { ...email, folder };
    });

    return emailsWithFolderDetails;
};

exports.updateEmail = async (emailData, folderId) => {
    const data = await this.getEmailById(emailData.Id);
    await elasticsearch.update({
        index: 'emails',
        id: emailData.Id,
        body: {
            doc: {
                userId: data.userId,
                subject: emailData.Subject,
                sender: emailData.From.Mailbox.EmailAddress,
                body_preview: emailData.Preview,
                received_date: emailData.DateTimeReceived,
                is_read: emailData.IsRead,
                flag: emailData.Flag.FlagStatus,
                folderId: folderId || data.folderId,
                ...emailData,
            }
        }
    });
};

exports.deleteEmail = async (emailId) => {
    await elasticsearch.delete({
      index: 'emails',
      id: emailId
    });
};

exports.deleteFolder = async (folderId) => {
    try {
      await elasticsearch.deleteByQuery({
        index: 'emails',
        body: {
          query: {
            match: { folderId: folderId }
          }
        }
      });
    } catch (error) {
      console.error('Error deleting emails in folder:', error);
      throw error;
    }
  };
  
