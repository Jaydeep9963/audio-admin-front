import axios, { AxiosRequestConfig } from 'axios';
export const API_URL = "http://localhost:3000/v1/admin";

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // If the error is an Axios error, check if there's a response from the server
    if (error.response) {
      // The request was made and the server responded with a status code outside of the 2xx range
      throw new Error(error.response.data || error.message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server');
    } else {
      // Something happened in setting up the request that triggered an error
      throw new Error(error.message);
    }
  } else {
    // Handle non-Axios errors (unexpected)
    throw new Error('An unexpected error occurred');
  }
};

export const getApi = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.get<T>(API_URL+url, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const postApi = async <T>(
  url: string,
  body: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.post<T>(API_URL + url, body, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const putApi = async <T>(
  url: string,
  body: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.put<T>(API_URL + url, body, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Helper function for DELETE request
export const deleteApi = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.delete<T>(API_URL+url, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
