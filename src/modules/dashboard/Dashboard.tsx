import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { Table, Tag } from "antd";
import { OrderStatusMap, OrderStatus } from "../../constants/OrderStatus";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { fetchCollection } from "../../redux/actions/Apis";
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  DollarCircleOutlined
} from "@ant-design/icons";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const products = useSelector((state: any) => state.products || { data: [] });
  const categories = useSelector((state: any) => state.categories || { data: [] });
  const orders = useSelector((state: any) => state.orders || { data: [] });

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchCollection(`Products/company/${user.companyId}`) as any);
      dispatch(fetchCollection(`ProductCategories/company/${user.companyId}`) as any);
      dispatch(fetchCollection(`Orders/company/${user.companyId}`) as any);
    }
  }, [dispatch, user]);

  const stats = [
    { title: "إجمالي المنتجات", value: products.data?.length || 0, icon: <ShoppingOutlined />, color: "text-blue-500" },
    { title: "التصنيفات", value: categories.data?.length || 0, icon: <AppstoreOutlined />, color: "text-purple-500" },
    { title: "إجمالي الطلبات", value: orders.data?.length || 0, icon: <DollarCircleOutlined />, color: "text-green-500" },
    { title: "إجمالي المبيعات", value: orders.data?.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0).toFixed(2) || "0.00", icon: <DollarCircleOutlined />, color: "text-amber-500" },
  ];

  const chartOptions: any = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3b82f6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#6b7280" } },
    },
    yaxis: {
      labels: { style: { colors: "#6b7280" } },
    },
    grid: {
      borderColor: "#1e293b",
      strokeDashArray: 4,
    },
    theme: { mode: "dark" },
  };

  const chartSeries = [
    {
      name: "المبيعات الشهرية",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 120, 140],
    },
  ];

  const columns = [
    { title: "رقم الطلب", dataIndex: "orderId", key: "orderId", render: (id: any) => `#${id}` },
    { title: "قيمة الطلب", dataIndex: "totalAmount", key: "totalAmount", render: (val: any) => `$${val}` },
    { title: "التاريخ", dataIndex: "orderDate", key: "orderDate" },
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
      },
    },
  ];

  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة التحكم في المتجر</h1>
          <p className="text-gray-400">نظرة عامة على أداء متجرك اليوم</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="premium-card p-6 flex flex-col items-center justify-center text-center">
            <span className="text-gray-400 text-sm mb-2">{stat.title}</span>
            <span className="text-3xl font-bold text-white">{stat.value}</span>
            <div className={`mt-2 p-2 rounded-full bg-dark-700 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">إحصائيات المبيعات</h3>
          <div className="flex gap-2">
            {["سنوي", "شهري", "أسبوعي"].map((btn) => (
              <button key={btn} className="px-4 py-1.5 rounded-lg text-sm bg-dark-700 text-gray-400 hover:text-white transition-colors">
                {btn}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[350px]">
          <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
        </div>
      </div>

      {/* Table Section */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-dark-600">
          <h3 className="text-xl font-bold text-white">آخر الطلبات</h3>
        </div>
        
        <div className="p-6">
          <Table 
            columns={columns} 
            dataSource={orders.data?.slice(0, 5) || []} 
            pagination={false}
            className="premium-table"
            rowKey="orderId"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
