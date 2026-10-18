import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward } from "react-icons/io";
import { logout } from "../state/auth/authSlice";
import axios from "axios";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { catagory } = useSelector((state) => state.catagory);
  const basicUrl = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await axios.get(`${basicUrl}/user/logout/${user.id}`);
    const { data } = response;
    if (data) {
      dispatch(logout());
      localStorage.removeItem("token");
    }
  };

  return (
    <div
      className="flex flex-row justify-between bg-primary text-secondary items-center border-b border-black shadow-md "
      style={{ height: "10vh" }}
    >
      <div className="mx-5 flex flex-row justify-between items-center space-x-1">
        <div>NDMC</div>
        <IoIosArrowForward />
        <div className="border px-2 py-1.5 bg-secondary text-blue border-1 rounded-md  ">
          {catagory}
        </div>
      </div>

      <div className="flex flex-row w-1/2 justify-end items-center space-x-8 mx-5">
        <div className="text-xl">{user.name}</div>
        <button
          className="border rounded p-1 hover:bg-blue"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default Header;
