import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse } from './type';
import { Category } from 'src/models/category_type';
import { CategoryState } from '../slices/type';
import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/v1/admin',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).admin.token;
    console.log("🚀 ~ token:", token)
    if (token) {
      headers.set('Authorization', `${token}`);
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      headers.set('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }
});

const baseQueryWithInterceptor = async (
  args: unknown,
  api: BaseQueryApi,
  extraOptions: { single?: AbortSignal }
) => {
  const result = await baseQuery(args as FetchArgs, api, extraOptions);
  // if (result?.error?.status === 401) {
  //   api.dispatch(setLogout());
  // }
  return result;
};

const adminApi = createApi({
  reducerPath: 'adminApi',
  keepUnusedDataFor: 60,
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, Partial<FormData>>({
      query: (adminBody) => ({
        url: '/login',
        method: 'POST',
        body: adminBody
      })
    }),
    getCategories: builder.mutation<{ categories: CategoryState }, void>({
      query: () => ({
        url: '/categories',
        method: 'GET'
      })
    })
  })
});

export default adminApi;
