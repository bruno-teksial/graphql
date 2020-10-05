const { RESTDataSource } = require('apollo-datasource-rest');
const aws4  = require('aws4');

class BookAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://${process.env.BOOKS_AWS_ENDPOINT}`;
  }

  // leaving this inside the class to make the class easier to test
  reducer(book) {
    return {
      // cursor: `${launch.launch_date_unix}`,
      cursor: 1,
      id: book.isbn13,
      title: book.title,
      subtitle: book.subtitle,
      isbn13: book.isbn13,
      author: book.author,
      link: book.link,
    };
  }

  async getAllBooks(limit = 2, offset = 2) {
    var opts = { host: process.env.BOOKS_AWS_ENDPOINT, path: `/dev/books/all?limit=${limit}&offset=${offset}` };
    aws4.sign(opts, { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION });
    const response = await this.get( undefined, {} , opts);

    // transform the raw book to a more friendly
    return Array.isArray(response)
      ? response.map(book => this.reducer(book)) : [];
  }

  async getBookById({ bookId }) {
    var opts = { host: process.env.BOOKS_AWS_ENDPOINT, path: `/dev/books/${bookId}` };
    aws4.sign(opts, { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION });
    const response = await this.get( undefined, {} , opts);
    return this.reducer(response);
  }

  async getBooksByIds({ bookIds }) {
    return Promise.all(
      bookIds.map(bookId => this.getBookById({ bookId })),
    );
  }
}

module.exports = BookAPI;
