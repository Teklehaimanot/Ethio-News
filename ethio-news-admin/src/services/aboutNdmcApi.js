import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aboutNdmcApi = createApi({
  reducerPath: "aboutNdmcApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("x-auth", `${token}`);
      }
    },
  }),
  tagTypes: ["AboutNdmc"],
  endpoints: (builder) => ({
    getAboutNdmc: builder.query({
      query: () => `/aboutNdmc`,
      providesTags: ["AboutNdmc"],
    }),
    updateAboutNdmc: builder.mutation({
      query: (updatedAboutData) => ({
        url: `/aboutNdmc`,
        method: "PUT",
        body: updatedAboutData,
      }),
      invalidatesTags: ["AboutNdmc"],
    }),
  }),
});

export const { useGetAboutNdmcQuery, useUpdateAboutNdmcMutation } =
  aboutNdmcApi;
