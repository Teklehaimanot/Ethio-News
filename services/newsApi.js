import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config";

const BASE_URL = baseUrl;
export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("x-auth", `${token}`);
      }
    },
  }),
  tagTypes: ["News", "Comments", "Like"],
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ page, limit }) => `api/v1/news?page=${page}&limit=${limit}`,
      providesTags: ["News"],
    }),
    getNewsById: builder.query({
      query: (newsid) => `api/v1/news/${newsid}`,
      providesTags: ["News"],
    }),
    postComments: builder.mutation({
      query: ({ newComment, newsid }) => ({
        url: `api/v1/news/createComment/${newsid}`,
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: ["Comments", "News"],
    }),
    getCommentsById: builder.query({
      query: (newsid) => `api/v1/news/${newsid}/comments`,
      providesTags: ["Comments", "News"],
    }),
    likeNewsById: builder.mutation({
      query: (newsid) => ({
        url: `api/v1/news/${newsid}/like`,
        method: "POST",
      }),
      invalidatesTags: ["News", "Like"],
    }),
    dislikeNewsById: builder.mutation({
      query: (newsid) => ({
        url: `api/v1/news/${newsid}/dislike`,
        method: "POST",
      }),
      invalidatesTags: ["News", "Like"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  usePostCommentsMutation,
  useGetCommentsByIdQuery,
  useLikeNewsByIdMutation,
  useDislikeNewsByIdMutation,
} = newsApi;
