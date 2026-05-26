import React from "react";
import { Route, Routes } from "react-router-dom";
import CompanyTable from "./Table";
import CompanyForm from "./Form";

const Companies: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CompanyTable />} />
      <Route path="new" element={<CompanyForm />} />
      <Route path=":id/edit" element={<CompanyForm />} />
    </Routes>
  );
};

export default Companies;
