const authService = require('../../services/authService');

exports.outlookAuth = (req, res, next) => {
    authService.outlookAuth(req, res, next);
};

exports.outlookCallback = (req, res, next) => {
    authService.outlookCallback(req, res, next);
};
