import React from "react";
import { Form, Input, Card, Row, Col, Select, DatePicker } from "antd";
import { useFormikContext } from "formik";

interface FieldsProps {
  roles: any[];
  companies: any[];
  isEdit?: boolean;
  userType?: "users" | "admins";
}

const UserFields: React.FC<FieldsProps> = ({ roles, companies, isEdit, userType = "users" }) => {
  const { values, errors, touched, setFieldValue, handleBlur, handleChange } = useFormikContext<any>();

  // Filter roles based on userType if provided
  const filteredRoles = React.useMemo(() => {
    if (userType === "admins") {
      return roles.filter(r => r.roleId === 7);
    } else if (userType === "users") {
      return roles.filter(r => r.roleId === 1);
    }
    return roles;
  }, [roles, userType]);

  return (
    <div className="space-y-6">
      <Card title="معلومات تسجيل الدخول" className="premium-card">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="البريد الإلكتروني"
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && (errors.email as string)}
              required
            >
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="email@example.com"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="كلمة المرور"
              validateStatus={touched.password && errors.password ? "error" : ""}
              help={touched.password && (errors.password as string)}
              required={!isEdit}
            >
              <Input.Password
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="******"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
        </Row>
        
        {values.password && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="تأكيد كلمة المرور"
                validateStatus={touched.confirmPassword && errors.confirmPassword ? "error" : ""}
                help={touched.confirmPassword && (errors.confirmPassword as string)}
                required
              >
                <Input.Password
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="******"
                  className="bg-black border-none text-white h-11"
                />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Card>

      <Card title="المعلومات الشخصية" className="premium-card">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="اسم المستخدم"
              validateStatus={touched.userName && errors.userName ? "error" : ""}
              help={touched.userName && (errors.userName as string)}
              required
            >
              <Input
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="أدخل اسم المستخدم"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="الهاتف"
              validateStatus={touched.phone && errors.phone ? "error" : ""}
              help={touched.phone && (errors.phone as string)}
              required
            >
              <Input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="أدخل رقم الهاتف"
                className="bg-black border-none text-white h-11"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="العنوان"
          validateStatus={touched.address && errors.address ? "error" : ""}
          help={touched.address && (errors.address as string)}
          required
        >
          <Input
            name="address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="أدخل العنوان"
            className="bg-black border-none text-white h-11"
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="تاريخ الميلاد"
              validateStatus={touched.dateOfBirth && errors.dateOfBirth ? "error" : ""}
              help={touched.dateOfBirth && (errors.dateOfBirth as string)}
            >
              <DatePicker
                className="w-full bg-black border-none text-white h-11"
                value={values.dateOfBirth}
                onChange={(date) => setFieldValue("dateOfBirth", date)}
                onBlur={() => handleBlur({ target: { name: "dateOfBirth" } })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="الدور"
              validateStatus={touched.roleId && errors.roleId ? "error" : ""}
              help={touched.roleId && (errors.roleId as string)}
              required
            >
              <Select
                placeholder="اختر الدور"
                className="premium-select h-11"
                value={values.roleId}
                onChange={(value) => setFieldValue("roleId", value)}
                onBlur={() => handleBlur({ target: { name: "roleId" } })}
                disabled={!!userType}
              >
                {filteredRoles.map(r => (
                  <Select.Option key={r.roleId} value={r.roleId}>{r.roleName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="الشركة"
              validateStatus={touched.companyId && errors.companyId ? "error" : ""}
              help={touched.companyId && (errors.companyId as string)}
              required
            >
              <Select
                placeholder="اختر الشركة"
                className="premium-select h-11"
                value={values.companyId}
                onChange={(value) => setFieldValue("companyId", value)}
                onBlur={() => handleBlur({ target: { name: "companyId" } })}
              >
                {companies.map(c => (
                  <Select.Option key={c.companyId} value={c.companyId}>{c.companyName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserFields;
