import React from "react";
import { Form, Input, Card } from "antd";
import { useFormikContext } from "formik";

const PermissionFields: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<any>();

  return (
    <div className="space-y-6">
      <Card title="بيانات الصلاحية" className="premium-card">
        <Form.Item
          label="اسم الصلاحية"
          validateStatus={touched.displayName && errors.displayName ? "error" : ""}
          help={touched.displayName && (errors.displayName as string)}
          required
        >
          <Input
            name="displayName"
            value={values.displayName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="اسم الصلاحية"
            className="bg-black border-none text-white h-11"
          />
        </Form.Item>

        <Form.Item
          label="الوصف"
          validateStatus={touched.description && errors.description ? "error" : ""}
          help={touched.description && (errors.description as string)}
        >
          <Input.TextArea
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="وصف الصلاحية"
            rows={4}
            className="bg-black border-none text-white"
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default PermissionFields;
