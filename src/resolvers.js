const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    books: async (_, { pageSize = 5, after }, { dataSources }) => {
      const allBooks = await dataSources.bookAPI.getAllBooks(_, pageSize);

      const books = paginateResults({
        after,
        pageSize,
        results: allBooks,
      });

      return {
        books,
        cursor: books.length ? books[books.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: books.length
          ? books[books.length - 1].cursor !==
            allBooks[allBooks.length - 1].cursor
          : false,
      };
    },

    book: (_, { id }, { dataSources }) =>
    dataSources.bookAPI.getBookById({ bookId: id }),

    author: (_, { id }, { dataSources }) =>
      dataSources.authorAPI.getAuthorById({ authorId: id }),

      authors: async (_, { pageSize = 5, after }, { dataSources }) => {
        const allAuthors = await dataSources.authorAPI.getAllAuthors(_, pageSize);
  
        const authors = paginateResults({
          after,
          pageSize,
          results: allAuthors,
        });
  
        return {
          authors,
          cursor: authors.length ? authors[authors.length - 1].cursor : null,
          // if the cursor of the end of the paginated results is the same as the
          // last item in _all_ results, then there are no more results after this
          hasMore: authors.length
            ? authors[authors.length - 1].cursor !==
              allAuthors[allAuthors.length - 1].cursor
            : false,
        };
      },
  
      author: (_, { id }, { dataSources }) =>
        dataSources.authorAPI.getAuthorById({ authorId: id }),
  
  },
};
