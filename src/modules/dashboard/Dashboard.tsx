import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { Table, Tag } from "antd";
import { OrderStatusMap, OrderStatus } from "../../constants/OrderStatus";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { fetchCollection } from "../../redux/actions/Apis";
import { getImageUrl } from "../../utils/image";
import {
  ShoppingOutlined,
  AppstoreOutlined,
  DollarCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const dashboard = useSelector((state: RootState) => state.dashboard || { data: { summary: null, monthlySales: null, latestOrders: [] } });

  useEffect(() => {
    dispatch(fetchCollection("Dashboard") as any);
  }, [dispatch, user]);

  const summary = dashboard.data?.summary || {};
  const monthlySales = dashboard.data?.monthlySales || {};
  const latestOrders = dashboard.data?.latestOrders || [];
  const company = dashboard.data?.company || null;

  const stats = [
    { title: "إجمالي المنتجات", value: summary.totalProducts ?? 0, icon: <ShoppingOutlined />, color: "text-blue-500" },
    { title: "التصنيفات", value: summary.totalCategories ?? 0, icon: <AppstoreOutlined />, color: "text-purple-500" },
    { title: "إجمالي الطلبات", value: summary.totalOrders ?? 0, icon: <DollarCircleOutlined />, color: "text-green-500" },
    { title: "إجمالي المبيعات", value: typeof summary.totalSales === 'number' ? summary.totalSales.toFixed(2) : (summary.totalSales || "0.00"), icon: <DollarCircleOutlined />, color: "text-amber-500" },
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
      data: [
        monthlySales.jan || 0,
        monthlySales.feb || 0,
        monthlySales.mar || 0,
        monthlySales.apr || 0,
        monthlySales.may || 0,
        monthlySales.jun || 0,
        monthlySales.jul || 0,
        monthlySales.aug || 0,
        monthlySales.sep || 0,
        monthlySales.oct || 0,
        monthlySales.nov || 0,
        monthlySales.dece || 0,
      ],
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
    <div className="flex-1 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة التحكم في المتجر</h1>
          <p className="text-gray-400">نظرة عامة على أداء متجرك اليوم</p>
        </div>
      </div>

      {/* Company Info Banner */}
      {company && (
        <div className="premium-card p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 bg-gradient-to-r from-blue-900/10 via-transparent to-transparent">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
            {company.logo ? (
              <img 
                src={getImageUrl(company.logo)} 
                alt={company.companyNameAr || company.companyName} 
                className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg animate-fade-in"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border border-blue-500/30 shadow-lg">
                {(company.companyNameAr || company.companyName || "C").charAt(0)}
              </div>
            )}
            <div className="text-center md:text-right space-y-2 flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                <h2 className="text-2xl font-bold text-white">
                  {company.companyNameAr || company.companyName}
                </h2>
                {company.isActive && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    نشط
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                مرحباً بك مجدداً في لوحة التحكم الخاصة بشركتك. هنا يمكنك متابعة المبيعات، وإدارة طلبات العملاء وتتبع المؤشرات الرئيسية.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 pt-2 text-xs text-gray-500">
                {company.email && (
                  <span className="flex items-center gap-1.5">
                    <MailOutlined className="text-blue-400" />
                    {company.email}
                  </span>
                )}
                {company.phone && (
                  <span className="flex items-center gap-1.5">
                    <PhoneOutlined className="text-blue-400" />
                    {company.phone}
                  </span>
                )}
                {company.address && (
                  <span className="flex items-center gap-1.5">
                    <EnvironmentOutlined className="text-blue-400" />
                    {company.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
            dataSource={latestOrders.slice(0, 5)} 
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
