import { Category } from "./models/category_type";
import { SubCategory } from "./models/subcategory_type";

export const categories_data = [
  {
    _id: '1',
    category_name: 'Hindi',
    image: {
      file: 'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
      fileName: 'dummy',
      fileType: 'image/png',
      fileSize: 2000
    },
    description: 'Hindi song'
  }
];

export const subcategories_data: SubCategory[] = [
  {
    _id: '1',
    subcategory_name: 'Mashup',
    image: {
      file: 'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
      fileName: 'dummy',
      fileType: 'image/png',
      fileSize: 2000
    },
    description: 'Hindi song',
    category: null,
    audios: []
  },
  {
    _id: '2',
    subcategory_name: 'Lofi',
    image: {
      file: 'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
      fileName: 'dummy',
      fileType: 'image/png',
      fileSize: 2000
    },
    description: 'Punjabi song',
    category: { _id: '670e472347d9e2327beaa337', category_name: 'English' },
    audios: []
  },
  {
    _id: '3',
    subcategory_name: 'Love',
    image: {
      file: 'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
      fileName: 'dummy',
      fileType: 'image/png',
      fileSize: 2000
    },
    description: 'Gujarati song',
    category: null,
    audios: []
  },
  {
    _id: '4',
    subcategory_name: 'Alone',
    image: {
      file: 'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
      fileName: 'dummy',
      fileType: 'image/png',
      fileSize: 2000
    },
    description: 'English song',
    category: null,
    audios: []
  }
];

export const audios_data = [
  {
    id: '1',
    title: 'Let me love you',
    audioUrl: '/static/audio/dummy.mp3',
    lyricsUrl:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    subcategory: "Love"
  },
  {
    id: '2',
    title: 'Filhal',
    audioUrl: '/static/audio/dummy.mp3',
    lyricsUrl:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    subcategory: "Alone"
  },
  {
    id: '3',
    title: 'Tere nal',
    audioUrl: '/static/audio/dummy.mp3',
    lyricsUrl:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    subcategory: "Mashup"
  },
];

  export const allCat = {
    _id: 'all',
    category_name: 'All',
    image: {file: 'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',fileName: "dummy", fileType: "image/png", fileSize: 2000},
    description: 'all'
  };
