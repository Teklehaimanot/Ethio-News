import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
const AuthLayout = () => {
  return (
    <div className="flex flex-row  h-screen sm:py-4 lg:py-11 lg:px-8 sm:px-2">
      <div
        style={{
          backgroundImage: `url(${logo})`,
        }}
        className="flex-1 h-full my-auto bg-no-repeat bg-center bg-contain border rounded border-primary bg-primary shadow-lg"
      ></div>
      <div className="flex flex-col flex-1 h-full  justify-between">
        <div className="text-2xl pl-8 py-4 rounded mx-24 bg-primary text-secondary border-collapse w-36">
          NDMC
        </div>
        <Outlet />
        <div className="text-base text-gray  flex flex-row w-1/2 justify-between mx-auto ">
          <p>@2023 NDMC</p>
          <div className="text-blue space-x-2">
            <span>Privacy</span>
            <span className="bg-gray text-gray border-l-2 h-3"></span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
