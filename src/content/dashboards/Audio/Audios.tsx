import { Card } from '@mui/material';
import { audios_data } from 'src/constant';
import AudiosTable from './AudiosTable';

function SubCategories() {
  return (
    <Card>
      <AudiosTable audiosData={audios_data} />
    </Card>
  );
}

export default SubCategories;
