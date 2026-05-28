import React from "react";
import { Route, Routes } from "react-router-dom";
import UserTable from "./Table";
import UserForm from "./Form";

interface UsersProps {
  userType?: "users" | "admins";
}

const Users: React.FC<UsersProps> = ({ userType = "users" }) => {
  return (
    <Routes>
      <Route index element={<UserTable userType={userType} />} />
      <Route path="new" element={<UserForm userType={userType} />} />
      <Route path=":id/edit" element={<UserForm userType={userType} />} />
    </Routes>
  );
};

export default Users;
