import React from "react";
import { Button, Tooltip, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface DeleteBtnProps {
  onClick: () => void;
  title?: string;
  confirmTitle?: string;
}

const DeleteBtn: React.FC<DeleteBtnProps> = ({ onClick, title = "حذف", confirmTitle = "هل أنت متأكد من حذف هذا العنصر؟" }) => {
  return (
    <Tooltip title={title} color="#ef4444">
      <Popconfirm
        title={<span className="text-white">{confirmTitle}</span>}
        description={<span className="text-gray-400">لا يمكن التراجع عن هذه العملية.</span>}
        onConfirm={onClick}
        okText="نعم، احذف"
        cancelText="إلغاء"
        icon={<QuestionCircleOutlined style={{ color: '#ef4444' }} />}
        okButtonProps={{ danger: true, className: 'bg-red-500 hover:bg-red-600' }}
        cancelButtonProps={{ className: 'bg-dark-600 border-none text-white hover:text-primary' }}
      >
        <Button
          type="text"
          icon={<DeleteOutlined className="text-red-500 text-lg" />}
          className="bg-dark-700/50 hover:bg-red-500/10 flex items-center justify-center transition-all duration-300 rounded-lg h-9 w-9 border border-dark-600 hover:border-red-500/20"
        />
      </Popconfirm>
    </Tooltip>
  );
};

export default DeleteBtn;
