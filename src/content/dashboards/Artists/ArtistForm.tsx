import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Container, CircularProgress } from '@mui/material';
import { urlToFile } from 'src/helper';

type ArtistFormProps = {
  submitArtistHandler: (body: FormData) => Promise<void>;
  asUpdate: boolean;
  existData?: { name: string; bio: string; image: any };
};

const ArtistForm: React.FC<ArtistFormProps> = ({
  submitArtistHandler,
  asUpdate,
  existData
}) => {
  const [name, setName] = useState(
    asUpdate && existData ? existData.name : ''
  );
  const [bio, setBio] = useState(
    asUpdate && existData ? existData.bio : ''
  );
  const [image, setImage] = useState<File | null>(
    asUpdate && existData ? existData.image : null
  );
  
  // Form validation states
  const [nameError, setNameError] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Reset errors
    setNameError('');
    setImageError('');
    
    // Validate form
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Artist name is required');
      isValid = false;
    }
    
    if (!image && !asUpdate) {
      setImageError('Artist image is required');
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);

    const newArtist = new FormData();

    try {
      if (asUpdate && existData) {
        // For updates: Append only if the field has been updated
        if (name && name !== existData.name) {
          newArtist.append('name', name);
        }
        if (bio && bio !== existData.bio) {
          newArtist.append('bio', bio);
        }
        if (image && image !== existData.image) {
          newArtist.append('image', image);
        }
      } else {
        // For new artists: Append all fields that have values
        newArtist.append('name', name);
        newArtist.append('image', image);
        if (bio) {
          newArtist.append('bio', bio);
        }
      }

      // Call your handler with the updated FormData
      await submitArtistHandler(newArtist);
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

  const generateImageUrls = async (artistImage: any) => {
    if (artistImage && artistImage.file) {
      const imageFile = await urlToFile(
        artistImage.file,
        artistImage.fileName,
        artistImage.fileType
      );
      setImage(imageFile);
    }
  };

  useEffect(() => {
    if (asUpdate && existData && existData.image) {
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
        {asUpdate ? 'Update Artist' : 'Add New Artist'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Artist Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            required
            fullWidth
            error={!!nameError}
            helperText={nameError}
          />
          <TextField
            label="Bio"
            variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Enter artist biography..."
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
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
          </Box>
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
              asUpdate ? 'Update Artist' : 'Save Artist'
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ArtistForm;