const folderModel = require('../../core/business-models/folder');

exports.getFoldersByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const folders = await folderModel.getFoldersByEmail(email);
        res.json(folders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};