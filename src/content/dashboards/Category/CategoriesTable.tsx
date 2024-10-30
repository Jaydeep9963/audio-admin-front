import { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  IconButton,
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
  CircularProgress
} from '@mui/material';

import { Category, CryptoOrderStatus } from 'src/models/category_type';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { deleteApi, putApi, urlToFile } from 'src/helper';
import { toast, ToastContainer } from 'react-toast';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, updateCategory } from 'src/store/slices/categorySlice';
import FormDialog from 'src/Dialog/FormDialog';
import CategoryForm from './CategoryForm';
import DeleteDialog from 'src/Dialog/DeleteDialog';
import { RootState } from 'src/store/store';
import { useNavigate } from 'react-router';

interface CategoriesTableProps {
  categoriesData: Category[];
  pageChangeHandler: React.Dispatch<React.SetStateAction<number>>;
  limitChangeHandler: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  limit: number;
  searchQueryHandler: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
}

interface Filters {
  status?: CryptoOrderStatus;
}

const CategoriesTable: FC<CategoriesTableProps> = ({
  categoriesData,
  pageChangeHandler,
  limitChangeHandler,
  page,
  limit,
  searchQueryHandler,
  searchQuery
}) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  // const [page, setPage] = useState<number>(0);
  // const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    category_name: string;
    image: File | null;
    description: string;
  }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const navigate = useNavigate();

  const { totalCategories } = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const onDeleteDialogOpen = (categoryID: string) => {
    setIsDeleteDialogOpen(true);
    setDeleteCatId(categoryID);
  };

  const deleteHandler = async (categoryId: string) => {
    try {
      const deletedCat = await deleteApi(`/categories/${categoryId}`, navigate);
      if (deletedCat) {
        dispatch(deleteCategory(categoryId));
        toast.success('Category deleted successfully');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred while delete category');
    }
  };

  const onDeleteHandler = async () => {
    await deleteHandler(deleteCatId);
    setIsDeleteDialogOpen(false);
  };

  const handleOpen = async (category: Category) => {
    setSelectedCategory({
      id: category._id,
      category_name: category.category_name,
      image: await urlToFile(
        category.image.file,
        category.image.fileName,
        category.image.fileType
      ),
      description: category.description
    });
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    pageChangeHandler(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    limitChangeHandler(parseInt(event.target.value));
  };

  const updateCategoryHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: Category } = await putApi(
        `/categories/${selectedCategory.id}`,
        body,
        navigate
      );
      if (response) {
        dispatch(updateCategory(response.data));
        toast.success('Category add successfully');
        handleClose();
      }
    } catch (error) {
      console.log('🚀 ~ updateCategoryHandler ~ error:', error);
    }
  };

  const generateImageUrls = async (categories) => {
    const urls = await Promise.all(
      categories.map(async (category) => {
       
        if (category.image && category.image.file) {
           const file = await urlToFile(
             category.image.file,
             category.image.fileName,
             category.image.fileType
           );
          console.log('🚀 ~ categories.map ~ file:', file);
          const url = URL.createObjectURL(file);
          console.log("🚀 ~ categories.map ~ url:", url)
          return url;
        } else {
          return null;
        }
      })
    );
    setImageUrls(urls);
  };

      useEffect(() => {
        if (categoriesData) {
          generateImageUrls(categoriesData);
        }
      }, [categoriesData]);

  const theme = useTheme();

  return (
    <>
      <ToastContainer position="bottom-right" delay={4000} />
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            {/* <B /> */}
          </Box>
        )}
        <CardHeader
          action={
            <Box width={300}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  value={null} // No default value initially
                  inputValue={searchQuery} // The current search query
                  onInputChange={(event, newInputValue) => {
                    console.log("🚀 ~ newInputValue:", newInputValue)
                    return (searchQueryHandler(newInputValue));
                  }
                    
                  
                  } // Update input value as user types
                  options={[]} // Dynamic category options
                  loading={loading} // Display a loading indicator
                  getOptionLabel={(option) => option.name || ''} // Display category name in the list
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  } // Match by id
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Categories"
                      variant="outlined"
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
          title="Search Categories"
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriesData?.map((category, index) => {
                const isCryptoOrderSelected = selectedCryptoOrders.includes(
                  category._id
                );
                return (
                  <TableRow
                    hover
                    key={category._id}
                    selected={isCryptoOrderSelected}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>
                      <Typography
                        align="center"
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {category.category_name}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <img
                        src={`${process.env.REACT_APP_BASE_URL}${category.image.file}`}
                        alt="Selected"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {category.description}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit Order" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleOpen(category)} // Added a handler for opening the dialog
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Order" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => onDeleteDialogOpen(category._id)}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Dialog for editing */}
              {isDialogOpen && (
                <FormDialog open={isDialogOpen} handleClose={handleClose}>
                  <CategoryForm
                    submitCategoryHandler={updateCategoryHandler}
                    asUpdate={true}
                    existData={{
                      categoryName: selectedCategory.category_name,
                      image: selectedCategory.image,
                      description: selectedCategory.description
                    }}
                  />
                </FormDialog>
              )}
            </TableBody>
          </Table>
          {isDeleteDialogOpen && (
            <DeleteDialog
              isOpen={isDeleteDialogOpen}
              handleClose={() => setIsDeleteDialogOpen(false)}
              onOk={onDeleteHandler}
            />
          )}
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={totalCategories}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Box>
      </Card>
    </>
  );
};

CategoriesTable.propTypes = {
  categoriesData: PropTypes.array.isRequired
};

CategoriesTable.defaultProps = {
  categoriesData: []
};

export default CategoriesTable;
