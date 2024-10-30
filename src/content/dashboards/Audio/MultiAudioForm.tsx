import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toast';
import { getApi, postApi } from 'src/helper';
import { setAudio } from 'src/store/slices/audioSlice';
import { Audio } from 'src/models/audio_type';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CategoryResponse, SubCategoryResponse } from 'src/type';
import { Category } from 'src/models/category_type';
import { SubCategory } from 'src/models/subcategory_type';
import { Remove } from '@mui/icons-material';
import { truncateUrl } from 'src/utility';

const MultiAudioForm = () => {
  const [audios, setAudios] = useState([
    {
      audioName: '',
      image: null,
      audio: null,
      lyrics: null,
      filterCategory: '',
      filterSubCategory: ''
    }
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filterCategory, setFilterCategory] = useState<string| null>(null);
  const [filterSubCategories, setFilterSubCategories] = useState<SubCategory[]>(
    []
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleAddAudioForm = () => {
    setAudios([
      ...audios,
      {
        audioName: '',
        image: null,
        audio: null,
        lyrics: null,
        filterCategory: '',
        filterSubCategory: ''
      }
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newAudios = [...audios];
    newAudios[index][field] = value;
    if(field === "filterCategory"){
      console.log("🚀 ~ handleInputChange ~ value:", value)
      setFilterCategory(value)
    }
    setAudios(newAudios);
  };

  const handleFileChange = (index, field, file) => {
    const newAudios = [...audios];
    newAudios[index][field] = file;
    setAudios(newAudios);
  };

  const postAudioHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: Audio } = await postApi(
        '/audios',
        body, navigate
      );
      console.log('🚀 ~ postCategoryHandler ~ response:', response);
      if (response) {
        dispatch(setAudio(response.data));
        toast.success('Audio add successfully');
      }
    } catch (error) {
      toast.error(
        error?.message || 'An error occurred while fetching audios'
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    audios.forEach((audio)=>{
      const newAudio = new FormData();
      newAudio.append('title', audio.audioName);
      newAudio.append('image', audio.image);
      newAudio.append('audio', audio.audio);
      if(audio.lyrics){
        newAudio.append('lyrics', audio.lyrics);
      }
      newAudio.append('categoryId', audio.filterCategory);
      newAudio.append('subCategoryId', audio.filterSubCategory);
      postAudioHandler(newAudio);
    })
    console.log(audios); // You can handle form submission here
  };

  const filterSubCategoriesHandler = () => {
    const filterSubCategories =
      subCategories &&
      subCategories.filter(
        (subCat) => subCat.category?._id === filterCategory
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

  const handleRemoveAudioForm = () => {
    setAudios((prevAudios) => prevAudios.slice(0, -1));
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", my: "15px", justifyContent: "center", width: "100%"}}>
  <Box component={"form"} onSubmit={handleSubmit} sx={{ width: "60%", border: "2px solid grey", padding: "10px", borderRadius: "8px" }}>
    {audios.map((audio, index) => (
      <Box key={index} display="flex" flexDirection="column" gap={2} mb={2} borderBottom={`${audios.length === index + 1 ? "none" : "2px solid grey"}`} paddingBottom={"15px"}>
        <TextField
          label="Audio Title"
          variant="outlined"
          value={audio.audioName}
          onChange={(e) => handleInputChange(index, 'audioName', e.target.value)}
          required
          fullWidth
        />
        <Box display={'flex'} flexDirection="row" gap={3}>
          <Box display={'flex'} flexDirection="column" gap={1}>
            <Typography variant="body1">{truncateUrl(audio.image?.name)}</Typography>
            <input
              type="file"
              onChange={(e) => handleFileChange(index, 'image', e.target.files[0])}
              accept="image/*"
              style={{ display: 'none' }}
              id={`image-file-upload-${index}`}
            />
            <label htmlFor={`image-file-upload-${index}`}>
              <Button variant="contained" component="span">
                Choose Image File
              </Button>
            </label>
          </Box>
          {audio.image && (
            <img
              src={URL.createObjectURL(audio.image)}
              alt="Selected"
              style={{ width: '80px', height: '80px' }}
            />
          )}
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <input
            type="file"
            onChange={(e) => handleFileChange(index, 'audio', e.target.files[0])}
            accept="audio/*"
            style={{ display: 'none' }}
            id={`audio-file-upload-${index}`}
          />
          <label htmlFor={`audio-file-upload-${index}`}>
            <Button variant="contained" component="span">
              Choose Audio File
            </Button>
          </label>
          <Typography variant="body1">{truncateUrl(audio.audio?.name)}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <input
            type="file"
            onChange={(e) => handleFileChange(index, 'lyrics', e.target.files[0])}
            style={{ display: 'none' }}
            id={`lyrics-file-upload-${index}`}
          />
          <label htmlFor={`lyrics-file-upload-${index}`}>
            <Button variant="contained" component="span">
              Choose Lyrics File
            </Button>
          </label>
          <Typography variant="body1">{truncateUrl(audio.lyrics?.name)}</Typography>
        </Box>
        <Box display="flex" gap="5px">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Categories</InputLabel>
            <Select
              value={audio.filterCategory}
              onChange={(e) => handleInputChange(index, 'filterCategory', e.target.value)}
              label="Categories"
            >
              {categories?.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {truncateUrl(category.category_name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sub Categories</InputLabel>
            <Select
              value={audio.filterSubCategory}
              onChange={(e) => handleInputChange(index, 'filterSubCategory', e.target.value)}
              label="SubCategories"
            >
              {filterSubCategories?.map((subcategory) => (
                <MenuItem key={subcategory._id} value={subcategory._id}>
                  {truncateUrl(subcategory.subcategory_name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    ))}
    <Box display="flex" justifyContent="space-between" my={2}>
      <IconButton onClick={handleAddAudioForm}>
        <AddIcon />
      </IconButton>
      {audios.length > 1 && (
        <IconButton onClick={handleRemoveAudioForm}>
          <Remove />
        </IconButton>
      )}
    </Box>
    <Button variant="contained" type="submit" color="primary">
      Submit All Audios
    </Button>
  </Box>
</Box>

  );
};

export default MultiAudioForm;
