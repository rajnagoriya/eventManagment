import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/user`,
    credentials: "include", // Needed for cookies
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    })
  }),
});

export const {   } = authApi;
