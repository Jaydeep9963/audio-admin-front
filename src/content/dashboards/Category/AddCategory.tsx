import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Input } from '@mui/material';



type AddCategoryProps = {
  addCategory: (body: FormData) => Promise<void>
}

const AddCategory: React.FC<AddCategoryProps> = ({addCategory}) => {
  const [categoryName, setCategoryName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newCategory = new FormData();
    newCategory.append('categoryName', categoryName);
    newCategory.append('image', image);
    newCategory.append('description', description);

    addCategory(newCategory);
    console.log(newCategory);
    // You can call your API or handle form submission here
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    console.log(file);
    if (file) {
      setImage(file);
      // Handle the file (e.g., upload to server or convert to URL)
      // You could also use FileReader to display a preview or send to backend.
    }
  };

  return (
    <Container
      sx={{
        padding: 3,
        maxWidth: 400,
        margin: 'auto'
      }}
    >
      <Typography
        sx={{
          marginBottom: 2
        }}
        variant="h4"
        gutterBottom
        align="center"
      >
        Add New Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            fullWidth
          />
          <Input
            type="file"
            onChange={(e) => handleImageUpload(e)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <Button variant="contained" type="submit" color="primary">
            Add Category
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddCategory;
