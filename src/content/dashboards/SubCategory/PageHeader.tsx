import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import FormDialog from 'src/Dialog/FormDialog';
import AddSubCategory from './AddSubCategory';
import { useState } from 'react';

function PageHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
          <AddSubCategory />
        </FormDialog>
      )}
    </>
  );
}

export default PageHeader;
