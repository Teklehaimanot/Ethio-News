import React from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { useDeleteUserMutation, useGetUsersQuery } from "../../services";
import Loading from "../Loading";
import PopupDelete from "../PopupDelete";
import { useDebounce } from "use-debounce";

const UserListView = ({ page, handlePagination, searchName }) => {
  const [debouncedValue] = useDebounce(searchName, 500);
  const { data, error, isLoading } = useGetUsersQuery({
    page: page,
    name: debouncedValue,
    limit: 15,
  });
  const [deleteUser] = useDeleteUserMutation();

  if (error) {
    return (
      <div className="w-full text-center my-4">
        <h1 className="text-error">
          {error.data
            ? error.data.error
            : " Error loading data. Please try again."}
        </h1>
      </div>
    );
  }

  if (data) {
    handlePagination(data.pagination);
  }

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="w-full ">
      <table className="w-full flex flex-col justify-between bg-secondary mt-1 py-2 ">
        <tr className=" flex flex-row justify-between items-center   text-blue py-4 my-3  border-b">
          <th className="w-1/5 ">Name</th>
          <th className="w-1/5 ">Eamil</th>
          <th className="w-1/5 ">Role</th>
          <th className="w-1/5">Edit</th>
          <th className="w-1/5">Delete</th>
        </tr>
        {isLoading && (
          <div className=" mx-auto">
            <Loading />
          </div>
        )}
        {data?.data.map((user) => (
          <tr
            className="flex flex-row justify-between items-center  my-3 py-1 border-b text-gray-dark text-sm"
            key={user._id}
          >
            <td className="w-1/5 text-center">{user.name}</td>
            <td className="w-1/5 text-center">{user.email}</td>
            <td className="w-1/5 text-center">{user.role}</td>
            <td className="w-1/5 text-center">
              <Link className=" text-xl hover:text-primary" to={user._id}>
                <FaEdit className="mx-auto" />
              </Link>
            </td>
            <td className="w-1/5 text-center">
              <PopupDelete id={user._id} handleDelete={handleDelete} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default UserListView;
