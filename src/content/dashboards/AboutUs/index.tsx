import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getApi, postApi } from 'src/helper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toast';
import { setPrivacyPolicy } from 'src/store/slices/privacyPolicySlice';
import { PrivacyPolicyState } from 'src/store/slices/type';
import { RootState } from 'src/store/store';

const AboutUs: React.FC = () => {
  const [aboutText, setAboutText] = useState<string>();
  const { content } = useSelector((state: RootState) => state.privacyPolicy);
  console.log('🚀 ~ content:', content);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      if (aboutText) {
        const formData = new FormData();
        formData.append('content', aboutText);
        
        const res: PrivacyPolicyState = await postApi(
          '/about-us',
          formData,
          navigate
        );
        if (res) {
          dispatch(setPrivacyPolicy(res));
          toast.success('Successfully about us added');
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleSave ~ error:', error);
    }
  };

  const getAboutUsHandler = async () => {
    try {
      const aboutUsRes: PrivacyPolicyState = await getApi(
        '/about-us',
        navigate
      );
      setAboutText(aboutUsRes.content);
      dispatch(setPrivacyPolicy(aboutUsRes));
    } catch (error) {
      console.log('🚀 ~ getAboutUsHandler ~ error:', error);
    }
  };

  const onDelete = () => {
    setAboutText('');
  };

  useEffect(() => {
    getAboutUsHandler();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <CKEditor
            editor={ClassicEditor}
            data={aboutText}
            onChange={(_, editor) => {
              const data = editor.getData();
              setAboutText(data);
            }}
            config={{
              placeholder: 'Enter about us content...'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="error" onClick={onDelete}>
            Clear
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUs;