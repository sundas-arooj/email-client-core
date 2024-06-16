const graphClient = require('../../core/utils/graphClient');

exports.outlookNotification = async (req, res, next) => {
  const validationToken = req.query.validationToken;

  if (validationToken) {
    // Validation request from Microsoft Graph
    res.status(200).send(validationToken);
  } else {
    const notification = req.body;
    await graphClient.processNotification(notification);
    res.status(202).send();
  }
};

