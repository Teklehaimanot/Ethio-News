import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUpdateAboutNdmcMutation } from "../../services";
import Loading from "../Loading";

const AboutUpdate = () => {
  const [formData, setFormData] = useState({
    directorTitle: "",
    directorDescription: "",
    strategiesTitle: "",
    strategiesDescription: "",
    aboutUs: "",
    mission: "",
    vision: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const basicUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${basicUrl}/aboutNdmc`);
        const ndmcData = result.data;
        setFormData({
          ...formData,
          directorTitle: ndmcData.directorStatement.title,
          directorDescription: ndmcData.directorStatement.description,
          strategiesTitle: ndmcData.strategies.title,
          strategiesDescription: ndmcData.strategies.description,
          aboutUs: ndmcData.aboutUs,
          mission: ndmcData.mission,
          vision: ndmcData.vision,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, []);

  const [updateNdmc, { isLoading, data, isSuccess, isError, error }] =
    useUpdateAboutNdmcMutation();

  const updatedAboutData = {
    directorStatement: {
      title: formData.directorTitle,
      description: formData.directorDescription,
    },
    strategies: {
      title: formData.strategiesTitle,
      description: formData.strategiesDescription,
    },
    aboutUs: formData.aboutUs,
    vision: formData.vision,
    mission: formData.mission,
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    try {
      updateNdmc(updatedAboutData);
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
          Content is successfully Updated
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-2/3 m-auto flex flex-col space-y-5 my-5 justify-center overflow-y-scroll "
      style={{ height: "95%" }}
    >
      {isError && (
        <div className=" text-error">
          {error?.data?.error || "An error occured"}
        </div>
      )}
      <div className="text-blue">Update About Ndmc Contents</div>
      <form className="flex flex-col space-y-5" onSubmit={handelSubmit}>
        <div className="flex flex-col space-y-3">
          <h3>Driector Statement</h3>
          <input
            type="text"
            placeholder="Title"
            className="p-3  placeholder-gray rounded"
            name="directorTitle"
            onChange={handleChange}
            value={formData.directorTitle}
            required
          />
          <textarea
            placeholder="Description."
            className="p-3 placeholder-gray rounded "
            name="directorDescription"
            onChange={handleChange}
            value={formData.directorDescription}
            required
          />
        </div>
        <div className="flex flex-col space-y-3">
          <h3>Strategies</h3>
          <input
            type="text"
            placeholder="Title"
            className="p-3  placeholder-gray rounded"
            name="strategiesTitle"
            onChange={handleChange}
            value={formData.strategiesTitle}
            required
          />
          <textarea
            placeholder="Description."
            className="p-3 placeholder-gray rounded "
            name="strategiesDescription"
            onChange={handleChange}
            value={formData.strategiesDescription}
            required
          />
        </div>

        <div className="flex flex-col space-y-3">
          <h3>About us, Vision, Mission</h3>
          <input
            type="text"
            placeholder="About us"
            className="p-3  placeholder-gray rounded"
            name="aboutUs"
            onChange={handleChange}
            value={formData.aboutUs}
            required
          />
          <input
            type="text"
            placeholder="Vision"
            className="p-3  placeholder-gray rounded"
            name="vision"
            onChange={handleChange}
            value={formData.vision}
            required
          />
          <input
            type="text"
            placeholder="Mission"
            className="p-3  placeholder-gray rounded"
            name="mission"
            onChange={handleChange}
            value={formData.mission}
            required
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

export default AboutUpdate;
