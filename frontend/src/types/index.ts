export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    status: 'available' | 'borrowed' | 'reserved';
    location: string;
  }

  export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'librarian' | 'member';
    status: 'active' | 'inactive';
  }

  export interface LibraryStats {
    totalBooks: number;
    borrowedBooks: number;
    activeMembers: number;
    totalMembers: number;
  }

  export interface GetBooksResponse {
    data: Book[];
    total: number;
  }

  export interface GetUsersResponse {
    data: User[];
    total: number;
  }