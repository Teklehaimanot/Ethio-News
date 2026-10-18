import { FaRegUser, FaRegNewspaper } from "react-icons/fa";
import { FaUsersRays } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-1/5  bg-blue-dark">
      <ul className="space-y-6 py-5 px-2 w-2/3 m-5">
        <Link
          to="/"
          className="p-2 text-secondary border rounded text-center bg-primary  hover:bg-blue flex flex-row items-center space-x-3"
        >
          <FaRegUser />
          <h3> Dashboard </h3>
        </Link>

        <Link
          to="/user"
          className="p-2 text-secondary border rounded text-center bg-primary hover:bg-blue flex flex-row items-center space-x-3"
        >
          <FaRegUser />
          <h3> Users</h3>
        </Link>
        <Link
          to="/news"
          className="p-2 text-secondary border rounded text-center bg-primary hover:bg-blue flex flex-row items-center space-x-3"
        >
          <FaRegNewspaper />
          <h3> News</h3>
        </Link>
        <Link
          to="/about"
          className="p-2 text-secondary border rounded text-center bg-primary hover:bg-blue flex flex-row items-center space-x-3"
        >
          <FaUsersRays />
          <h3> About</h3>
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
