import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api/axiosInstance";
import { AuthActionTypes } from "../../redux/actions/Auth";
import { Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post("/login", values);
        if (response.data && response.data.data) {
          const { accessToken, refreshToken, user, permissionIds } = response.data.data;
          
          dispatch({
            type: AuthActionTypes.Login,
            payload: { accessToken, refreshToken, user, permissionIds },
          });

          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred during login");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div className="premium-card w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg shadow-primary/20">
            S
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">أهلاً بك في متجر سام</h1>
          <p className="text-gray-400">يرجى إدخال بياناتك لتسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-500" />}
              name="email"
              placeholder="admin@sam.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              status={formik.touched.email && formik.errors.email ? "error" : ""}
              className="bg-dark-800 border-dark-600 text-white hover:border-primary focus:border-primary h-12"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">البريد الإلكتروني مطلوب</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-500" />}
              name="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              status={formik.touched.password && formik.errors.password ? "error" : ""}
              className="bg-dark-800 border-dark-600 text-white hover:border-primary focus:border-primary h-12"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">كلمة المرور مطلوبة</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="ml-2 rounded border-dark-600 bg-dark-800 text-primary focus:ring-primary" />
              تذكرني
            </label>
            <a href="#" className="text-primary hover:text-blue-400 transition-colors">نسيت كلمة المرور؟</a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            className="bg-primary hover:bg-blue-600 border-none h-12 text-lg font-semibold"
          >
            تسجيل الدخول
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          ليس لديك حساب؟ <a href="#" className="text-primary hover:text-blue-400 font-medium">اتصل بالمسؤول</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
