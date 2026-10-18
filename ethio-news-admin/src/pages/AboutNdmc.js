import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCatagory } from "../state/catagory/catagorySlice";
import { Outlet } from "react-router-dom";

const AboutNdmc = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCatagory({ catagory: "About Ethio-News" }));
  }, [dispatch]);
  return (
    <div className=" w-4/5 bg-gray-light ">
      <Outlet />
    </div>
  );
};

export default AboutNdmc;
