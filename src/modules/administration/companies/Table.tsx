import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCollection, deleteResource } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import EditBtn from "../../../components/ui/EditBtn";
import DeleteBtn from "../../../components/ui/DeleteBtn";

const CompanyTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state: any) => state.companies || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    dispatch(fetchCollection("Companies") as any);
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteResource("Companies", id) as any).then((success: boolean) => {
      if (success) dispatch(fetchCollection("Companies") as any);
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
    { title: "اسم الشركة", dataIndex: "companyName", key: "companyName", className: "text-white", ellipsis: true },
    { title: "الكود", dataIndex: "companyCode", key: "companyCode", ellipsis: true },
    { title: "البريد الإلكتروني", dataIndex: "email", key: "email", ellipsis: true },
    { title: "الهاتف", dataIndex: "phone", key: "phone" },
    { 
      title: "الحالة", 
      dataIndex: "isActive", 
      key: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "نشط" : "غير نشط"}
        </Tag>
      )
    },
    {
      title: "العمليات",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <EditBtn to={`${record.companyId}/edit`} />
          <DeleteBtn onClick={() => handleDelete(record.companyId)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">إدارة الشركات</h1>
        <p className="text-gray-400">إدارة بيانات الفروع والشركات التابعة</p>
      </div>

      <div className="premium-card p-3 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="ابحث عن شركة..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-dark-700 border-none rounded-lg pr-10 py-2 text-white w-full h-11"
            />
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => navigate("new")}
            className="bg-primary hover:bg-blue-600 h-11 px-4 md:px-6 rounded-lg"
          >
            <span className="hidden md:inline">إضافة شركة</span>
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="companyId"
          loading={loading}
          className="premium-table"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            placement: ["bottomCenter"]
          }}
        />
      </div>
    </div>
  );
};

export default CompanyTable;
