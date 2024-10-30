import React from 'react'
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import SubCategories from './SubCategories';

const SubCategory = () => {
  return (
    <>
      <Helmet>
        <title>SubCategories</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <SubCategories />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default SubCategory;