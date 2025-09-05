import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toast';
import { store } from './store/store';
import { NavigateFunction } from 'react-router-dom';

export const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const handleAxiosError = (error: any, navigate: NavigateFunction) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      // Navigate to the login page if 403 error occurs
      navigate('/login');
      return;
    }
    // If the error is an Axios error, check if there's a response from the server
    if (error.response) {
      // The request was made and the server responded with a status code outside of the 2xx range
      toast.error(error.response.data.message || error.message);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response received from the server');
    } else {
      // Something happened in setting up the request that triggered an error
      toast.error(error.message);
    }
  } else {
    // Handle non-Axios errors (unexpected)
    throw new Error('An unexpected error occurred');
  }
};

export const getApi = async <T>(
  url: string,
  navigationFunction: NavigateFunction,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const token = store.getState().admin.token;
    const response = await axios.get<T>(API_URL + url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log('🚀 ~ error:', error);
    handleAxiosError(error, navigationFunction);
  }
};

export const postApi = async <T>(
  url: string,
  body: FormData,
  navigationFunction: NavigateFunction,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const token = store.getState().admin.token;
    const response = await axios.post<T>(API_URL + url, body, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, navigationFunction);
  }
};

export const putApi = async <T>(
  url: string,
  body: FormData,
  navigationFunction: NavigateFunction,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const token = store.getState().admin.token;
    const response = await axios.put<T>(API_URL + url, body, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, navigationFunction);
  }
};

// Helper function for DELETE request
export const deleteApi = async <T>(
  url: string,
  navigationFunction: NavigateFunction,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const token = store.getState().admin.token;
    const response = await axios.delete<T>(API_URL + url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log('🚀 ~ error:', error);
    handleAxiosError(error, navigationFunction);
  }
};

export async function urlToFile(url: string, filename: string, mimeType: string) {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_IMAGE_URL}/`+ url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: mimeType });
  return file;
}
