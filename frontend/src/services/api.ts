import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Book, User, LibraryStats, GetBooksResponse, GetUsersResponse } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Books', 'Users', 'Stats'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Books endpoints
    getBooks: builder.query<GetBooksResponse, string>({
      query: (searchTerm) => `books?search=${searchTerm}`,
      providesTags: ['Books'],
    }),
    getBook: builder.query<Book, number>({
      query: (id) => `books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Books', id }],
    }),
    addBook: builder.mutation<Book, Omit<Book, 'id'>>({
      query: (book) => ({
        url: 'books',
        method: 'POST',
        body: book,
      }),
      invalidatesTags: ['Books', 'Stats'],
    }),
    updateBook: builder.mutation<Book, { id: number; book: Partial<Book> }>({
      query: ({ id, book }) => ({
        url: `books/${id}`,
        method: 'PATCH',
        body: book,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Books', id },
        'Books',
        'Stats',
      ],
    }),
    deleteBook: builder.mutation<void, number>({
      query: (id) => ({
        url: `books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books', 'Stats'],
    }),
    borrowBook: builder.mutation<Book, { bookId: number; userId: number }>({
      query: ({ bookId, userId }) => ({
        url: `books/${bookId}/borrow`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Books', id: bookId },
        'Books',
        'Stats',
      ],
    }),
    returnBook: builder.mutation<Book, number>({
      query: (bookId) => ({
        url: `books/${bookId}/return`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, bookId) => [
        { type: 'Books', id: bookId },
        'Books',
        'Stats',
      ],
    }),

    // Users endpoints
    getUsers: builder.query<GetUsersResponse, string>({
      query: (searchTerm) => `users?search=${searchTerm}`,
      providesTags: ['Users'],
    }),
    getUser: builder.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    addUser: builder.mutation<User, Omit<User, 'id'>>({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    updateUser: builder.mutation<User, { id: number; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: user,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        'Users',
        'Stats',
      ],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    // Stats endpoints
    getLibraryStats: builder.query<LibraryStats, void>({
      query: () => 'stats',
      providesTags: ['Stats'],
    }),

    // User borrowing history
    getUserBorrowHistory: builder.query<Book[], number>({
      query: (userId) => `users/${userId}/borrow-history`,
      providesTags: (_result, _error, userId) => [{ type: 'Users', id: userId }],
    }),
  }),
});

export const {
  // Auth exports
  useLoginMutation,

  // Books exports
  useGetBooksQuery,
  useGetBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useReturnBookMutation,

  // Users exports
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Stats exports
  useGetLibraryStatsQuery,

  // History exports
  useGetUserBorrowHistoryQuery,
} = api;