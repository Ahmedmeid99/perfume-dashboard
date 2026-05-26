import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import OrderTable from "./Table";
import OrderDetails from "./Details";
import OrderForm from "./Form";

const Orders: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route index element={<OrderTable onView={(record) => navigate(`${record.orderId}`)} />} />
      <Route path="new" element={<OrderForm />} />
      <Route path=":id" element={<OrderDetails />} />
    </Routes>
  );
};

export default Orders;
