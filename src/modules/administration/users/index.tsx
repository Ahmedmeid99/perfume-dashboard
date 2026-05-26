import React from "react";
import { Route, Routes } from "react-router-dom";
import UserTable from "./Table";
import UserForm from "./Form";

const Users: React.FC = () => {
  return (
    <Routes>
      <Route index element={<UserTable />} />
      <Route path="new" element={<UserForm />} />
      <Route path=":id/edit" element={<UserForm />} />
    </Routes>
  );
};

export default Users;
