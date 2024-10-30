import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import FormDialog from 'src/Dialog/FormDialog';
import SubCategoryForm from './SubCategoryForm';
import { useState } from 'react';
import { SubCategory } from 'src/models/subcategory_type';
import { useDispatch } from 'react-redux';
import { postApi } from 'src/helper';
import { setSubCategory } from 'src/store/slices/subCategorySlice';
import { toast } from 'react-toast';
import { useNavigate } from 'react-router';

function PageHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const  navigate = useNavigate();

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

  const postSubCategoryHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: SubCategory } = await postApi(
        '/subcategories',
        body,
        navigate
      );
      console.log('🚀 ~ postCategoryHandler ~ response:', response);
      if (response) {
        dispatch(setSubCategory(response.data));
        toast.success('Category add successfully');
        handleClose();
      }
    } catch (error) {
      toast.error(
        error?.message || 'An error occurred while fetching categories'
      );
    }
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            SubCategories
          </Typography>
          <Typography variant="subtitle2">
            {user.name}, these are your all subcategories
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={handleOpen}
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Create subcategory
          </Button>
        </Grid>
      </Grid>
      {isDialogOpen && (
        <FormDialog open={isDialogOpen} handleClose={handleClose}>
          <SubCategoryForm
            submitSubCategoryHandler={postSubCategoryHandler}
            asUpdate={false}
          />
        </FormDialog>
      )}
    </>
  );
}

export default PageHeader;
