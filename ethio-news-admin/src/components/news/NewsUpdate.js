import React, { useState, useEffect } from "react";
import { useUpdateNewsMutation } from "../../services";
import Loading from "../Loading";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsUpdate = () => {
  const { newsId } = useParams();
  console.log(newsId);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
    source: "",
    sourceUrl: "",
  });
  const basicUrl = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const result = await axios.get(`${basicUrl}/news/${newsId}`);
        const newsData = result.data;

        setFormData({
          ...formData,
          title: newsData.title,
          description: newsData.description,
          date: newsData.date,
          source: newsData.source,
          sourceUrl: newsData.sourceUrl,
        });
      } catch (error) {
        console.error("Error fetching news data", error);
      }
    };

    fetchNews();
  }, [newsId]);

  const [updateNews, { isLoading, data, isSuccess, isError, error }] =
    useUpdateNewsMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    try {
      const updatedNewsData = new FormData();
      updatedNewsData.append("title", formData.title);
      updatedNewsData.append("description", formData.description);
      updatedNewsData.append("source", formData.source);
      updatedNewsData.append("sourceUrl", formData.sourceUrl);
      updatedNewsData.append("date", formData.date);
      updatedNewsData.append("image", formData.image);
      updateNews({ newsId, updatedNewsData });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div
        className="w-1/3 m-auto flex flex-col space-y-5 h-2/3 justify-center overflow-y-scroll "
        style={{ height: "90%" }}
      >
        <div className=" p-10 m-auto text-2xl">
          <Loading />
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className=" text-primary h-full text-center">
        <div className="bg-secondary p-10 m-auto text-2xl shadow-lg">
          News {data.title} is successfully updated
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 m-auto flex flex-col space-y-5 h-2/3 justify-center">
      {isError && (
        <div className=" text-error">
          {error?.data?.error || "An error occured"}
        </div>
      )}
      <div className="text-blue">Update News</div>
      <form className="flex flex-col space-y-5" onSubmit={handelSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="p-3  placeholder-gray rounded"
          name="title"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <textarea
          placeholder="Compose a paragraph to serve as a description."
          className="p-3 placeholder-gray rounded "
          onChange={handleChange}
          name="description"
          value={formData.description}
          required
        />
        <input
          type="text"
          placeholder="Source of News"
          className="p-3  placeholder-gray rounded"
          name="source"
          onChange={handleChange}
          value={formData.source}
          required
        />
        <input
          type="text"
          placeholder="Source Link"
          className="p-3  placeholder-gray rounded"
          name="sourceUrl"
          onChange={handleChange}
          value={formData.sourceUrl}
          required
        />
        <input
          type="date"
          className="p-3  placeholder-gray rounded"
          onChange={handleChange}
          name="date"
          value={formData.date}
        />

        <div className="p-3  placeholder-gray rounded bg-secondary flex flex-col">
          <span className="text-primary mb-2">Upload Image</span>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <input
          type="submit"
          value={!isLoading ? "Save" : ".... loading"}
          className="p-3  placeholder-gray rounded bg-primary text-secondary text-lg text-bold"
        />
      </form>
    </div>
  );
};

export default NewsUpdate;
