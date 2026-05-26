import React from "react";
import { Route, Routes } from "react-router-dom";
import ProductTable from "./Table";
import ProductForm from "./Form";

const Products: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProductTable />} />
      <Route path="new" element={<ProductForm />} />
      <Route path=":id/edit" element={<ProductForm />} />
    </Routes>
  );
};

export default Products;
