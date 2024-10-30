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

const TermAndCondition: React.FC = () => {
  const [tacText, setTacText] = useState<string>();
  const { content } = useSelector((state: RootState) => state.privacyPolicy);
  console.log('🚀 ~ content:', content);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formData = new FormData();
  formData.append('content', tacText);

  const handleSave = async () => {
    try {
      if (tacText) {
        const res: PrivacyPolicyState = await postApi(
          '/termAndCondition',
          formData,
          navigate
        );
        if (res) {
          // dispatch(setPrivacyPolicy(res));
          toast.success('Successfully termAndCondition added');
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleSave ~ error:', error);
    }
  };

  const getTermAndConditionHandler = async () => {
    try {
      const privacyPolicyRes: PrivacyPolicyState = await getApi(
        '/termAndCondition',
        navigate
      );
      setTacText(privacyPolicyRes.content);
      // dispatch(setPrivacyPolicy(privacyPolicyRes));
    } catch (error) {
      console.log('🚀 ~ getPrivacyPolicyHandler ~ error:', error);
    }
  };

  const onDelete = () => {
    setTacText('');
  };

  useEffect(() => {
    getTermAndConditionHandler();
  }, []);

  return (
    <Container maxWidth="md">
      {/* <Box
        component={'div'}
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
        sx={{
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '16px',
          color: '#333',
          lineHeight: '1.6'
        }}
      /> */}

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <CKEditor
            editor={ClassicEditor}
            data={tacText}
            onChange={(_, editor) => {
              const data = editor.getData();
              setTacText(data);
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

export default TermAndCondition;
