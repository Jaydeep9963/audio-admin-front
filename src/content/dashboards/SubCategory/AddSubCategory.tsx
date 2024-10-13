import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { allCat, categories_data } from 'src/constant';
import { Category } from 'src/models/category_type';

const AddSubCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
   const [filterCategory, setFilterCategory] =
     useState<Category>(categories_data[0]);
  const [description, setDescription] = useState('');

      let allCategories = [
        ...categories_data
      ];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newCategory = {
      categoryName,
      imageUrl,
      description
    };
    console.log(newCategory);
    // You can call your API or handle form submission here
  };

      const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = e.target.value;
        if (e.target.value.toString() !== 'all') {
          value = e.target.value;
        }
        const filterdCategory = allCategories.find(
          (category) => category._id === value
        );
        setFilterCategory(filterdCategory);
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
        Add New SubCategory
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Subcategory Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Image URL"
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            fullWidth
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Categories</InputLabel>
            <Select
              value={filterCategory._id}
              onChange={handleCategoryChange}
              label="Categories"
              autoWidth
            >
              {allCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            Add SubCategory
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddSubCategory;
