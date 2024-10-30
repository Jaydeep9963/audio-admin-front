export interface SubCategory {
  _id: string;
  subcategory_name: string;
  image: { file: string; fileName: string; fileType: string, fileSize: number};
  description?: string;
  category: {
    _id: string;
    category_name: string;
  };
  audios: string[];
}
