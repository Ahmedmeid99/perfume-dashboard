import React from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import OrderFields from "./Fields";
import { createResource } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.common);

  const validationSchema = Yup.object({
    userId: Yup.number().required("العميل مطلوب"),
    items: Yup.array()
      .of(
        Yup.object({
          productId: Yup.number().required("المنتج مطلوب"),
          quantity: Yup.number()
            .required("الكمية مطلوبة")
            .min(1, "الكمية يجب أن تكون 1 على الأقل"),
        })
      )
      .min(1, "يجب إضافة منتج واحد على الأقل للطلب"),
  });

  const initialValues = {
    userId: undefined,
    companyId: user?.companyId || 0,
    items: [] as Array<{ productId?: number; quantity: number; price: number; stock: number }>,
  };

  const onSubmit = (values: any) => {
    const payload = {
      userId: Number(values.userId),
      companyId: Number(values.companyId),
      items: values.items.map((item: any) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    };

    dispatch(
      createResource("Orders", payload, (res: any) => {
        if (res === 200) {
          navigate("/orders");
        }
      }) as any
    );
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
                  onClick={() => navigate("/orders")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  العودة للطلبات
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  إضافة طلب جديد
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
                إرسال الطلب
              </Button>
            </div>

            <OrderFields />

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                loading={loading || isSubmitting}
                onClick={submitForm}
                className="bg-primary hover:bg-blue-600 h-12 px-12 rounded-lg shadow-lg shadow-primary/20 w-full md:w-auto"
              >
                تأكيد وإضافة الطلب
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default OrderForm;
