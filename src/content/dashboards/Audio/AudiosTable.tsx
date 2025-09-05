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
  TextField
} from '@mui/material';

import { CryptoOrderStatus } from 'src/models/category_type';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { truncateUrl } from 'src/utility';
import { categories_data, subcategories_data } from 'src/constant';
import { Audio } from 'src/models/audio_type';
import { RootState } from 'src/store/store';
import FormDialog from 'src/Dialog/FormDialog';
import AudioForm from './AudioForm';
import { deleteApi, putApi, urlToFile } from 'src/helper';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAudio, updateAudio } from 'src/store/slices/audioSlice';
import { toast, ToastContainer } from 'react-toast';
import DeleteDialog from 'src/Dialog/DeleteDialog';
import { useNavigate } from 'react-router';

interface AudioTableProps {
  audiosData: Audio[];
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

const AudiosTable: FC<AudioTableProps> = ({
  audiosData,
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
  const [selectedAudio, setSelectedAudio] = useState<{
    id: string;
    title: string;
    image: File | null;
    audio: File | null;
    subcategory: { _id: string; subcategory_name: string };
    lyrics?: File | null;
  }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteAudioId, setDeleteAudioId] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { totalAudios } = useSelector((state: RootState) => state.audio);

  const theme = useTheme();

  const handleOpen = async (audio: Audio) => {
    setSelectedAudio({
      id: audio._id,
      title: audio.title,
      image: await urlToFile(
        audio.image.file,
        audio.image.fileName,
        audio.image.fileType
      ),
      audio: await urlToFile(
        audio.audio.file,
        audio.audio.fileName,
        audio.audio.fileType
      ),
      lyrics: audio.lyrics ? await urlToFile(
        audio.lyrics?.file,
        audio.lyrics?.fileName,
        audio.lyrics?.fileType
      ) : null,
      subcategory: audio.subcategory
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

  const updateAudioHandler = async (body: FormData) => {
    try {
      const response: { success: boolean; data: Audio } = await putApi(
        `/audios/${selectedAudio.id}`,
        body,
        navigate
      );
      if (response) {
        dispatch(updateAudio(response.data));
        toast.success('Audio update successfully');
        handleClose();
      }
    } catch (error) {
      console.log('🚀 ~ updateCategoryHandler ~ error:', error);
    }
  };

  const onDeleteDialogOpen = (audioID: string) => {
    setIsDeleteDialogOpen(true);
    setDeleteAudioId(audioID);
  };

  const deleteHandler = async (categoryId: string) => {
    try {
      const deletedCat = await deleteApi(`/audios/${categoryId}`, navigate);
      if (deletedCat) {
        dispatch(deleteAudio(categoryId));
        toast.success('Audio deleted successfully');
      }
    } catch (error) {
      console.log("🚀 ~ deleteHandler ~ error:", error)
      toast.error(error?.message || 'An error occurred while delete audio');
    }
  };

  const onDeleteHandler = async () => {
    await deleteHandler(deleteAudioId);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ToastContainer position="bottom-right" delay={4000} />
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            {/* <B /> */}
          </Box>
        )}
        {!selectedBulkActions && (
          <CardHeader
            action={
              <Box
                width={320}
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
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
            title="Audios"
          />
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Audio_Url</TableCell>
                <TableCell align="center">lyrics_Url</TableCell>
                <TableCell align="center">Image_Url</TableCell>
                <TableCell align="center">Subcategory</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audiosData?.map((audio, index) => {
                const isCryptoOrderSelected = selectedCryptoOrders.includes(
                  audio._id
                );
                return (
                  <TableRow
                    hover
                    key={audio._id}
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
                        {audio.title}
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
                        <a
                          href={`${process.env.REACT_APP_BASE_URL}${audio.audio.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          type="audio/mpeg"
                        >
                          {truncateUrl(`${audio.audio.fileName}`)}
                        </a>
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
                       {audio.lyrics ?  <a
                          href={`${process.env.REACT_APP_BASE_URL}${audio.lyrics?.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {truncateUrl(audio.lyrics?.fileName)}
                        </a> : <Typography> - </Typography>}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}/${audio.image.file}`}
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
                        {audio?.subcategory?.subcategory_name}
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
                          onClick={() => handleOpen(audio)}
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
                          onClick={() => onDeleteDialogOpen(audio._id)}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {isDialogOpen && (
                <FormDialog open={isDialogOpen} handleClose={handleClose}>
                  <AudioForm
                    submitAudioHandler={updateAudioHandler}
                    asUpdate={true}
                    existData={{
                      title: selectedAudio.title,
                      subcategory: { ...selectedAudio.subcategory },
                      image: selectedAudio.image,
                      audio: selectedAudio.audio,
                      lyrics: selectedAudio.lyrics
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
            count={totalAudios}
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

AudiosTable.propTypes = {
  audiosData: PropTypes.array.isRequired
};

AudiosTable.defaultProps = {
  audiosData: []
};

export default AudiosTable;
