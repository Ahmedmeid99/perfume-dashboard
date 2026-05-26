import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  CloseOutlined
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/Auth";
import type { RootState } from "../../redux/store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { title: "لوحة المعلومات", icon: <DashboardOutlined />, path: "/" },
    { title: "المنتجات", icon: <AppstoreOutlined />, path: "/products" },
    { title: "التصنيفات", icon: <AppstoreOutlined />, path: "/categories" },
    { title: "الطلبات", icon: <CarOutlined />, path: "/orders" },
    // { title: "التقييمات", icon: <StarOutlined />, path: "/reviews" },
  ];



  return (
    <aside className={`w-64 h-screen bg-dark-800 border-l border-dark-600 flex flex-col fixed right-0 top-0 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary">
            <img src={user?.companyLogo || 'https://via.placeholder.com/40'} alt="Company Logo" className="object-cover w-full h-full" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{user?.companyName || 'متجر سام'}</h2>
            <p className="text-gray-500 text-xs">{user?.companyDisplay || 'SAM Perfume'}</p>
          </div>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined className="text-gray-400" />}
          onClick={onClose}
          className="lg:hidden"
        />
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
              ? "bg-primary/10 text-primary"
              : "text-gray-400 hover:bg-dark-700 hover:text-white"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
            {location.pathname === item.path && (
              <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Link>
        ))}

        {/* <div className="pt-4 pb-2 px-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">الإدارة</p>
        </div> */}

        {/* {adminItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                ? "bg-primary/10 text-primary"
                : "text-gray-400 hover:bg-dark-700 hover:text-white"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
            {location.pathname === item.path && (
              <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Link>
        ))} */}
      </nav>

      <div className="p-4 border-t border-dark-600 space-y-2">
        <div className="mt-4 p-4 rounded-xl bg-dark-700/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || 'User'}`} alt="User" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.userName || 'مستخدم سام'}</p>
          </div>
          <LogoutOutlined
            className="text-gray-500 hover:text-red-400 cursor-pointer transition-colors"
            onClick={handleLogout}
            title="تسجيل الخروج"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
