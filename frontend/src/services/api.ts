// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Book, User, LibraryStats } from '../types';

export interface GetBooksResponse {
  data: Book[];
  total: number;
}

export interface GetUsersResponse {
  data: User[];
  total: number;
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
  endpoints: (builder) => ({
    getLibraryStats: builder.query<LibraryStats, void>({
      query: () => 'stats',
    }),
    getBooks: builder.query<GetBooksResponse, string>({
      query: (searchTerm) => `books?search=${searchTerm}`,
    }),
    getUsers: builder.query<GetUsersResponse, string>({
      query: (searchTerm) => `users?search=${searchTerm}`,
    }),
  }),
});

export const {
  useGetLibraryStatsQuery,
  useGetBooksQuery,
  useGetUsersQuery,
} = api;