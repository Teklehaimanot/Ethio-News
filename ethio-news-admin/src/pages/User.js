import { useDispatch } from "react-redux";
import { setCatagory } from "../state/catagory/catagorySlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const User = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCatagory({ catagory: "User Management" }));
  }, [dispatch]);
  return (
    <div className=" w-4/5 bg-gray-light ">
      <Outlet />
    </div>
  );
};

export default User;
