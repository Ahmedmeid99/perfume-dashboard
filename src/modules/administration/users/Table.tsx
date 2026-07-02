import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Input } from "antd";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteResource, fetchSubCollection } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import EditBtn from "../../../components/ui/EditBtn";
import DeleteBtn from "../../../components/ui/DeleteBtn";

interface TableProps {
  userType?: "users" | "admins";
}

const UserTable: React.FC<TableProps> = ({ userType = "users" }) => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state: any) => state.users || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    if (userType === "admins") {
      dispatch(fetchSubCollection("Users/admins", "Users") as any);
    } else {
      dispatch(fetchSubCollection("Users/users", "Users") as any);
    }
  }, [dispatch, userType]);

  const handleDelete = (id: number) => {
    dispatch(deleteResource("Users", id) as any).then((success: boolean) => {
      if (success) {
        if (userType === "admins") {
          dispatch(fetchSubCollection("Users/admins", "Users") as any);
        } else {
          dispatch(fetchSubCollection("Users/users", "Users") as any);
        }
      }
    });
  };

  const filterData = () => {
    if (!searchText) return data || [];
    return (data || []).filter((item: any) =>
      Object.values(item).some((val: any) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const columns = [
    { title: "اسم المستخدم", dataIndex: "userName", key: "userName", className: "text-white", ellipsis: true },
    { title: "البريد الإلكتروني", dataIndex: "email", key: "email", ellipsis: true },
    { title: "الهاتف", dataIndex: "phone", key: "phone" },
    {
      title: "الدور",
      dataIndex: "roleName",
      key: "roleName",
      render: (role: string) => <Tag color="blue">{role}</Tag>
    },
    {
      title: "الإجراءات",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <EditBtn to={`${record.userId}/edit`} />
          <DeleteBtn onClick={() => handleDelete(record.userId)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-1 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          {userType === "admins" ? "إدارة المدراء" : "إدارة المستخدمين"}
        </h1>
        <p className="text-gray-400 text-sm lg:text-base">
          {userType === "admins" ? "التحكم في وصول المدراء للنظام" : "التحكم في وصول المستخدمين والأدوار"}
        </p>
      </div>

      <div className="premium-card p-3 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={userType === "admins" ? "ابحث عن مدير..." : "ابحث عن مستخدم..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-dark-700 border-none rounded-lg pr-10 py-2 text-white w-full h-11 focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={() => navigate("new")}
            className="bg-primary hover:bg-blue-600 h-11 px-4 md:px-6 rounded-lg"
          >
            <span className="hidden md:inline">
              {userType === "admins" ? "إضافة مدير" : "إضافة مستخدم"}
            </span>
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="userId"
          loading={loading}
          className="premium-table"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            placement: ["bottomCenter"]
          }}
        />
      </div>
    </div>
  );
};

export default UserTable;
