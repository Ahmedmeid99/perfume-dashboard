import React from "react";
import { Route, Routes } from "react-router-dom";
import Gallery from "./Gallery";

const GalleryModule: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Gallery />} />
    </Routes>
  );
};

export default GalleryModule;
