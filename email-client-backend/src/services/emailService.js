const emailModel = require('../core/business-models/email');

exports.getEmails = async (email) => {
    return emailModel.getEmails(email);
};

exports.updateEmail = async (emailData) => {
    return emailModel.updateEmail(emailData);
};