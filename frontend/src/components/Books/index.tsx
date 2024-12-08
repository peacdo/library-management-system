import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useGetBooksQuery, useDeleteBookMutation } from '../../services/api';
import AddBookDialog from '../../components/Books/AddBookDialog';
import EditBookDialog from '../../components/Books/EditBookDialog';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import type { Book } from '../../types';

const Books: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: response, isLoading, error } = useGetBooksQuery(searchTerm);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBook) {
      try {
        await deleteBook(selectedBook.id).unwrap();
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const getStatusChipColor = (status: Book['status']) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'borrowed':
        return 'warning';
      case 'reserved':
        return 'info';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const books = response?.data || [];

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Books</Typography>
        <Button
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add New Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load books. Please try again.
        </Alert>
      )}

      <TextField
        fullWidth
        label="Search books"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book: Book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>
                  <Chip
                    label={book.status}
                    color={getStatusChipColor(book.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{book.location}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(book)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(book)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddBookDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      {selectedBook && (
        <EditBookDialog
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedBook(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        message={`Are you sure you want to delete "${selectedBook?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default Books;