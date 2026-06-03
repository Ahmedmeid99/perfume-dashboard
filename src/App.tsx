import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./redux/store";
import { fetchCollection } from "./redux/actions/Apis";
import Login from "./modules/auth/Login";
import Dashboard from "./modules/dashboard/Dashboard";
import Products from "./modules/store/products";
import Categories from "./modules/store/categories";
import Orders from "./modules/store/orders";
import Users from "./modules/administration/users";
import Roles from "./modules/administration/roles";
import Permissions from "./modules/administration/permissions";
import Companies from "./modules/administration/companies";
import Reviews from "./modules/store/reviews";
import Gallery from "./modules/store/gallery";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { ConfigProvider, theme } from "antd";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fetch company info once when authenticated — makes logo/name available on all pages
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCollection("Dashboard") as any);
    }
  }, [accessToken, dispatch]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-dark-900 min-h-screen relative flex flex-col lg:flex-row-reverse">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <div className="p-3 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#3b82f6",
          borderRadius: 8,
          colorBgContainer: "#121212",
        },
      }}
    >
      <BrowserRouter>
        <ToastContainer theme="dark" position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products/*" element={<Products />} />
                  <Route path="/categories/*" element={<Categories />} />
                  <Route path="/orders/*" element={<Orders />} />
                  <Route path="/users/*" element={<Users userType="users" />} />
                  <Route path="/admins/*" element={<Users userType="admins" />} />
                  <Route path="/roles/*" element={<Roles />} />
                  <Route path="/permissions/*" element={<Permissions />} />
                  <Route path="/companies/*" element={<Companies />} />
                  <Route path="/reviews/*" element={<Reviews />} />
                  <Route path="/gallery/*" element={<Gallery />} />
                  {/* Add other protected routes here */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
