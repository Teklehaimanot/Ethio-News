import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCatagory } from "../state/catagory/catagorySlice";
import { Outlet } from "react-router-dom";

const News = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCatagory({ catagory: "News and Events" }));
  }, [dispatch]);
  return (
    <div className=" w-4/5 bg-gray-light ">
      <Outlet />
    </div>
  );
};

export default News;
