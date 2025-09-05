import { Typography, Button, Grid } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import FormDialog from 'src/Dialog/FormDialog';
import ArtistForm from './ArtistForm';
import { useState } from 'react';
import { Artist } from 'src/models/artist_type';
import { useDispatch } from 'react-redux';
import { postApi } from 'src/helper';
import { toast } from 'react-toast';
import { setArtist } from 'src/store/slices/artistSlice';
import { useNavigate } from 'react-router';

function PageHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
  };
  
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const postArtistHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: Artist } = await postApi(
        '/artists',
        body,
        navigate
      );
      console.log('🚀 ~ postArtistHandler ~ response:', response);
      if (response) {
        dispatch(setArtist(response.data));
        toast.success('Artist added successfully');
        handleClose();
      }
    } catch (error) {
      toast.error(
        error?.message || 'An error occurred while fetching artists'
      );
    }
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Artists
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, these are your all artists
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={handleOpen}
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Add artist
          </Button>
        </Grid>
      </Grid>
      {isDialogOpen && (
        <FormDialog open={isDialogOpen} handleClose={handleClose}>
          <ArtistForm
            submitArtistHandler={postArtistHandler}
            asUpdate={false}
          />
        </FormDialog>
      )}
    </>
  );
}

export default PageHeader;