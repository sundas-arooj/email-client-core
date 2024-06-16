const elasticsearch = require('../utils/elasticsearch');
const userModel = require('./user');

exports.indexEmail = async (emailData, email) => {
    const userId = await userModel.fetchUserByEmail(email).then(user => user.id);
    await elasticsearch.index({
        index: 'emails',
        id: emailData.Id,
        body: {
            user_id: userId,
            subject: emailData.Subject,
            sender: emailData.From.EmailAddress.Address,
            body_preview: emailData.BodyPreview,
            received_date: emailData.ReceivedDateTime,
            is_read: emailData.IsRead
        }
    });
};

exports.indexOrUpdateEmail = async (emailData, email) => {
    const emailId = emailData.id;
  
    // Check if the email document already exists
    const emailExists = await elasticsearch.exists({
      index: 'emails',
      id: emailId
    });
  
    if (emailExists) {
      await this.updateEmail(emailData);
    } else {
      await this.indexEmail(emailData, email);
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

exports.getEmails = async (email) => {
    const userId = await userModel.fetchUserByEmail(email).then(user => user.id);
    const result = await elasticsearch.search({
        index: 'emails',
        body: {
            query: {
                match: { user_id: userId }
            }
        }
    });
    return result.hits.hits.map(hit => hit._source);
};

exports.updateEmail = async (emailData) => {
    const data = await this.getEmailById(emailData.Id);
    await elasticsearch.update({
        index: 'emails',
        id: emailData.Id,
        body: {
            doc: {
                ...emailData,
                userId: data.userId
            }
        }
    });
};

exports.deleteEmail = async (emailId) => {
    await elasticsearch.delete({
      index: 'emails',
      id: emailId
    });
  }
