import React, { useEffect, useState } from "react";
import { Table, Rate, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import dayjs from "dayjs";

const ReviewTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.reviews || { data: [] });
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchCollection(`Reviews/company/${user.companyId}`) as any);
    }
  }, [dispatch, user]);

  const filterData = () => {
    if (!searchText) return data || [];
    return (data || []).filter((item: any) =>
      Object.values(item).some((val: any) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const columns = [
    { title: "Product", dataIndex: "productName", key: "productName", className: "text-white font-bold" },
    { title: "User", dataIndex: "userName", key: "userName" },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
    },
    { title: "Comment", dataIndex: "comment", key: "comment", width: '30%', ellipsis: true },
    {
      title: "Date",
      dataIndex: "reviewDate",
      key: "reviewDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD")
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-1 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">تقييمات المنتجات</h1>
        <p className="text-gray-400 text-sm lg:text-base">إدارة آراء وتقييمات العملاء</p>
      </div>

      <div className="premium-card p-3 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="بحث في التقييمات..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-dark-700 border-none rounded-lg pr-10 py-2 text-white w-full h-11"
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="reviewId"
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

export default ReviewTable;
