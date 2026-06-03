import React from "react";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { deleteFile } from "../../../redux/actions/Apis";
import { getImageUrl } from "../../../utils/image";
import { Form, Input, Card, Row, Col, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryFields: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<any>();
  const dispatch = useDispatch();

  return (
    <div className="space-y-6">
      <Card title="بيانات التصنيف" className="premium-card">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="اسم التصنيف (EN)"
              validateStatus={touched.categoryName && errors.categoryName ? "error" : ""}
              help={touched.categoryName && (errors.categoryName as string)}
              required
            >
              <Input
                name="categoryName"
                value={values.categoryName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Category Name"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="اسم التصنيف (AR)"
              validateStatus={touched.categoryNameAr && errors.categoryNameAr ? "error" : ""}
              help={touched.categoryNameAr && (errors.categoryNameAr as string)}
            >
              <Input
                name="categoryNameAr"
                value={values.categoryNameAr}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="اسم التصنيف بالعربي"
                className="bg-black border-none text-white h-11 text-right"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="صور التصنيف" className="premium-card">
        <div className="flex flex-wrap gap-4 mb-4">
          {values.categoryImages?.map((img: any, index: number) => (
            <div key={img.imageId || index} className="relative group">
              <img 
                src={getImageUrl(img.imageUrl)} 
                alt={`Category ${index}`} 
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
                      dispatch(deleteFile("ProductCategories", img.imageId, false, "image", (res: any) => {
                        if (res === 200) {
                          const newImages = [...values.categoryImages];
                          newImages.splice(index, 1);
                          setFieldValue("categoryImages", newImages);
                        }
                      }) as any);
                    } else {
                      const newImages = [...values.categoryImages];
                      newImages.splice(index, 1);
                      setFieldValue("categoryImages", newImages);
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
            const currentFiles = values.tempImageFiles || [];
            setFieldValue("tempImageFiles", [...currentFiles, file]);
            return false;
          }}
          onRemove={(file) => {
            const currentFiles = values.tempImageFiles || [];
            const newFiles = currentFiles.filter((f: any) => f.uid !== (file as any).uid);
            setFieldValue("tempImageFiles", newFiles);
          }}
        >
          <Button icon={<UploadOutlined />} className="bg-dark-700 border-none text-white h-11">
            اختر صور التصنيف
          </Button>
        </Upload>
        <p className="text-gray-500 text-xs mt-2">يمكنك رفع حتى 5 صور بصيغة JPG, PNG</p>
      </Card>
    </div>
  );
};

export default CategoryFields;
