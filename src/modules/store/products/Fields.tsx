import React from "react";
import { Form, Input, InputNumber, Select, Card, Row, Col, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { deleteFile } from "../../../redux/actions/Apis";
import { getImageUrl } from "../../../utils/image";

interface FieldsProps {
  categories: any[];
}

const ProductFields: React.FC<FieldsProps> = ({ categories }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<any>();
  const dispatch = useDispatch();

  return (
    <div className="space-y-6">
      <Card title="معلومات المنتج الأساسية" className="premium-card">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="اسم المنتج (إنجليزي)"
              validateStatus={touched.productName && errors.productName ? "error" : ""}
              help={touched.productName && (errors.productName as string)}
              required
            >
              <Input
                name="productName"
                placeholder="Product Name (EN)"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.productName}
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="اسم المنتج (عربي)"
              validateStatus={touched.productNameAr && errors.productNameAr ? "error" : ""}
              help={touched.productNameAr && (errors.productNameAr as string)}
              required
            >
              <Input
                name="productNameAr"
                placeholder="اسم المنتج (عربي)"
                dir="rtl"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.productNameAr}
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="السعر"
              validateStatus={touched.price && errors.price ? "error" : ""}
              help={touched.price && (errors.price as string)}
              required
            >
              <InputNumber
                className="w-full bg-black border-none text-white h-11 flex items-center"
                placeholder="0.00"
                value={values.price}
                onChange={(val) => setFieldValue("price", val)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="الكمية في المخزن"
              validateStatus={touched.quantityInStock && errors.quantityInStock ? "error" : ""}
              help={touched.quantityInStock && (errors.quantityInStock as string)}
              required
            >
              <InputNumber
                className="w-full bg-black border-none text-white h-11 flex items-center"
                placeholder="0"
                value={values.quantityInStock}
                onChange={(val) => setFieldValue("quantityInStock", val)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="التصنيف"
          validateStatus={touched.categoryId && errors.categoryId ? "error" : ""}
          help={touched.categoryId && (errors.categoryId as string)}
          required
        >
          <Select
            className="premium-select h-11"
            placeholder="اختر التصنيف"
            value={values.categoryId}
            onChange={(val) => setFieldValue("categoryId", val)}
            onBlur={() => handleBlur({ target: { name: "categoryId" } })}
          >
            {categories.map((c: any) => (
              <Select.Option key={c.categoryId || c.id} value={c.categoryId || c.id}>
                {c.categoryName || c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Card>

      <Card title="الأوصاف" className="premium-card">
        <Form.Item
          label="الوصف (إنجليزي)"
          validateStatus={touched.description && errors.description ? "error" : ""}
          help={touched.description && (errors.description as string)}
        >
          <Input.TextArea
            name="description"
            rows={4}
            placeholder="Product Description (EN)"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
            className="bg-black border-none text-white"
          />
        </Form.Item>

        <Form.Item
          label="الوصف (عربي)"
          validateStatus={touched.descriptionAr && errors.descriptionAr ? "error" : ""}
          help={touched.descriptionAr && (errors.descriptionAr as string)}
        >
          <Input.TextArea
            name="descriptionAr"
            rows={4}
            dir="rtl"
            placeholder="وصف المنتج (عربي)"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.descriptionAr}
            className="bg-black border-none text-white"
          />
        </Form.Item>
      </Card>

      <Card title="صور المنتج" className="premium-card">
        <div className="flex flex-wrap gap-4 mb-4">
          {values.productImages?.map((img: any, index: number) => (
            <div key={img.imageId || index} className="relative group">
              <img 
                src={getImageUrl(img.imageUrl)} 
                alt={`Product ${index}`} 
                className="w-32 h-32 object-cover rounded-lg border border-gray-700" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <Button 
                  type="primary" 
                  danger 
                  shape="circle" 
                  icon={<DeleteOutlined />} 
                  size="small"
                  onClick={() => {
                    if (img.imageId) {
                      dispatch(deleteFile("Products", img.imageId, true, "image", (res: any) => {
                        if (res === 200) {
                          const newImages = [...values.productImages];
                          newImages.splice(index, 1);
                          setFieldValue("productImages", newImages);
                        }
                      }) as any);
                    } else {
                      const newImages = [...values.productImages];
                      newImages.splice(index, 1);
                      setFieldValue("productImages", newImages);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <Upload
          listType="picture"
          maxCount={5}
          multiple
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('يمكنك تحميل الصور فقط!');
              return Upload.LIST_IGNORE;
            }
            // We store the files in Formik to upload them during submission
            const currentFiles = values.tempImageFiles || [];
            setFieldValue("tempImageFiles", [...currentFiles, file]);
            return false; // Prevent auto upload
          }}
          onRemove={(file) => {
            const currentFiles = values.tempImageFiles || [];
            const newFiles = currentFiles.filter((f: any) => f.uid !== (file as any).uid);
            setFieldValue("tempImageFiles", newFiles);
          }}
        >
          <Button icon={<UploadOutlined />} className="bg-dark-700 border-none text-white h-11">
            اختر صور المنتج
          </Button>
        </Upload>
        <p className="text-gray-500 text-xs mt-2">يمكنك رفع حتى 5 صور بصيغة JPG, PNG</p>
      </Card>
    </div>
  );
};

export default ProductFields;
