import { Card } from '@mui/material';
import { categories_data, subcategories_data } from 'src/constant';
import SubCategoriesTable from './SubCategoriesTable';

function SubCategories() {
  return (
    <Card>
      <SubCategoriesTable subsubcategoriesData={subcategories_data} />
    </Card>
  );
}

export default SubCategories;
