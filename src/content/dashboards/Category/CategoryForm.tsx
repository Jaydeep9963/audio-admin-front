import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Input } from '@mui/material';
import { urlToFile } from 'src/helper';

type CategoryFormProps = {
  submitCategoryHandler: (body: FormData) => Promise<void>;
  asUpdate: boolean;
  existData?: { categoryName: string; image: File; description: string };
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  submitCategoryHandler,
  asUpdate,
  existData
}) => {
  const [categoryName, setCategoryName] = useState(
    asUpdate ? existData.categoryName : ''
  );
  const [image, setImage] = useState<File | null>(
    asUpdate ? existData.image : null
  );
  console.log("🚀 ~ image:", image)
  const [description, setDescription] = useState(
    asUpdate ? existData.description : ''
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    const newCategory = new FormData();
  
    // Append only if the field has been updated
    if (categoryName && categoryName !== existData.categoryName) {
      newCategory.append('categoryName', categoryName);
    }
    if (image && image !== existData.image) {
      newCategory.append('image', image);
    }
    if (description && description !== existData.description) {
      newCategory.append('description', description);
    }
  
    // Call your handler with the updated FormData
    submitCategoryHandler(newCategory);
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

    const generateImageUrls = async (category) => {
        if (category.image && category.image.file) {
           const imageFile = await urlToFile(
             category.image.file,
             category.image.fileName,
             category.image.fileType
           );
          setImage(imageFile);
        } 
  };

      useEffect(() => {
        if (asUpdate && existData) {
          generateImageUrls(existData.image);
        }
      }, [existData]);

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
                style={{ width: '80px', height: '80px' }}
              />
            )}
          </Box>
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
            {asUpdate ? 'Update category' : 'Add Category'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CategoryForm;
