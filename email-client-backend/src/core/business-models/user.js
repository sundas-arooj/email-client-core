const elasticsearch = require('../utils/elasticsearch');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const user = {
        id: userId,
        email,
        password: hashedPassword,
        accessToken: null,
        refreshToken: null
    };
    await elasticsearch.index({
        index: 'users',
        id: userId,
        body: user
    });
    console.log(user);
    return user;
};

exports.updateUserTokens = async (email, accessToken, refreshToken) => {
    const userId = await this.fetchUserByEmail(email).then(user => user.id);
    const script = {
        script: {
            source: "ctx._source.accessToken = params.accessToken; ctx._source.refreshToken = params.refreshToken",
            params: {
                accessToken,
                refreshToken
            }
        }
    };
    await elasticsearch.update({
        index: 'users',
        id: userId,
        body: script
    });
};

exports.fetchUserTokens = async (email) => {
    const userId = await this.fetchUserByEmail(email).then(user => user.id);
    const result = await elasticsearch.get({
        index: 'users',
        id: userId
    });
    return result._source;
};

exports.fetchUserById = async (id) => {
    const result = await elasticsearch.get({
        index: 'users',
        id: id
    });
    return result._source;
};

exports.fetchUserByEmail = async (email) => {
    const result = await elasticsearch.search({
        index: 'users',
        body: {
            query: {
                match: {
                    email: email
                }
            }
        }
    });
    if (result.hits.total.value === 0) {
        throw new Error('User not found');
    }
    return result.hits.hits[0]._source;
};
