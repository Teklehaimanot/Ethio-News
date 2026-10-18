import React, { useState } from "react";
import { useCreateUserMutation } from "../../services";
import Loading from "../Loading";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const [createUser, { isLoading, data, isSuccess, isError, error }] =
    useCreateUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const newUser = {
    name: formData.name,
    email: formData.email,
    role: formData.role,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };

  const handelSubmit = (e) => {
    console.log(newUser);
    e.preventDefault();
    try {
      createUser(newUser);
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
          User {data.name} is successfully created
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
      <div className="text-blue">Create a user</div>
      <form className="flex flex-col space-y-5" onSubmit={handelSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="p-3  placeholder-gray rounded"
          name="name"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-3  placeholder-gray rounded"
          onChange={handleChange}
          name="email"
          value={formData.email}
          required
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
          onChange={handleChange}
          name="password"
          value={formData.password}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-3  placeholder-gray rounded"
          onChange={handleChange}
          name="confirmPassword"
          value={formData.confirmPassword}
          required
        />
        <input
          type="submit"
          value={!isLoading ? "Create" : ".... loading"}
          className="p-3  placeholder-gray rounded bg-primary text-secondary text-lg text-bold"
        />
      </form>
    </div>
  );
};

export default UserRegister;
