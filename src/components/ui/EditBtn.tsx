import React from "react";
import { Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface EditBtnProps {
  to?: string;
  onClick?: () => void;
  title?: string;
}

const EditBtn: React.FC<EditBtnProps> = ({ to, onClick, title = "تعديل" }) => {
  const btn = (
    <Button
      type="text"
      icon={<EditOutlined className="text-amber-400 text-lg" />}
      onClick={onClick}
      className="bg-dark-700/50 hover:bg-amber-400/10 flex items-center justify-center transition-all duration-300 rounded-lg h-9 w-9 border border-dark-600 hover:border-amber-400/20"
    />
  );

  return (
    <Tooltip title={title} color="#f59e0b">
      {to ? <Link to={to}>{btn}</Link> : btn}
    </Tooltip>
  );
};

export default EditBtn;
