import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useState } from 'react';
import FormDialog from 'src/Dialog/FormDialog';
import CategoryForm from './CategoryForm';
import { Category } from 'src/models/category_type';
import { useDispatch } from 'react-redux';
import { postApi } from 'src/helper';
import { toast, ToastContainer } from 'react-toast';
import { setCategory } from 'src/store/slices/categorySlice';
import { useNavigate } from 'react-router';

function PageHeader() {
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  const handleOpen = ()=>{
    setIsDialogOpen(true)
  }
  const handleClose = ()=>{
    setIsDialogOpen(false)
  }

    const postCategoryHandler = async (body: FormData) => {
      try {
        const response: { success: boolean; data: Category } = await postApi(
          '/categories',
          body,
          navigate
        );
        console.log('🚀 ~ postCategoryHandler ~ response:', response);
        if (response) {
          dispatch(setCategory(response.data));
          toast.success('Category add successfully');
          handleClose()
        }
      } catch (error) {
        toast.error(
          error?.message || 'An error occurred while fetching categories'
        );
      }
    };

  return (
    <>
      <ToastContainer position="bottom-right" delay={4000} />
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Categories
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, these are your all categories
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={handleOpen}
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Create category
          </Button>
        </Grid>
      </Grid>
      {isDialogOpen && (
        <FormDialog open={isDialogOpen} handleClose={handleClose}>
          <CategoryForm
            submitCategoryHandler={postCategoryHandler}
            asUpdate={false}
          />
        </FormDialog>
      )}
    </>
  );
}

export default PageHeader;
