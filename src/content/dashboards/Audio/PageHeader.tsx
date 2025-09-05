import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import FormDialog from 'src/Dialog/FormDialog';
import AudioForm from './AudioForm';
import { useState } from 'react';
import { Audio } from 'src/models/audio_type';
import { postApi } from 'src/helper';
import { toast } from 'react-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAudio } from 'src/store/slices/audioSlice';
import MultiAudioForm from './MultiAudioForm';

function PageHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  const handleOpen = () => {
    navigate('/dashboard/addAudios');
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Audios
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, these are your all Audios
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={handleOpen}
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Add audio
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
