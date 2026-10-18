import { useState } from "react";
import { FaRegAddressCard } from "react-icons/fa";
import { Link } from "react-router-dom";

const SearchBar = ({ handleSearch }) => {
  const [search, setSearch] = useState("");

  const onChange = (e) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <div className="flex flex-row items-center justify-between border-b border-secondary">
      <div className="m-8 w-1/3 ">
        <form className="flex flex-row justify-between">
          <input
            className="p-2 rounded-md w-3/4 shadow"
            type="text"
            value={search}
            onChange={onChange}
            placeholder="Type here to search"
          />
        </form>
      </div>
      <Link
        to="register"
        className="border-1 p-2 rounded-md bg-secondary hover:bg-primary hover:text-secondary m-8 flex flex-row justify-between items-center space-x-2 shadow"
      >
        <FaRegAddressCard />
        <button>New</button>
      </Link>
    </div>
  );
};

export default SearchBar;
