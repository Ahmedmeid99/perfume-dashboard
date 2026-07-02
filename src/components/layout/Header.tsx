import React from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { getImageUrl } from "../../utils/image";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const company = dashboard?.data?.company;

  const companyLogo = company?.logo ;
  const companyName = company?.companyNameAr || company?.companyName || "متجر";
  const initial = companyName.charAt(0);

  return (
    <header className="lg:hidden h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded overflow-hidden flex items-center justify-center text-white font-bold">
          {companyLogo ? (
            <img src={getImageUrl(companyLogo)} alt={companyName} className="w-full h-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <span className="text-white font-bold">{companyName}</span>
      </div>
      <Button 
        type="text" 
        icon={<MenuOutlined className="text-white text-xl" />} 
        onClick={onMenuClick}
      />
    </header>
  );
};

export default Header;
