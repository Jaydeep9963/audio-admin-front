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
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';

import { Artist } from 'src/models/artist_type';
import { CryptoOrderStatus } from 'src/models/category_type';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { deleteApi, putApi, urlToFile } from 'src/helper';
import { toast } from 'react-toast';
import { useDispatch, useSelector } from 'react-redux';
import { deleteArtist, updateArtist } from 'src/store/slices/artistSlice';
import FormDialog from 'src/Dialog/FormDialog';
import ArtistForm from './ArtistForm';
import DeleteDialog from 'src/Dialog/DeleteDialog';
import { RootState } from 'src/store/store';
import { useNavigate } from 'react-router';

interface ArtistsTableProps {
  artistsData: Artist[];
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

const ArtistsTable: FC<ArtistsTableProps> = ({
  artistsData,
  pageChangeHandler,
  limitChangeHandler,
  page,
  limit,
  searchQueryHandler,
  searchQuery
}) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<{
    id: string;
    name: string;
    bio: string;
    image: File | null;
  }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteArtistId, setDeleteArtistId] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const navigate = useNavigate();

  const { totalArtists } = useSelector((state: RootState) => state.artist);
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

  const onDeleteDialogOpen = (artistID: string) => {
    setIsDeleteDialogOpen(true);
    setDeleteArtistId(artistID);
  };

  const deleteHandler = async (artistId: string) => {
    try {
      const deletedArtist = await deleteApi(`/artists/${artistId}`, navigate);
      if (deletedArtist) {
        dispatch(deleteArtist(artistId));
        toast.success('Artist deleted successfully');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred while delete artist');
    }
  };

  const onDeleteHandler = async () => {
    await deleteHandler(deleteArtistId);
    setIsDeleteDialogOpen(false);
  };

  const handleOpen = async (artist: Artist) => {
    setSelectedArtist({
      id: artist._id,
      name: artist.name,
      bio: artist.bio || '',
      image: artist.image ? await urlToFile(
        artist.image.file,
        artist.image.fileName,
        artist.image.fileType
      ) : null
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

  const updateArtistHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: Artist } = await putApi(
        `/artists/${selectedArtist.id}`,
        body,
        navigate
      );
      if (response) {
        dispatch(updateArtist(response.data));
        toast.success('Artist updated successfully');
        handleClose();
      }
    } catch (error) {
      console.log('🚀 ~ updateArtistHandler ~ error:', error);
    }
  };

  const generateImageUrls = async (artists) => {
    const urls = await Promise.all(
      artists.map(async (artist) => {
        if (artist.image && artist.image.file) {
          const file = await urlToFile(
            artist.image.file,
            artist.image.fileName,
            artist.image.fileType
          );
          console.log('🚀 ~ artists.map ~ file:', file);
          const url = URL.createObjectURL(file);
          console.log("🚀 ~ artists.map ~ url:", url);
          return url;
        } else {
          return null;
        }
      })
    );
    setImageUrls(urls);
  };

  useEffect(() => {
    if (artistsData) {
      generateImageUrls(artistsData);
    }
  }, [artistsData]);

  const theme = useTheme();

  return (
    <>
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
                  value={null}
                  inputValue={searchQuery}
                  onInputChange={(event, newInputValue) => {
                    console.log("🚀 ~ newInputValue:", newInputValue);
                    return searchQueryHandler(newInputValue);
                  }}
                  options={[]}
                  loading={loading}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Artists"
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
          title="Search Artists"
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Bio</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artistsData?.map((artist, index) => {
                const isCryptoOrderSelected = selectedCryptoOrders.includes(
                  artist._id
                );
                return (
                  <TableRow
                    hover
                    key={artist._id}
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
                        {artist.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {artist.image ? (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}/${artist.image.file}`}
                          alt="Artist"
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <Typography>-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {artist.bio || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Artist" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleOpen(artist)}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Artist" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => onDeleteDialogOpen(artist._id)}
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
                  <ArtistForm
                    submitArtistHandler={updateArtistHandler}
                    asUpdate={true}
                    existData={{
                      name: selectedArtist.name,
                      bio: selectedArtist.bio,
                      image: selectedArtist.image
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
            count={totalArtists}
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

ArtistsTable.propTypes = {
  artistsData: PropTypes.array.isRequired
};

ArtistsTable.defaultProps = {
  artistsData: []
};

export default ArtistsTable;