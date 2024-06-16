const emailService = require('../../services/emailService');

exports.getEmails = async (req, res) => {
    try {
        const { email } = req.query;
        const emails = await emailService.getEmails(email);
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
