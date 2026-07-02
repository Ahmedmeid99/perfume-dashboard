import React, { useEffect } from "react";
import { Descriptions, Table, Button, Tag, Card, Select } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResource, updateOrderStatus } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import { OrderStatusMap, OrderStatus } from "../../../constants/OrderStatus";

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { show: order } = useSelector((state: any) => state.orders || { show: null });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    if (id) {
      dispatch(fetchResource("Orders", id) as any);
    }
  }, [id, dispatch]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!order) return <div className="text-white">Order not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate("/orders")}
            className="text-gray-400 hover:text-white mb-2 no-print"
          >
            العودة للطلبات
          </Button>
          <h1 className="text-2xl lg:text-3xl font-bold text-white no-print">تفاصيل الطلب #{order.orderId}</h1>
        </div>
        <div className="flex items-center gap-3 no-print">
          <span className="text-gray-400 text-sm hidden md:inline">تحديث حالة الطلب:</span>
          <Select
            value={order.status}
            onChange={(newStatus) => dispatch(updateOrderStatus(order.orderId, newStatus) as any)}
            className="w-48 bg-dark-700 text-white border-none rounded-lg"
            popupClassName="bg-dark-800 text-white"
            options={Object.entries(OrderStatusMap).map(([value, config]) => ({
              value: Number(value),
              label: config.label,
            }))}
          />
          <Tag color={OrderStatusMap[order.status as OrderStatus]?.color || "default"} className="text-lg px-4 py-1 m-0 no-print">
            {OrderStatusMap[order.status as OrderStatus]?.label || `حالة #${order.status}`}
          </Tag>
        </div>
      </div>

      <Card className="premium-card">
        <Descriptions
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          className="premium-descriptions"
        >
          {/* <Descriptions.Item label="رقم العميل">
            {order.user?.userId}
          </Descriptions.Item> */}

          <Descriptions.Item label="رمز الطلب">
            {order.orderCode}
          </Descriptions.Item>

          <Descriptions.Item label="العميل">
            {order.user?.userName}
          </Descriptions.Item>

          <Descriptions.Item label="البريد الإلكتروني">
            {order.user?.email}
          </Descriptions.Item>

          <Descriptions.Item label="رقم الهاتف">
            {order.user?.phone}
          </Descriptions.Item>

          <Descriptions.Item label="العنوان">
            {order.user?.address}
          </Descriptions.Item>

          <Descriptions.Item label="التاريخ">
            {order.orderDate}
          </Descriptions.Item>

          <Descriptions.Item label="إجمالي المبلغ">
            <span className="text-primary font-bold">
              ${order.totalAmount}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="premium-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">منتجات الطلب</h3>
        <Table
          dataSource={order.orderItems}
          rowKey="orderItemId"
          pagination={false}
          className="premium-table"
          columns={[
            { title: "المنتج", dataIndex: "productName", key: "productName", className: "text-white" },
            { title: "الكمية", dataIndex: "quantity", key: "quantity" },
            { title: "سعر الوحدة", dataIndex: "price", key: "price", render: (p) => `$${p}` },
            { title: "الإجمالي", dataIndex: "totalPrice", key: "totalPrice", render: (p) => <span className="text-primary font-bold">${p}</span> },
          ]}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
