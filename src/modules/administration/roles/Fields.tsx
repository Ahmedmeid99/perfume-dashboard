import React from "react";
import { Form, Input, Card, Divider, Row, Col, Checkbox } from "antd";
import { useFormikContext } from "formik";

interface FieldsProps {
  permissions: any[];
}

const RoleFields: React.FC<FieldsProps> = ({ permissions }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<any>();

  return (
    <div className="space-y-6">
      <Card title="Role Information" className="premium-card">
        <Form.Item
          label="Role Name"
          validateStatus={touched.roleName && errors.roleName ? "error" : ""}
          help={touched.roleName && (errors.roleName as string)}
          required
        >
          <Input
            name="roleName"
            value={values.roleName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Sales Manager"
            className="bg-black border-none text-white h-11"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          validateStatus={touched.description && errors.description ? "error" : ""}
          help={touched.description && (errors.description as string)}
        >
          <Input.TextArea
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe the role responsibilities"
            rows={4}
            className="bg-black border-none text-white"
          />
        </Form.Item>
      </Card>

      <Card title="Role Permissions" className="premium-card">
        <Form.Item
          label="Permissions"
          validateStatus={touched.permissionIds && errors.permissionIds ? "error" : ""}
          help={touched.permissionIds && (errors.permissionIds as string)}
        >
          <Checkbox.Group
            className="w-full"
            value={values.permissionIds}
            onChange={(checkedValues) => setFieldValue("permissionIds", checkedValues)}
          >
            {Object.entries(
              permissions.reduce((acc: any, p: any) => {
                const module = p.moduleName || "General";
                if (!acc[module]) acc[module] = [];
                acc[module].push(p);
                return acc;
              }, {})
            ).map(([module, modulePermissions]: [string, any]) => (
              <div key={module} className="mb-6 last:mb-0">
                <Divider titlePlacement="left" className="!my-4 !text-gray-500 !border-dark-600">
                  <span className="text-xs uppercase tracking-widest font-bold">{module}</span>
                </Divider>
                <Row gutter={[16, 16]}>
                  {modulePermissions.map((p: any) => (
                    <Col span={8} key={p.permissionId}>
                      <div className="p-3 rounded-lg border border-dark-600 bg-dark-700/30 hover:bg-dark-700 transition-colors">
                        <Checkbox value={p.permissionId}>
                          <span className="text-white ml-2 text-sm">{p.displayName}</span>
                        </Checkbox>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Card>
    </div>
  );
};

export default RoleFields;
