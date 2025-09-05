import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Autocomplete,
  CircularProgress,
  TextField
} from '@mui/material';

import Label from 'src/components/Label';
import { CryptoOrderStatus } from 'src/models/category_type';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { truncateUrl } from 'src/utility';
import { SubCategory } from 'src/models/subcategory_type';
import { categories_data, subcategories_data } from 'src/constant';
import FormDialog from 'src/Dialog/FormDialog';
import SubCategoryForm from './SubCategoryForm';
import { RootState } from 'src/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteApi, putApi, urlToFile } from 'src/helper';
import { deleteSubCategory, updateSubCategory } from 'src/store/slices/subCategorySlice';
import { toast } from 'react-toast';
import DeleteDialog from 'src/Dialog/DeleteDialog';
import { useNavigate } from 'react-router';

interface RecentOrdersTableProps {
  subcategoriesData: SubCategory[];
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

const SubCategoriesTable: FC<RecentOrdersTableProps> = ({
  subcategoriesData,
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
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
     const [deleteSubCatId, setDeleteSubCatId] = useState('');

  const [selectedSubCategory, setSelectedSubCategory] = useState<{
    id: string;
    subCategory_name: string;
    image: File | null;
    description: string;
    category: { _id: string; category_name: string };
  }>();
  const { totalSubCategories } = useSelector(
    (state: RootState) => state.subcategory
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateSubCategoryHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: SubCategory } = await putApi(
        `/subcategories/${selectedSubCategory.id}`,
        body,
        navigate
      );
      if (response) {
        dispatch(updateSubCategory(response.data));
        toast.success('SubCategory update successfully');
        handleClose();
      }
    } catch (error) {
      console.log('🚀 ~ updateCategoryHandler ~ error:', error);
    }
  };

    const onDeleteDialogOpen = (categoryID: string) => {
      setIsDeleteDialogOpen(true);
      setDeleteSubCatId(categoryID);
    };

    const deleteHandler = async (subCategoryId: string) => {
      try {
        const deletedCat = await deleteApi(
          `/subcategories/${subCategoryId}`,
          navigate
        );
        if (deletedCat) {
          dispatch(deleteSubCategory(subCategoryId));
          toast.success('SubCategory deleted successfully');
        }
      } catch (error) {
        toast.error(
          error?.message || 'An error occurred while delete subCategory'
        );
      }
    };

    const onDeleteHandler = async () => {
      await deleteHandler(deleteSubCatId);
      setIsDeleteDialogOpen(false);
    };

  const handlePageChange = (event: any, newPage: number): void => {
    pageChangeHandler(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    limitChangeHandler(parseInt(event.target.value));
  };

  const handleOpen = async (subCategory: SubCategory) => {
    setSelectedSubCategory({
      id: subCategory._id,
      subCategory_name: subCategory.subcategory_name,
      image: await urlToFile(
        subCategory.image.file,
        subCategory.image.fileName,
        subCategory.image.fileType
      ),
      category: subCategory.category,
      description: subCategory.description
    });
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          {/* <B /> */}
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={300}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  value={null} // No default value initially
                  inputValue={searchQuery} // The current search query
                  onInputChange={(event, newInputValue) => {
                    console.log('🚀 ~ newInputValue:', newInputValue);
                    return searchQueryHandler(newInputValue);
                  }} // Update input value as user types
                  options={[]} // Dynamic category options
                  getOptionLabel={(option) => option.name || ''} // Display category name in the list
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  } // Match by id
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search SubCategories"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>
                      }}
                    />
                  )}
                />
              </FormControl>
            </Box>
          }
          title="SubCategories"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">name</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategoriesData?.map((subcategory, index) => {
              console.log(
                '🚀 ~ {subcategoriesData?.map ~ subcategory:',
                subcategory
              );
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                subcategory._id
              );
              return (
                <TableRow
                  hover
                  key={subcategory._id}
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
                      {subcategory.subcategory_name}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${subcategory.image.file}`}
                      alt="Selected"
                      style={{ width: '80px', height: '80px' }}
                    />
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
                      {subcategory?.category?.category_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {subcategory.description}
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
                        onClick={() => handleOpen(subcategory)}
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Subcategory" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => onDeleteDialogOpen(subcategory._id)}
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
                <SubCategoryForm
                  submitSubCategoryHandler={updateSubCategoryHandler}
                  asUpdate={true}
                  existData={{
                    id: selectedSubCategory.id,
                    subCategoryName: selectedSubCategory.subCategory_name,
                    image: selectedSubCategory.image,
                    description: selectedSubCategory.description,
                    category: selectedSubCategory.category
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
          count={totalSubCategories}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Box>
    </Card>
  );
};

SubCategoriesTable.propTypes = {
  subcategoriesData: PropTypes.array.isRequired
};

SubCategoriesTable.defaultProps = {
  subcategoriesData: []
};

export default SubCategoriesTable;
