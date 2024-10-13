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
  MenuItem,
  Select
} from '@mui/material';
import { allCat, categories_data, subcategories_data } from 'src/constant';
import { Category } from 'src/models/category_type';
import { SubCategory } from 'src/models/subcategory_type';



const AddAudio: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ audioUrl, setAudioUrl] = useState('');
  const [lyricsUrl, setLyricsUrl] = useState('');
  const [description, setDescription] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category>(allCat);
    const [filterSubCategory, setFilterSubCategory] = useState<SubCategory>(null);

  

    let allCategories = [
          {
        ...allCat
      },
      ...categories_data,
    
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
      const filterdCategory = allCategories.find((category)=> category._id === value)
      setFilterCategory(filterdCategory);
    };

    const handleSubCategoryChange = (
      e: ChangeEvent<HTMLInputElement>
    ): void => {
      let value = null;

      if (e.target.value !== 'all') {
        value = e.target.value;
      }

      const filterdSubCategory = subcategories_data.find(
        (category) => category.id === value
      );

      setFilterSubCategory(filterdSubCategory);
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
            label="Audio Title"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Audio URL"
            variant="outlined"
            value={audioUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Lyrics Url"
            variant="outlined"
            value={lyricsUrl}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            fullWidth
          />
          <TextField
            label="Image Url"
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            fullWidth
          />
          <Box
            component={'div'}
            sx={{
              display: 'flex',
              gap: '5px'
            }}
          >
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sub Categories</InputLabel>
              <Select
                value={filterSubCategory?.id}
                onChange={handleSubCategoryChange}
                label="SubCategories"
                autoWidth
              >
                {subcategories_data.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.subcategory_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" type="submit" color="primary">
            Add Audio
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddAudio;
