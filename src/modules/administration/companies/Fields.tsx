import React from "react";
import { Form, Input, Card, Row, Col, Switch, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteFile } from "../../../redux/actions/Apis";
import { getImageUrl } from "../../../utils/image";
import { useFormikContext } from "formik";

const CompanyFields: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<any>();
  const dispatch = useDispatch();

  return (
    <div className="space-y-6">
      <Card title="بيانات الشركة" className="premium-card">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="اسم الشركة (EN)"
              validateStatus={touched.companyName && errors.companyName ? "error" : ""}
              help={touched.companyName && (errors.companyName as string)}
              required
            >
              <Input
                name="companyName"
                value={values.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Company Name"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="اسم الشركة (AR)"
              validateStatus={touched.companyNameAr && errors.companyNameAr ? "error" : ""}
              help={touched.companyNameAr && (errors.companyNameAr as string)}
              required
            >
              <Input
                name="companyNameAr"
                value={values.companyNameAr}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="اسم الشركة بالعربي"
                className="bg-black border-none text-white h-11 text-right"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="البريد الإلكتروني"
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && (errors.email as string)}
            >
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="email@company.com"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="رقم الهاتف"
              validateStatus={touched.phone && errors.phone ? "error" : ""}
              help={touched.phone && (errors.phone as string)}
            >
              <Input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="رقم الهاتف"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="العنوان"
          validateStatus={touched.address && errors.address ? "error" : ""}
          help={touched.address && (errors.address as string)}
        >
          <Input
            name="address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="العنوان"
            className="bg-black border-none text-white h-11"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="خط العرض (Latitude)"
              validateStatus={touched.latitude && errors.latitude ? "error" : ""}
              help={touched.latitude && (errors.latitude as string)}
            >
              <Input
                type="number"
                name="latitude"
                value={values.latitude}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.0000"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="خط الطول (Longitude)"
              validateStatus={touched.longitude && errors.longitude ? "error" : ""}
              help={touched.longitude && (errors.longitude as string)}
            >
              <Input
                type="number"
                name="longitude"
                value={values.longitude}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.0000"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="نشط">
          <Switch
            checked={values.isActive}
            onChange={(checked) => setFieldValue("isActive", checked)}
          />
        </Form.Item>
      </Card>

      <Card title="شعار الشركة" className="premium-card">
        {values.logo && (
          <div className="relative group w-32 h-32 mb-4">
            <img 
              src={getImageUrl(values.logo)} 
              alt="Logo" 
              className="w-full h-full object-cover rounded-lg border border-gray-700" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Button 
                type="primary" 
                danger 
                shape="circle" 
                icon={<DeleteOutlined />} 
                size="small"
                onClick={() => {
                  if (values.companyId) {
                    dispatch(deleteFile("Companies", values.companyId, false, "logo", (res: any) => {
                      if (res === 200) {
                        setFieldValue("logo", null);
                      }
                    }) as any);
                  } else {
                    setFieldValue("logo", null);
                  }
                }}
              />
            </div>
          </div>
        )}

        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('يمكنك تحميل الصور فقط!');
              return Upload.LIST_IGNORE;
            }
            setFieldValue("tempLogoFile", file);
            return false;
          }}
          onRemove={() => {
            setFieldValue("tempLogoFile", null);
          }}
        >
          {!values.logo && (
            <Button icon={<UploadOutlined />} className="bg-dark-700 border-none text-white h-11">
              اختر شعار الشركة
            </Button>
          )}
        </Upload>
      </Card>
    </div>
  );
};

export default CompanyFields;
