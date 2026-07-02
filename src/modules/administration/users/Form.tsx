import React, { useEffect } from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import UserFields from "./Fields";
import { fetchResource, createResource, updateResource, fetchCollection } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

interface FormProps {
  userType?: "users" | "admins";
}

const UserForm: React.FC<FormProps> = ({ userType = "users" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { show: currentUser, lists } = useSelector((state: any) => state.users || { show: null, lists: null });
  const roles = lists?.roles || [];
  const companies = lists?.companies || [];
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    dispatch(fetchCollection("Users/lists") as any);
    if (id) {
      dispatch(fetchResource("Users", id) as any);
    }
  }, [id, dispatch]);

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("اسم المستخدم مطلوب"),
    email: Yup.string().email("بريد إلكتروني غير صالح").required("البريد الإلكتروني مطلوب"),
    phone: Yup.string().required("رقم الهاتف مطلوب"),
    address: Yup.string().required("العنوان مطلوب"),
    roleId: Yup.number().required("الدور مطلوب"),
    companyId: Yup.number().required("الشركة مطلوبة"),
    password: Yup.string().when("isEdit", {
      is: (isEdit: boolean) => !isEdit,
      then: (schema) => schema.required("كلمة المرور مطلوبة").min(6, "يجب أن تكون 6 أحرف على الأقل"),
      otherwise: (schema) => schema.min(6, "يجب أن تكون 6 أحرف على الأقل").nullable(),
    }),
    confirmPassword: Yup.string().when("password", {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.required("يرجى تأكيد كلمة المرور").oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const initialValues = {
    userName: currentUser?.userName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    roleId: currentUser?.roleId || (userType === "admins" ? 7 : userType === "users" ? 1 : undefined),
    companyId: currentUser?.companyId || undefined,
    dateOfBirth: currentUser?.dateOfBirth ? dayjs(currentUser.dateOfBirth) : null,
    password: "",
    confirmPassword: "",
    isEdit: !!id,
  };

  const onSubmit = (values: any) => {
    const { confirmPassword, isEdit, ...payload } = values;

    // Prepare payload
    const finalPayload = {
      ...payload,
      dateOfBirth: payload.dateOfBirth ? payload.dateOfBirth.toISOString() : null,
    };

    // Remove password if it's empty
    if (!finalPayload.password || !finalPayload.password.trim()) {
      delete finalPayload.password;
    }

    if (id) {
      dispatch(updateResource("Users", id, finalPayload, (res) => {
        if (res === 200) navigate(userType === "admins" ? "/admins" : "/users");
      }) as any);
    } else {
      dispatch(createResource("Users", finalPayload, (res) => {
        if (res === 200) navigate(userType === "admins" ? "/admins" : "/users");
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
                  onClick={() => navigate(userType === "admins" ? "/admins" : "/users")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  {userType === "admins" ? "العودة للمدراء" : "العودة للمستخدمين"}
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {id
                    ? userType === "admins" ? "تعديل مدير" : "تعديل مستخدم"
                    : userType === "admins" ? "إضافة مدير جديد" : "إضافة مستخدم جديد"}
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

            <UserFields roles={roles || []} companies={companies || []} isEdit={!!id} userType={userType} />

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

export default UserForm;
