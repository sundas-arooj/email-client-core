const emailModel = require('../core/business-models/email');

exports.getEmails = async (email, folderId) => {
    return emailModel.getEmails(email, folderId);
};

exports.updateEmail = async (emailData) => {
    return emailModel.updateEmail(emailData);
};