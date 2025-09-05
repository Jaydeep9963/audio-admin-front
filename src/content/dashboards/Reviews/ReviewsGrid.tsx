import { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Box,
  FormControl,
  Card,
  CardContent,
  Typography,
  useTheme,
  CardHeader,
  Autocomplete,
  TextField,
  CircularProgress,
  Chip,
  Grid,
  Avatar,
  Stack,
  TablePagination,
  Paper,
  Tooltip
} from '@mui/material';
import {
  CalendarToday,
  ChatBubbleOutline
} from '@mui/icons-material';

import { Review } from 'src/models/review_type';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { format } from 'date-fns';

interface ReviewsGridProps {
  reviewsData: Review[];
  pageChangeHandler: React.Dispatch<React.SetStateAction<number>>;
  limitChangeHandler: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  limit: number;
  searchQueryHandler: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  loading?: boolean;
}

const ReviewsGrid: FC<ReviewsGridProps> = ({
  reviewsData,
  pageChangeHandler,
  limitChangeHandler,
  page,
  limit,
  searchQueryHandler,
  searchQuery,
  loading = false
}) => {
  const { totalItems } = useSelector((state: RootState) => state.review);
  const theme = useTheme();

  const handlePageChange = (event: any, newPage: number): void => {
    pageChangeHandler(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    limitChangeHandler(parseInt(event.target.value));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'feedback':
        return 'primary';
      case 'review':
        return 'success';
      case 'complaint':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main
    ];
    const charCode = name ? name.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Box width={300}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  value={null}
                  inputValue={searchQuery}
                  onInputChange={(event, newInputValue) => {
                    searchQueryHandler(newInputValue);
                  }}
                  options={[]}
                  loading={loading}
                  getOptionLabel={(option) => option || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by Name"
                      variant="outlined"
                      placeholder="Search by user name..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </FormControl>
            </Box>
          }
          title="User Reviews & Feedback"
        />
        <Divider />
        
        <Box p={3}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress size={60} />
            </Box>
          ) : reviewsData?.length > 0 ? (
            <Grid container spacing={3}>
              {reviewsData.map((review, index) => (
                <Grid item xs={12} sm={6} lg={4} key={review._id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Header with user info and type */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: getAvatarColor(review.name || 'Anonymous'),
                            mr: 2,
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {getInitials(review.name || 'Anonymous')}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                            {review.name || 'Anonymous'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={review.type}
                        color={getTypeColor(review.type)}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                      />
                    </Box>

                    {/* Comment */}
                    <Box mb={1.5}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <ChatBubbleOutline sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Comment
                        </Typography>
                      </Box>
                      <Tooltip 
                        title={review.comment || 'No comment provided'} 
                        placement="top"
                        arrow
                      >
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.4,
                            fontStyle: !review.comment ? 'italic' : 'normal'
                          }}
                        >
                          {review.comment || 'No comment provided'}
                        </Typography>
                      </Tooltip>
                    </Box>

                    {/* Date */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight={300}
              textAlign="center"
            >
              <ChatBubbleOutline sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reviews found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {searchQuery ? 'Try adjusting your search terms' : 'Reviews will appear here when users submit feedback'}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />
        <Box p={2}>
          <TablePagination
            component="div"
            count={totalItems || 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[6, 12, 18, 24, 30]}
            labelRowsPerPage="Cards per page:"
          />
        </Box>
      </Card>
    </>
  );
};

ReviewsGrid.propTypes = {
  reviewsData: PropTypes.array.isRequired
};

ReviewsGrid.defaultProps = {
  reviewsData: []
};

export default ReviewsGrid;