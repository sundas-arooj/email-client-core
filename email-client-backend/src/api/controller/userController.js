const userService = require('../../services/userService');

exports.register = async (req, res) => {
    try {
        const user = await userService.register(req.body);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.query;
        const user = await userService.getUserById(id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await userService.getUserByEmail(email);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};