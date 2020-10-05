const { RESTDataSource } = require('apollo-datasource-rest');
const aws4  = require('aws4');

class AuthorAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://${process.env.AUTHORS_AWS_ENDPOINT}`;
  }

  // leaving this inside the class to make the class easier to test
  reducer(author) {
    return {
      // cursor: `${launch.launch_date_unix}`,
      cursor: 1,
      id: author.id,
      author: author.author,
      books: author.books,
      about: author.about,
    };
  }

  async getAllAuthors(limit = 2, offset = 2) {
    var opts = { host: process.env.AUTHORS_AWS_ENDPOINT, path: `/dev/authors/all?limit=${limit}&offset=${offset}` };
    aws4.sign(opts, { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION });
    const response = await this.get( undefined, {} , opts);

    // transform the raw author to a more friendly
    return Array.isArray(response)
      ? response.map(author => this.reducer(author)) : [];
  }

  async getAuthorById({ authorId }) {
    var opts = { host: process.env.AUTHORS_AWS_ENDPOINT, path: `/dev/authors/${authorId}` };
    aws4.sign(opts, { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION });
    const response = await this.get( undefined, {} , opts);
    return this.reducer(response);
  }

  async getAuthorsByIds({ authorIds }) {
    return Promise.all(
      authorIds.map(authorId => this.getAuthorById({ authorId })),
    );
  }
}

module.exports = AuthorAPI;
