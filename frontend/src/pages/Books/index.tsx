// src/pages/Books/index.tsx
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
} from '@mui/material';
import { useGetBooksQuery } from '../../services/api';
import AddBookDialog from '../../components/Books/AddBookDialog';
import type { Book } from '../../types';

const Books: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: response, isLoading } = useGetBooksQuery(searchTerm);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
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
                <TableCell>{book.status}</TableCell>
                <TableCell>{book.location}</TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="secondary">
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
    </div>
  );
};

export default Books;