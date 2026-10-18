import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const MainContainer = () => {
  return (
    <div className="flex flex-row " style={{ height: "90vh" }}>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default MainContainer;
