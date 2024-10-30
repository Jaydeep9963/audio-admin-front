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
  MenuItem,
  Select
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { allCat, categories_data, subcategories_data } from 'src/constant';
import { Category } from 'src/models/category_type';
import { SubCategory } from 'src/models/subcategory_type';
import { toast } from 'react-toast';
import { CategoryResponse, SubCategoryResponse } from 'src/type';
import { getApi } from 'src/helper';
import { truncateUrl } from 'src/utility';

type AudioFormProps = {
  submitAudioHandler: (body: FormData) => Promise<void>;
  asUpdate: boolean;
  existData?: {
    title: string;
    image: File;
    audio: File;
    subcategory: { _id: string; subcategory_name: string };
    lyrics?: File;
  };
};

const AudioForm: React.FC<AudioFormProps> = ({
  submitAudioHandler,
  asUpdate,
  existData
}) => {
  const [audioName, setAudioName] = useState(asUpdate ? existData.title : '');
  const [image, setImage] = useState<File | null>(
    asUpdate ? existData.image : null
  );
  const [audio, setAudio] = useState<File | null>(
    asUpdate ? existData.audio : null
  );
  const [lyrics, setLyrics] = useState<File | null>(
    asUpdate && existData.lyrics ? existData.lyrics : null
  );
  const [categories, setCategories] = useState<{ 
    _id: string;
    category_name: string;
    image: { file: string; fileName: string; fileType: string, fileSize: number};
    description?: string;
    subcategories?: SubCategory[]}[]>([]);
  const [filterCategory, setFilterCategory] = useState<Category>(null);
  console.log("🚀 ~ filterCategory:", filterCategory)

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filterSubCategories, setFilterSubCategories] = useState<SubCategory[]>(
    []
  );
  const [filterSubCategory, setFilterSubCategory] = useState<{
    _id: string;
    subcategory_name: string;
  }>(asUpdate ? existData.subcategory : null);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    const newAudio = new FormData();
  
    // Only append the field if it has been updated
    if (audioName && audioName !== existData.title) {
      newAudio.append('title', audioName);
    }
    if (image && image !== existData.image) {
      newAudio.append('image', image);
    }
    if (audio && audio !== existData.audio) {
      newAudio.append('audio', audio);
    }
    if (lyrics && lyrics !== existData.lyrics) {
      newAudio.append('lyrics', lyrics);
    }

      newAudio.append('categoryId', filterCategory._id);
    
    if (filterSubCategory && filterSubCategory._id !== existData.subcategory._id) {
      newAudio.append('subCategoryId', filterSubCategory._id);
    }
  
    // Call your handler with the updated FormData
    submitAudioHandler(newAudio);
  };
  

  const isSubmitButtonVisible = ()=> {
    if(audioName && image && audio){
       return false;
    }
    return true;
  }

  const getCategories = async () => {
    try {
      const response: CategoryResponse = await getApi(
        `/categories?categoryName=&page=&limit=`,
        navigate
      );
      if (response) {
        setCategories(response.categories);
      }
    } catch (error) {
      toast.error(
        error?.message || 'An error occurred while fetching categories'
      );
    }
  };

  const getSubCategories = async () => {
    try {
      const response: SubCategoryResponse = await getApi(
        `/subcategories?subcategoryName=&page=&limit=`,
        navigate
      );
      if (response) {
        setSubCategories(response.subCategories);
      }
    } catch (error) {
      toast.error(
        error?.message || 'An error occurred while fetching subcategories'
      );
    }
  };

  const filterSubCategoriesHandler = () => {
    const filterSubCategories =
      subCategories &&
      subCategories.filter(
        (subCat) => subCat.category?._id === filterCategory?._id
      );
    setFilterSubCategories(filterSubCategories);
  };

  useEffect(() => {
    filterSubCategoriesHandler();
  }, [filterCategory]);
  useEffect(() => {
    getCategories();
    getSubCategories();
  }, []);

  useEffect(() => {
    if (asUpdate && categories.length > 0 && existData) {
      const existCategory = categories.find((cat) =>
        cat.subcategories.some((subcat) => {
          return subcat.toString()  === existData?.subcategory?._id.toString();
        })
      );
      setFilterCategory(existCategory);
    }
  }, [asUpdate, categories, existData ]);

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;
    const filterdCategory = categories.find(
      (category) => category._id === value
    );
    setFilterCategory(filterdCategory);
  };

  const handleSubCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;
    const filterdSubCategory = subCategories.find(
      (category) => category._id === value
    );
    setFilterSubCategory({
      _id: filterdSubCategory._id,
      subcategory_name: filterdSubCategory.subcategory_name
    });
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

  const handleAudioUpload = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    console.log(file);
    if (file) {
      setAudio(file);
    }
  };

  const handleLyricsUpload = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    console.log(file);
    if (file) {
      setLyrics(file);
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
        Add New Audio
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Audio Title"
            variant="outlined"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
            required
            fullWidth
          />
          <Box display={'flex'} flexDirection="row" gap={3}>
            <Box display={'flex'} flexDirection="column" gap={1}>
              <Typography variant="body1">{truncateUrl(image?.name)}</Typography>
              {/* Hidden Input */}
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
                id="image-file-upload"
              />

              {/* Custom Button to trigger file input */}
              <label htmlFor="image-file-upload">
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
          <Box
            display={'flex'}
            flexDirection="row"
            alignItems={'center'}
            gap={1}
          >
            {/* Hidden Input */}
            <input
              type="file"
              onChange={handleAudioUpload}
              accept="audio/*"
              style={{ display: 'none' }}
              id="audio-file-upload"
            />

            {/* Custom Button to trigger file input */}
            <label htmlFor="audio-file-upload">
              <Button variant="contained" component="span">
                Choose Audio File
              </Button>
            </label>
            <Typography variant="body1">{truncateUrl(audio?.name)}</Typography>
          </Box>
          <Box
            display={'flex'}
            flexDirection="row"
            alignItems={'center'}
            gap={1}
          >
            {/* Hidden Input */}
            <input
              type="file"
              onChange={handleLyricsUpload}
              style={{ display: 'none' }}
              id="lyrics-file-upload"
            />

            {/* Custom Button to trigger file input */}
            <label htmlFor="lyrics-file-upload">
              <Button variant="contained" component="span">
                Choose Lyrics File
              </Button>
            </label>
            <Typography variant="body1">
              {truncateUrl(lyrics ? lyrics?.name : '')}
            </Typography>
          </Box>
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
                disabled={!filterCategory || categories.length === 0}
                value={filterCategory?._id}
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sub Categories</InputLabel>
              <Select
                value={filterSubCategory?._id}
                onChange={handleSubCategoryChange}
                disabled={!asUpdate && filterSubCategories.length <= 0}
                label="SubCategories"
                autoWidth
              >
                {filterSubCategories?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
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

export default AudioForm;
