import React, { ChangeEvent, useEffect, useState } from 'react';
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
  MenuItem,
  Input
} from '@mui/material';
import { Category } from 'src/models/category_type';
import { CategoryResponse } from 'src/type';
import { toast } from 'react-toast';
import { getApi } from 'src/helper';
import { useNavigate } from 'react-router';

type SubCategoryFormProps = {
  submitSubCategoryHandler: (body: FormData) => Promise<void>;
  asUpdate: boolean;
  existData?: {
    id: string;
    subCategoryName: string;
    image: File;
    description: string;
    category: { _id: string; category_name: string };
  };
};

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  submitSubCategoryHandler,
  asUpdate,
  existData
}) => {
  const [subCategoryName, setSubCategoryName] = useState(
    asUpdate ? existData.subCategoryName : ''
  );
  
  const [image, setImage] = useState<File | null>(
    asUpdate ? existData.image : null
  );

  const [description, setDescription] = useState(
    asUpdate ? existData.description : ''
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    _id: string;
    category_name: string;
  } | null>(asUpdate ? existData.category : null);
  const navigate = useNavigate()
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    const newCategory = new FormData();
  
    // Append only if the field has been updated
    if (subCategoryName && subCategoryName !== existData.subCategoryName) {
      newCategory.append('subCategoryName', subCategoryName);
    }
    if (image && image !== existData.image) {
      newCategory.append('image', image);
    }
    if (description && description !== existData.description) {
      newCategory.append('description', description);
    }
    console.log("🚀 ~ handleSubmit ~ existData.id:", existData.id)
    console.log("🚀 ~ handleSubmit ~ selectedCategory._id:", selectedCategory._id)
    if (selectedCategory && selectedCategory._id !== existData.category._id) {
      newCategory.append('categoryId', selectedCategory._id);
    }
  
    // Call your handler with the updated FormData
    submitSubCategoryHandler(newCategory);
  };  

    const handleImageUpload = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      console.log(file);
      if (file) {
        setImage(file);
      }
    };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const category = categories.find((cat)=> cat._id === e.target.value)
     console.log("🚀 ~ handleCategoryChange ~ category:", category)
     setSelectedCategory(category);
  };

    const getCategories = async () => {
      try {
        const response: CategoryResponse = await getApi(
          `/categories?categoryName=&page=&limit=`,
          navigate
        );
        if (response) {
          setCategories(response.categories)
        }
      } catch (error) {
        console.log('🚀 ~ getCategories ~ error:', error);
        toast.error(
          error?.message || 'An error occurred while fetching categories'
        );
      }
    };

    useEffect(()=>{
      getCategories();
    },[])

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
        {`${asUpdate ? 'Update Subcategory' : 'Add New SubCategory'}`}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Subcategory Name"
            variant="outlined"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            required
            fullWidth
          />
          <Box display={'flex'} flexDirection="row" gap={3}>
            <Box display={'flex'} flexDirection="column" gap={1}>
              <Typography variant="body1">{image?.name}</Typography>

              {/* Hidden Input */}
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
                id="file-upload"
              />

              {/* Custom Button to trigger file input */}
              <label htmlFor="file-upload">
                <Button variant="contained" component="span">
                  Choose Image File
                </Button>
              </label>
            </Box>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                style={{ width: '100px', height: '100px' }}
              />
            )}
          </Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Categories</InputLabel>
            <Select
              value={selectedCategory?._id}
              onChange={handleCategoryChange}
              label="Categories"
              autoWidth
            >
              {categories?.map((category) => (
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
            {`${asUpdate ? 'Update' : 'Add'}`}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default SubCategoryForm;
