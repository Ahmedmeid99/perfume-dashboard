import React, { useEffect, useState } from "react";
import { Table, Space, Input } from "antd";
import {  SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import EditBtn from "../../../components/ui/EditBtn";

const PermissionTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.permissions || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    dispatch(fetchCollection("Permissions?pageSize=100") as any);
  }, [dispatch]);

  const filterData = () => {
    if (!searchText) return data || [];
    return (data || []).filter((item: any) =>
      Object.values(item).some((val: any) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const columns = [
    { title: "اسم الصلاحية", dataIndex: "displayName", key: "displayName", className: "text-white", ellipsis: true },
    { title: "الوصف", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "العمليات",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <EditBtn to={`${record.permissionId}/edit`} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-1 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">إدارة الصلاحيات</h1>
        <p className="text-gray-400 text-sm lg:text-base">استعراض كافة صلاحيات النظام</p>
      </div>

      <div className="premium-card p-3 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="بحث عن صلاحية..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-dark-700 border-none rounded-lg pr-10 py-2 text-white w-full h-11"
            />
          </div>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate("new")}
            className="bg-primary hover:bg-blue-600 h-11 px-4 md:px-6 rounded-lg"
          >
            <span className="hidden md:inline">إضافة صلاحية</span>
          </Button> */}
        </div>

        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="permissionId"
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

export default PermissionTable;
