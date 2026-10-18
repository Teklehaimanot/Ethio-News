import React from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetAboutNdmcQuery } from "../../services";
import Loading from "../Loading";

const About = () => {
  const { data, error, isLoading } = useGetAboutNdmcQuery();

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

  return (
    <div className="overflow-y-scroll " style={{ height: "95%" }}>
      <div className="flex flex-row items-center justify-between border-b border-secondary">
        <div className="m-8 w-1/3 text-blue text-xl bg-secondary p-3 rounded shadow-md ">
          National Data Analytics and Management Center(NDMC)
        </div>
        <Link
          to="update"
          className="border-1 p-2 rounded-md bg-secondary hover:bg-primary hover:text-secondary m-8 flex flex-row justify-between items-center space-x-2 shadow"
        >
          <FaEdit />
          <button>Update</button>
        </Link>
      </div>
      {isLoading && (
        <div className="w-1/2 mx-auto text-center mt-5">
          <Loading />
        </div>
      )}

      {data && (
        <div className="flex flex-col justify-between space-y-6 mt-5 mx-5">
          <div className="flex flex-col border-1 shadow-md p-5 rounded bg-secondary">
            <div className="text-blue text-xl">Director Statement</div>
            <div className=" flex flex-row justify-between mx-10 space-x-10">
              <div>
                <h3 className="text-primary">Title:</h3>
                <p>{data.directorStatement.title}</p>
              </div>
              <div>
                <h3 className="text-primary">Description:</h3>
                <p>{data.directorStatement.description}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-1 shadow-md p-5 rounded bg-secondary">
            <div className="text-blue text-xl">NDMC Strategies</div>
            <div className=" flex flex-row justify-between mx-10 space-x-10">
              <div>
                <h3 className="text-primary">Title:</h3>
                <p>{data.strategies.title}</p>
              </div>
              <div>
                <h3 className="text-primary">Description:</h3>
                <p>{data.strategies.description}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-1 shadow-md p-5 rounded bg-secondary">
            <div className="text-blue text-xl">About Us</div>
            <div className=" flex flex-row justify-between mx-10 space-x-10">
              <p>{data.aboutUs}</p>
            </div>
          </div>
          <div className="flex flex-col border-1 shadow-md p-5 rounded bg-secondary">
            <div className="text-blue text-xl">Vision</div>
            <div className=" flex flex-row justify-between mx-10 space-x-10">
              <p>{data.vision}</p>
            </div>
          </div>
          <div className="flex flex-col border-1 shadow-md p-5 rounded bg-secondary">
            <div className="text-blue text-xl">Mission</div>
            <div className=" flex flex-row justify-between mx-10 space-x-10">
              <p>{data.mission}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
