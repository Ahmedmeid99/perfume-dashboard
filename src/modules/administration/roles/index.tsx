import React from "react";
import { Route, Routes } from "react-router-dom";
import RoleTable from "./Table";
import RoleForm from "./Form";

const Roles: React.FC = () => {
  return (
    <Routes>
      <Route index element={<RoleTable />} />
      <Route path="new" element={<RoleForm />} />
      <Route path=":id/edit" element={<RoleForm />} />
    </Routes>
  );
};

export default Roles;
