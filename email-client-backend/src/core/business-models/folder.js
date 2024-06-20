const elasticsearch = require('../utils/elasticsearch');
const userModel = require('./user');

exports.storeFolderData = async (folder, email, parentFolderId) => {
  const userId = await userModel.fetchUserByEmail(email).then(user => user.id);
  const folderDocument = {
    userId: userId,
    folderId: folder.id,
    folderName: folder.displayName,
    parentFolderId: parentFolderId || null,
  };

  try {
    await elasticsearch.update({
      index: 'folders',
      id: folder.id,
      body: {
        doc: folderDocument,
        doc_as_upsert: true // If the document doesn't exist, create it
      }
    });
  } catch (error) {
    console.error('Error indexing folder data:', error);
  }
};

exports.getFolderById = async (folderId) => {
    try {
      const result = await elasticsearch.get({
        index: 'folders',
        id: folderId
      });
      return result._source;
    } catch (error) {
      console.error('Error fetching folder:', error);
      return null;
    }
};

exports.getFoldersByEmail = async (email) => {
    try {
      const userId = await userModel.fetchUserByEmail(email).then(user => user.id);
      // Search for all folders in the Elasticsearch index
      const { body } = await elasticsearch.search({
        index: 'folders',
        body: {
            query: {
                match: { userId: userId }
            }
        }
      });

      return body.hits.hits.map(hit => hit._source);
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
};