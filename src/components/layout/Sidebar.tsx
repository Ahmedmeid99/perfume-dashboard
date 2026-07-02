import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  CloseOutlined,
  UserOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  PictureOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/Auth";
import type { RootState } from "../../redux/store";
import { PERMISSIONS } from "../../constants/Permissions";
import logo from "../../assets/logo.jpeg";
import { getImageUrl } from "../../utils/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  permissionId?: number; // undefined = always visible (e.g. dashboard)
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, permissionIds } = useSelector((state: RootState) => state.auth);
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const company = dashboard?.data?.company;
  const handleLogout = () => {
    dispatch(logout());
  };

  /** Returns true when user holds the given permissionId (or item has no restriction) */
  const hasPermission = (permissionId?: number): boolean => {
    if (permissionId === undefined) return true;
    return Array.isArray(permissionIds) && permissionIds.includes(permissionId);
  };

  const companyLogo = company?.logo;
  const companyName = company?.companyNameAr || company?.companyName || user?.companyName || 'متجر سام';
  const companyDisplay = company?.companyName || user?.companyDisplay || 'SAM Perfume';

  const menuItems: MenuItem[] = [
    { title: "لوحة المعلومات", icon: <DashboardOutlined />, path: "/" },
    { title: "المنتجات", icon: <AppstoreOutlined />, path: "/products", permissionId: PERMISSIONS.ViewProductCatalogs },
    { title: "التصنيفات", icon: <AppstoreOutlined />, path: "/categories", permissionId: PERMISSIONS.ViewProductCategories },
    { title: "الطلبات", icon: <CarOutlined />, path: "/orders", permissionId: PERMISSIONS.ViewOrders },
    { title: "معرض الصور", icon: <PictureOutlined />, path: "/gallery", permissionId: PERMISSIONS.ViewGallery },
    { title: "المستخدمين", icon: <UserOutlined />, path: "/users", permissionId: PERMISSIONS.ViewUsers },
  ];

  const adminItems: MenuItem[] = [
    { title: "المدراء", icon: <UserOutlined />, path: "/admins", permissionId: PERMISSIONS.ViewCompanies },
    { title: "الشركات", icon: <ShopOutlined />, path: "/companies", permissionId: PERMISSIONS.ViewCompanies },
    { title: "الأدوار", icon: <SafetyCertificateOutlined />, path: "/roles", permissionId: PERMISSIONS.ViewRoles },
    { title: "الصلاحيات", icon: <LockOutlined />, path: "/permissions", permissionId: PERMISSIONS.ViewPermissions },
  ];

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.permissionId));
  const visibleAdminItems = adminItems.filter(item => hasPermission(item.permissionId));

  const renderLink = (item: MenuItem) => {
    const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-dark-700 hover:text-white"
          }`}
      >
        <span className="text-xl">{item.icon}</span>
        <span className="font-medium">{item.title}</span>
        {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />}
      </Link>
    );
  };

  return (
    <aside className={`w-64 h-screen bg-dark-800 border-l border-dark-600 flex flex-col fixed right-0 top-0 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
      <div className="p-6 flex items-center justify-between border-b border-dark-600">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-dark-700 flex-shrink-0">
            <img 
              // src="/assets/logo.jpeg" 
              // src={logo }
              src={getImageUrl(companyLogo) || logo}
              alt={companyName} 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-sm leading-tight truncate" title={companyName}>{companyName}</h2>
            <p className="text-gray-500 text-xs truncate" title={companyDisplay}>{companyDisplay}</p>
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
        {visibleMenuItems.map(renderLink)}

        {visibleAdminItems.length > 0 && (
          <>
            <div className="pt-4 pb-2 px-4">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider border-t border-dark-600/50 pt-4">الإدارة</p>
            </div>
            {visibleAdminItems.map(renderLink)}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-dark-600 space-y-2">
        <div className="mt-4 p-4 rounded-xl bg-dark-700/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
            {/* avatar placeholder */}
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
