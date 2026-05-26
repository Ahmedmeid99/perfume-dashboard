import React from "react";
import { Route, Routes } from "react-router-dom";
import CategoryTable from "./Table";
import CategoryForm from "./Form";

const Categories: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CategoryTable />} />
      <Route path="new" element={<CategoryForm />} />
      <Route path=":id/edit" element={<CategoryForm />} />
    </Routes>
  );
};

export default Categories;
