import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Input } from "antd";
import { EyeOutlined,  SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection, fetchSubCollection } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import { OrderStatusMap, OrderStatus } from "../../../constants/OrderStatus";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";

dayjs.extend(relativeTime);
dayjs.locale("ar");

interface TableProps {
  onView: (record: any) => void;
}

const OrderTable: React.FC<TableProps> = ({ onView }) => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.orders || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
      dispatch(fetchSubCollection(`Orders`, "Orders") as any);
      dispatch(fetchCollection("Users") as any);
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
    { title: "رقم الطلب", dataIndex: "orderCode", key: "orderCode", className: "text-white font-bold" },
    {
       title: "العميل",
    dataIndex: "user",
    key: "user",
    render: (user: any) => user?.userName ?? "-",
    },
    {
      title: "إجمالي المبلغ",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => <span className="text-primary font-semibold">${amount}</span>
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const statusConfig = OrderStatusMap[status as OrderStatus];
        return (
          <Tag color={statusConfig?.color || "default"}>
            {statusConfig?.label || `حالة #${status}`}
          </Tag>
        );
      }
    },
    { 
      title: "الوقت", 
      dataIndex: "orderDate", 
      key: "orderDate",
      render: (date: string) => dayjs(date).fromNow()
    },
    {
      title: "العمليات",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-400" />}
            onClick={() => onView(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-1 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">إدارة الطلبات</h1>
        <p className="text-gray-400 text-sm lg:text-base">عرض وتتبع طلبات العملاء</p>
      </div>

      <div className="premium-card p-3 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="بحث عن طلب..."
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
            <span className="hidden md:inline">إضافة طلب</span>
          </Button> */}
        </div>

        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="orderId"
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

export default OrderTable;
