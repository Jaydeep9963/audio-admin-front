import { Category } from "./models/category_type";
import { SubCategory } from "./models/subcategory_type";

export const categories_data = [
  {
    _id: '1',
    category_name: 'Hindi',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'Hindi song',
  },
  {
    _id: '2',
    category_name: 'Punjabi',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'Punjabi song'
  },
  {
    _id: '3',
    category_name: 'Gujarati',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'Gujarati song'
  },
  {
    _id: '4',
    category_name: 'English',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'English song'
  }
];

export const subcategories_data: SubCategory[] = [
  {
    id: '1',
    subcategory_name: 'Mashup',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'Hindi song'
  },
  {
    id: '2',
    subcategory_name: 'Lofi',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'Punjabi song'
  },
  {
    id: '3',
    subcategory_name: 'Love',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'Gujarati song'
  },
  {
    id: '4',
    subcategory_name: 'Alone',
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'English song'
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
    image:
      'https://media.istockphoto.com/id/530573404/photo/music-in-india.jpg?s=2048x2048&w=is&k=20&c=KHVQzFfpGIUesXoYn3GZKUWeMlnMbCpoSV7Ly4tMNo4=',
    description: 'all'
  };
