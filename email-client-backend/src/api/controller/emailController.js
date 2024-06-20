const emailService = require('../../services/emailService');

exports.getEmails = async (req, res) => {
    try {
        const { email, folderId } = req.query;
        const emails = await emailService.getEmails(email, folderId);
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
