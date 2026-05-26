import React from "react";
import { Route, Routes } from "react-router-dom";
import PermissionTable from "./Table";
import PermissionForm from "./Form";

const Permissions: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PermissionTable />} />
      <Route path="new" element={<PermissionForm />} />
      <Route path=":id/edit" element={<PermissionForm />} />
    </Routes>
  );
};

export default Permissions;
