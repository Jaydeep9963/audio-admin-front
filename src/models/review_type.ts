export interface Review {
  _id: string;
  name: string;
  rating: number | null;
  comment: string;
  type: string;
  createdAt: string;
  __v: number;
}

export interface ReviewResponse {
  feedback: Review[];
  totalFeedback: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}