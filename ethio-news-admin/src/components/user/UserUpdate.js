import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../services";
import Loading from "../Loading";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserUpdate = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const basicUrl = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${basicUrl}/user/${userId}`);
        const userData = result.data.user;

        setFormData({
          ...formData,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [userId]);

  const [updateUser, { isLoading, data, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const updatedUserData = {
    name: formData.name,
    email: formData.email,
    role: formData.role,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    try {
      updateUser({ userId, updatedUserData });
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
          User {data.name} is successfully updated
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
      <div className="text-blue">Update a user</div>
      <form className="flex flex-col space-y-5" onSubmit={handelSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="p-3  placeholder-gray rounded"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-3  placeholder-gray rounded"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <select
          onChange={handleChange}
          name="role"
          value={formData.role}
          className="p-3  placeholder-gray rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          className="p-3  placeholder-gray rounded"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-3  placeholder-gray rounded"
          onChange={handleChange}
          name="confirmPassword"
          value={formData.confirmPassword}
        />
        <input
          type="submit"
          value={!isLoading ? "Save" : ".... loading"}
          className="p-3  placeholder-gray rounded bg-primary text-secondary text-lg text-bold"
        />
      </form>
    </div>
  );
};

export default UserUpdate;
