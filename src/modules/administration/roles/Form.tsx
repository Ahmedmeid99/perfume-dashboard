import React, { useEffect } from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import RoleFields from "./Fields";
import { fetchResource, createResource, updateResource, fetchCollection } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

const RoleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { show: currentRole } = useSelector((state: any) => state.roles || { show: null });
  const { data: permissions } = useSelector((state: any) => state.permissions || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    dispatch(fetchCollection("Permissions?pageSize=100") as any);
    if (id) {
      dispatch(fetchResource("Roles", id) as any);
    }
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    roleName: Yup.string().required("اسم الدور مطلوب"),
  });

  const initialValues = {
    roleName: currentRole?.roleName || "",
    description: currentRole?.description || "",
    permissionIds: currentRole?.permissionIds || [],
  };

  const onSubmit = (values: any) => {
    if (id) {
      dispatch(updateResource("Roles", id, values, (res: any) => {
        if (res === 200) navigate("/roles");
      }) as any);
    } else {
      dispatch(createResource("Roles", values, (res: any) => {
        if (res === 200) navigate("/roles");
      }) as any);
    }
  };

  return (
    <div className="space-y-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ submitForm, isSubmitting }) => (
          <FormikForm className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Button
                  type="text"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/roles")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  العودة للأدوار
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {id ? "تعديل دور" : "إضافة دور جديد"}
                </h1>
              </div>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                loading={loading || isSubmitting}
                onClick={submitForm}
                className="bg-primary hover:bg-blue-600 h-11 px-8 rounded-lg shadow-lg shadow-primary/20"
              >
                حفظ البيانات
              </Button>
            </div>

            <RoleFields permissions={permissions || []} />

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                loading={loading || isSubmitting}
                onClick={submitForm}
                className="bg-primary hover:bg-blue-600 h-12 px-12 rounded-lg shadow-lg shadow-primary/20 w-full md:w-auto"
              >
                حفظ التغييرات
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default RoleForm;
