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
  Input,
  CircularProgress,
  FormHelperText
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
    image: any;
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
    asUpdate && existData ? existData.subCategoryName : ''
  );
  
  const [image, setImage] = useState<File | null>(
    asUpdate && existData ? existData.image : null
  );

  const [description, setDescription] = useState(
    asUpdate && existData ? existData.description : ''
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    _id: string;
    category_name: string;
  } | null>(asUpdate && existData ? existData.category : null);
  
  // Form validation states
  const [nameError, setNameError] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const navigate = useNavigate()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Reset errors
    setNameError('');
    setImageError('');
    setCategoryError('');
    
    // Validate form
    let isValid = true;
    
    if (!subCategoryName.trim()) {
      setNameError('Subcategory name is required');
      isValid = false;
    }
    
    if (!image && !asUpdate) {
      setImageError('Image is required');
      isValid = false;
    }
    
    if (!selectedCategory) {
      setCategoryError('Category is required');
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
  
    const newCategory = new FormData();
  
    try {
      if (asUpdate && existData) {
        // For updates: Append only if the field has been updated
        if (subCategoryName && subCategoryName !== existData.subCategoryName) {
          newCategory.append('subCategoryName', subCategoryName);
        }
        if (image && image !== existData.image) {
          newCategory.append('image', image);
        }
        if (description && description !== existData.description) {
          newCategory.append('description', description);
        }
        if (selectedCategory && selectedCategory._id !== existData.category._id) {
          newCategory.append('categoryId', selectedCategory._id);
        }
      } else {
        // For new subcategories: Append all fields that have values
        newCategory.append('subCategoryName', subCategoryName);
        newCategory.append('image', image);
        if (description) {
          newCategory.append('description', description);
        }
        newCategory.append('categoryId', selectedCategory._id);
      }
    
      // Call your handler with the updated FormData
      await submitSubCategoryHandler(newCategory);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };  

    const handleImageUpload = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImage(file);
        setImageError('');
      }
    };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const category = categories.find((cat)=> cat._id === e.target.value)
    setSelectedCategory(category);
    setCategoryError('');
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
            onChange={(e) => {
              setSubCategoryName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            required
            fullWidth
            error={!!nameError}
            helperText={nameError}
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
              {imageError && (
                <Typography color="error" variant="caption" display="block">
                  {imageError}
                </Typography>
              )}
            </Box>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                style={{ width: '100px', height: '100px' }}
              />
            )}
          </Box>
          <FormControl fullWidth variant="outlined" error={!!categoryError}>
            <InputLabel>Categories</InputLabel>
            <Select
              value={selectedCategory?._id || ''}
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
            {categoryError && <FormHelperText>{categoryError}</FormHelperText>}
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
          <Button 
            variant="contained" 
            type="submit" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                {asUpdate ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              asUpdate ? 'Update Subcategory' : 'Add Subcategory'
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default SubCategoryForm;
