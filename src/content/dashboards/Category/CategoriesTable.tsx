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
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import { Category, CryptoOrderStatus } from 'src/models/category_type';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Category as Icategory } from '@mui/icons-material';
import { truncateUrl } from 'src/utility';
import { deleteApi } from 'src/helper';
import { toast, ToastContainer } from 'react-toast';
import {useDispatch} from 'react-redux';
import { deleteCategory } from 'src/store/slices/categorySlice';


interface RecentOrdersTableProps {
  categoriesData: Category[];
}

interface Filters {
  status?: CryptoOrderStatus;
}

const applyPagination = (
  categoriesData: Category[],
  page: number,
  limit: number
): Category[] => {
  return categoriesData.slice(page * limit, page * limit + limit);
};

const CategoriesTable: FC<RecentOrdersTableProps> = ({ categoriesData }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
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

  const deleteHandler = async(categoryId: string) => {
    try {
      const deletedCat = await deleteApi(`/categories/${categoryId}`);
      if(deletedCat){
        dispatch(deleteCategory(categoryId));
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      toast.error(
        error?.message || 'An error occurred while delete category'
      );
    }
  }

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  // const paginatedCryptoOrders = applyPagination(
  //   filteredCryptoOrders,
  //   page,
  //   limit
  // );
  // const selectedSomeCryptoOrders =
  //   selectedCryptoOrders.length > 0 &&
  //   selectedCryptoOrders.length < categoriesData.length;
  // const selectedAllCryptoOrders =
  //   selectedCryptoOrders.length === categoriesData.length;
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
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Categories"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">name</TableCell>
              <TableCell align="center">Url</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                      {category._id}
                    </Typography>
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
                      {category.category_name}
                    </Typography>
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
                      {truncateUrl(category.image)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
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

                  <TableCell align="right">
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
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => deleteHandler(category._id)}
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Box p={2}>
        <TablePagination
          component="div"
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box> */}
      <ToastContainer/>
    </Card>
  );
};

CategoriesTable.propTypes = {
  categoriesData: PropTypes.array.isRequired
};

CategoriesTable.defaultProps = {
  categoriesData: []
};

export default CategoriesTable;
