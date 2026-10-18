import React, { useState } from "react";
import SearchBar from "../SearchBar";
import UserListView from "./UserListView";

const UserManagement = () => {
  const [pagination, setPagination] = useState(1);

  const [page, setPage] = useState(1);

  const [searchName, setSearchName] = useState("");

  return (
    <>
      <div className="overflow-y-scroll" style={{ height: "90%" }}>
        <SearchBar handleSearch={setSearchName} />
        <UserListView
          page={page}
          handlePagination={setPagination}
          searchName={searchName}
        />
      </div>
      <div className="bg-primary" style={{ height: "10%" }}>
        <div className="flex justify-center items-center space-x-2 w-1/3 m-auto h-full ">
          <button
            className="border px-4 py-2 text-secondary hover:bg-blue-dark "
            onClick={() => setPage(pagination.prevPage)}
            disabled={pagination.prevPage === null}
          >
            previous
          </button>
          <button className="px-4 py-2 rounded border bg-gray">
            {pagination.currentPage}
          </button>
          <button
            className="border px-4 py-2 text-secondary hover:bg-blue-dark"
            onClick={() => setPage(pagination.nextPage)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
