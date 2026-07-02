import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCollection, deleteResource } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import EditBtn from "../../../components/ui/EditBtn";
import DeleteBtn from "../../../components/ui/DeleteBtn";
import { getImageUrl } from "../../../utils/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";

dayjs.extend(relativeTime);
dayjs.locale("ar");

const CategoryTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state: any) => state.categories || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    dispatch(fetchCollection("ProductCategories") as any);
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteResource("ProductCategories", id) as any).then((success: boolean) => {
      if (success) dispatch(fetchCollection("ProductCategories") as any);
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
    {
      title: "الصورة",
      dataIndex: "categoryImages",
      key: "image",
      render: (images: any[]) => (
        images && images.length > 0 ? (
          <img 
            src={getImageUrl(images[0].imageUrl)} 
            alt="category" 
            className="w-12 h-12 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )
      )
    },
    { title: "اسم التصنيف (EN)", dataIndex: "categoryName", key: "categoryName", className: "text-white" },
    { title: "اسم التصنيف (AR)", dataIndex: "categoryNameAr", key: "categoryNameAr", className: "text-white text-right" },
    {
      title: "العمليات",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <EditBtn to={`${record.categoryId}/edit`} />
          <DeleteBtn onClick={() => handleDelete(record.categoryId)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-1 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">تصنيفات المنتجات</h1>
        <p className="text-gray-400 text-sm lg:text-base">إدارة أقسام وتصنيفات المنتجات في المتجر</p>
      </div>

      <div className="premium-card p-3 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="ابحث عن تصنيف..." 
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
            <span className="hidden md:inline">إضافة تصنيف</span>
          </Button>
        </div>

        <Table 
          columns={columns}
          dataSource={filterData()} 
          rowKey="categoryId"
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

export default CategoryTable;
