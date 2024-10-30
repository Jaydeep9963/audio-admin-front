import {
  Box,
  Container,
  Card,
  Button,
  Avatar,
  CardActionArea,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  styled,
  alpha
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toast';
import { getApi } from 'src/helper';
import { RootState } from 'src/store/store';
import { TotalNumberResponse } from 'src/type';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

function Overview() {
  const { token } = useSelector((state: RootState) => state.admin);
  const [total, setTotal] = useState<TotalNumberResponse | null>(null);
  const navigate = useNavigate();

  const getTotalNumber = async () => {
    try {
      const getTotal: TotalNumberResponse = await getApi('/overview', navigate);
      if (getTotal) {
       setTotal(getTotal);
      }
    } catch (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong ! try again later.');
      }
    }
  };

  useEffect(() => {
    getTotalNumber();
  }, []);

  console.log('🚀 ~ Overview ~ token:', token);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      ></Box>
      <Grid
        container
        sx={{
          marginX: 'auto'
        }}
        spacing={1}
      >
        <Grid xs={12} sm={6} md={3} item>
          <Card
            sx={{
              px: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard/category')}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="BTC"
                  src="/static/images/placeholders/logo/music.jpg"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Category
              </Typography>

              <Box
                sx={{
                  pt: 3,
                  mx: 'auto'
                }}
              >
                <Typography
                  alignSelf={'center'}
                  variant="h3"
                  gutterBottom
                  noWrap
                >
                  {total?.totalNumOfCategory ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Card
            sx={{
              px: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard/subcategory')}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="Ripple"
                  src="/static/images/placeholders/logo/music.jpg"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Subcategory
              </Typography>
              <Box
                sx={{
                  pt: 3
                }}
              >
                <Typography variant="h3" gutterBottom noWrap>
                  {total?.totalNumOfSubCategory ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Card
            sx={{
              px: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard/audio')}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="Cardano"
                  src="/static/images/placeholders/logo/podcast.jpg"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Audio
              </Typography>
              <Box
                sx={{
                  pt: 3
                }}
              >
                <Typography variant="h3" gutterBottom noWrap>
                  {total?.totalNumOfAudio ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Overview;
