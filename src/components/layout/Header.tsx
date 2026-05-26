import React from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="text-white font-bold">متجر سام</span>
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
