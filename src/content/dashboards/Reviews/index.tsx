import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import Reviews from './Reviews';

const ReviewsPage = () => {
  return (
    <>
      <Helmet>
        <title>Reviews</title>
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
            <Reviews />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ReviewsPage;