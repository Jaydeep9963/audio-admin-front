export interface Artist {
  _id: string;
  name: string;
  bio?: string;
  image?: { file: string; fileName: string; fileType: string; fileSize: number };
}