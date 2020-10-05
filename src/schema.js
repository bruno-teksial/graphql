const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    books(
      """
      The number of results to show. Must be >= 1. Default = 2
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): BookConnection!
    book(id: ID!): Book
    
    authors(
      """
      The number of results to show. Must be >= 1. Default = 2
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): AuthorConnection!
    author(id: ID!): Author

  }

  """
  Simple wrapper around our list of books that contains a cursor to the
  last item in the list. Pass this cursor to the books query to fetch results
  after these.
  """
  type BookConnection {
    cursor: String!
    hasMore: Boolean!
    books: [Book]!
  }

  type AuthorConnection {
    cursor: String!
    hasMore: Boolean!
    authors: [Author]!
  }

  type Author {
    id: ID!
    author: String!
    books: Book!
    about: String
  }
  
  type Book {
    id: ID!
    isbn13: String!
    title: String!
    subtitle: String!
    author: Author
    link: String
  }

`;

module.exports = typeDefs;
