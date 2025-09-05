import { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Box,
  FormControl,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  Autocomplete,
  TextField,
  CircularProgress,
  Rating,
  Chip
} from '@mui/material';

import { Review } from 'src/models/review_type';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { format } from 'date-fns';

interface ReviewsTableProps {
  reviewsData: Review[];
  pageChangeHandler: React.Dispatch<React.SetStateAction<number>>;
  limitChangeHandler: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  limit: number;
  searchQueryHandler: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  loading?: boolean;
}

const ReviewsTable: FC<ReviewsTableProps> = ({
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

  const theme = useTheme();

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
                      label="Search Reviews"
                      variant="outlined"
                      placeholder="Search by name or comment..."
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Comment</TableCell>
                <TableCell align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewsData?.length > 0 ? (
                reviewsData.map((review, index) => (
                  <TableRow hover key={review._id}>
                    <TableCell align="center">
                      {page * limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography
                        align="center"
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {review.name || 'Anonymous'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={review.type}
                        color={getTypeColor(review.type)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {review.rating !== null ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            precision={0.5}
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({review.rating})
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No rating
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        color="text.primary"
                        style={{
                          maxWidth: '250px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: review.comment.length > 50 ? 'pointer' : 'default'
                        }}
                        title={review.comment}
                      >
                        {review.comment || 'No comment provided'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box py={3}>
                      <Typography variant="h6" color="text.secondary">
                        {loading ? 'Loading reviews...' : 'No reviews found'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={totalItems || 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15, 20, 25]}
          />
        </Box>
      </Card>
    </>
  );
};

ReviewsTable.propTypes = {
  reviewsData: PropTypes.array.isRequired
};

ReviewsTable.defaultProps = {
  reviewsData: []
};

export default ReviewsTable;