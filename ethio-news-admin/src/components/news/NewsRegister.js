import React, { useState } from "react";
import { useCreateNewsMutation } from "../../services";
import Loading from "../Loading";

const NewsRegister = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
    source: "",
    sourceUrl: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [createNews, { isLoading, data, isSuccess, isError, error }] =
    useCreateNewsMutation();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
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
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("description", formData.description);
      newData.append("source", formData.source);
      newData.append("sourceUrl", formData.sourceUrl);
      newData.append("date", formData.date);
      newData.append("image", formData.image);

      createNews(newData);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-1/3 m-auto flex flex-col space-y-5 h-2/3 justify-center  bg-transparent">
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
          News {data.title} is successfully created
        </div>
      </div>
    );
  }
  return (
    <div
      className="w-1/3 m-auto flex flex-col space-y-5 h-2/3 justify-center overflow-y-scroll "
      style={{ height: "90%" }}
    >
      {isError && (
        <div className=" text-error">
          {error?.data?.error || "An error occured"}
        </div>
      )}
      <div className="text-blue">Create a News</div>
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
        <label className=" flex items-center justify-center ">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className=" mr-4 size-5"
          />
          Input Date
        </label>

        {isChecked && (
          <input
            type="date"
            className="p-3  placeholder-gray rounded"
            onChange={handleChange}
            name="date"
            value={formData.date}
            // required
          />
        )}
        <div className="p-3  placeholder-gray rounded bg-secondary flex flex-col">
          <span className="text-primary mb-2">Upload Image</span>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </div>
        <input
          type="submit"
          value={!isLoading ? "Create" : ".... loading"}
          className="p-3  placeholder-gray rounded bg-primary text-secondary text-lg text-bold"
        />
      </form>
    </div>
  );
};

export default NewsRegister;
