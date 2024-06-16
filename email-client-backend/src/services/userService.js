const userModel = require('../core/business-models/user');
const graphClient = require('../core/utils/graphClient');

exports.register = async ({ email, password }) => {
    const user = await userModel.createUser(email, password);
    const authUrl = await graphClient.getAuthUrl(email);
    return { user, authUrl };
};

exports.getUserById = async (userId) => {
    return userModel.fetchUserById(userId);
};

exports.getUserByEmail = async (email) => {
    return userModel.fetchUserByEmail(email);
};
