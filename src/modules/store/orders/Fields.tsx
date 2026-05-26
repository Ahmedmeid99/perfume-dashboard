import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, InputNumber, Button, Card, Row, Col, Table } from "antd";
import { PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { fetchCollection } from "../../../redux/actions/Apis";

const OrderFields: React.FC = () => {
  const { values, touched, errors, setFieldValue } = useFormikContext<any>();
  const dispatch = useDispatch();

  const { data: users } = useSelector((state: any) => state.users || { data: [] });
  const { data: products } = useSelector((state: any) => state.products || { data: [] });

  useEffect(() => {
    dispatch(fetchCollection("Users") as any);
    dispatch(fetchCollection("Products") as any);
  }, [dispatch]);

  const handleAddItem = () => {
    const newItems = [...values.items, { productId: undefined, quantity: 1, price: 0, stock: 0 }];
    setFieldValue("items", newItems);
  };

  const handleProductChange = (index: number, productId: number) => {
    const selectedProd = products?.find((p: any) => p.productId === productId);
    if (!selectedProd) return;

    const newItems = [...values.items];
    newItems[index] = {
      ...newItems[index],
      productId,
      price: selectedProd.price,
      stock: selectedProd.quantityInStock,
      quantity: 1,
    };
    setFieldValue("items", newItems);
  };

  const handleQuantityChange = (index: number, quantity: number | null) => {
    if (quantity === null || quantity < 1) return;
    const newItems = [...values.items];
    newItems[index] = {
      ...newItems[index],
      quantity,
    };
    setFieldValue("items", newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = values.items.filter((_: any, i: number) => i !== index);
    setFieldValue("items", newItems);
  };

  // Calculate Order Total
  const totalAmount = values.items.reduce((sum: number, item: any) => {
    return sum + (item.price || 0) * (item.quantity || 0);
  }, 0);

  const columns = [
    {
      title: "المنتج",
      key: "productId",
      render: (_: any, record: any, index: number) => (
        <Select
          showSearch
          placeholder="اختر منتجاً..."
          className="w-full bg-black border-none text-white rounded-lg"
          popupClassName="bg-dark-800 text-white"
          value={record.productId}
          onChange={(val) => handleProductChange(index, val)}
          filterOption={(input, option) =>
            String(option?.label ?? "").toLowerCase().includes(String(input).toLowerCase())
          }
          options={products?.map((p: any) => ({
            value: p.productId,
            label: `${p.productName} (${p.productNameAr || ""}) - $${p.price}`,
            disabled: values.items.some((item: any) => item.productId === p.productId)
          }))}
        />
      ),
    },
    {
      title: "سعر الوحدة",
      key: "price",
      render: (_: any, record: any) => (
        <span className="text-primary font-bold">${record.price || 0}</span>
      ),
    },
    {
      title: "المخزون المتاح",
      key: "stock",
      render: (_: any, record: any) => (
        <span className={record.stock > 0 ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
          {record.stock || 0}
        </span>
      ),
    },
    {
      title: "الكمية",
      key: "quantity",
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={1}
          max={record.stock || 1}
          value={record.quantity}
          onChange={(val) => handleQuantityChange(index, val)}
          disabled={!record.productId}
          className="bg-black border-none text-white rounded-lg w-24"
        />
      ),
    },
    {
      title: "الإجمالي",
      key: "subtotal",
      render: (_: any, record: any) => (
        <span className="text-primary font-bold">${(record.price || 0) * (record.quantity || 0)}</span>
      ),
    },
    {
      title: "إجراء",
      key: "action",
      render: (_: any, __: any, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(index)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col span={24} lg={16} className="space-y-6">
          <Card title="بيانات العميل" className="premium-card">
            <Form.Item
              label="اختر العميل"
              validateStatus={touched.userId && errors.userId ? "error" : ""}
              help={touched.userId && (errors.userId as string)}
              required
            >
              <Select
                showSearch
                placeholder="ابحث عن العميل..."
                className="w-full bg-black border-none text-white rounded-lg h-11"
                popupClassName="bg-dark-800 text-white"
                value={values.userId}
                onChange={(val) => setFieldValue("userId", val)}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(String(input).toLowerCase())
                }
                options={users?.map((u: any) => ({
                  value: u.userId,
                  label: `${u.userName} (${u.email})`,
                }))}
              />
            </Form.Item>
          </Card>

          <Card
            title={
              <div className="flex justify-between items-center w-full">
                <span>المنتجات المطلوبة</span>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddItem}
                  className="border-dashed border-primary text-primary hover:text-blue-400"
                >
                  إضافة منتج للطلب
                </Button>
              </div>
            }
            className="premium-card"
          >
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={values.items || []}
                rowKey={(_, idx) => idx?.toString() || ""}
                pagination={false}
                locale={{ emptyText: "لم يتم إضافة منتجات بعد. انقر فوق زر إضافة منتج للبدء." }}
                className="premium-table"
              />
            </div>
            {touched.items && errors.items && typeof errors.items === "string" && (
              <div className="text-red-500 text-sm mt-2">{errors.items}</div>
            )}
          </Card>
        </Col>

        <Col span={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <ShoppingCartOutlined className="text-primary text-xl" />
                <span>ملخص الطلب</span>
              </div>
            }
            className="premium-card h-full"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">إجمالي المنتجات:</span>
                <span className="text-white font-bold text-lg">
                  {values.items?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">عدد الأصناف الفريدة:</span>
                <span className="text-white font-bold text-lg">
                  {values.items?.filter((item: any) => item.productId).length || 0}
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-dark-800/50 rounded-xl px-4 border border-gray-800">
                <span className="text-gray-300 font-semibold">إجمالي المبلغ:</span>
                <span className="text-primary font-black text-2xl">${totalAmount}</span>
              </div>

              <div className="text-xs text-gray-500 text-center leading-relaxed">
                سيتم تحديث كميات مخزون المنتجات تلقائيًا بمجرد إتمام الطلب بنجاح.
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderFields;
