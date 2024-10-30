export interface Audio {
  audio: { file: string; fileName: string; fileType: string; fileSize: number };
  image: { file: string; fileName: string; fileType: string; fileSize: number };
  lyrics?: {
    file: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };
  _id: string;
  title: string;
  subcategory: {
    _id: string;
    subcategory_name: string;
  };
}