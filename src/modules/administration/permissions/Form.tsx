import React, { useEffect } from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import PermissionFields from "./Fields";
import { fetchResource, createResource, updateResource } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

const PermissionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { show: currentPermission } = useSelector((state: any) => state.permissions || { show: null });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    if (id) {
      dispatch(fetchResource("Permissions", id) as any);
    }
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    displayName: Yup.string().required("اسم الصلاحية مطلوب"),
  });

  const initialValues = {
    displayName: currentPermission?.displayName || "",
    permissionName: currentPermission?.permissionName || "",
    description: currentPermission?.description || "",
  };

  const onSubmit = (values: any) => {
    if (id) {
      dispatch(updateResource("Permissions", id, values, (res: any) => {
        if (res === 200) navigate("/permissions");
      }) as any);
    } else {
      dispatch(createResource("Permissions", values, (res: any) => {
        if (res === 200) navigate("/permissions");
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
                  onClick={() => navigate("/permissions")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  العودة للصلاحيات
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {id ? "تعديل صلاحية" : "إضافة صلاحية جديدة"}
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

            <PermissionFields />

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

export default PermissionForm;
