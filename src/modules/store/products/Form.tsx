import React, { useEffect } from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ProductFields from "./Fields";
import {
  fetchResource,
  createResource,
  updateResource,
  fetchCollection,
  uploadFile,
} from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { show: currentProduct, lists } = useSelector(
    (state: any) => state.products || { show: null, lists: null }
  );
  const categories = lists?.categories || [];
  const { loading } = useSelector((state: RootState) => state.common);
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchCollection("Products/lists") as any);
    if (id) {
      dispatch(fetchResource("Products", id) as any);
    }
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    productName: Yup.string().required("اسم المنتج مطلوب"),
    productNameAr: Yup.string().required("اسم المنتج بالعربي مطلوب"),
    price: Yup.number().required("السعر مطلوب").min(0, "يجب أن يكون السعر موجباً"),
    quantityInStock: Yup.number()
      .required("الكمية مطلوبة")
      .min(0, "يجب أن تكون الكمية موجبة"),
    categoryId: Yup.number().required("التصنيف مطلوب"),
  });

  const initialValues = {
    productName: currentProduct?.productName || "",
    productNameAr: currentProduct?.productNameAr || "",
    description: currentProduct?.description || "",
    descriptionAr: currentProduct?.descriptionAr || "",
    price: currentProduct?.price || 0,
    quantityInStock: currentProduct?.quantityInStock || 0,
    categoryId: currentProduct?.categoryId || undefined,
    productImages: currentProduct?.productImages || [],
    tempImageFiles: [],
  };

  const onSubmit = (values: any) => {
    const { tempImageFiles, productImages, ...restValues } = values;

    const handleImageUploads = (productId: number) => {
      if (tempImageFiles && tempImageFiles.length > 0) {
        tempImageFiles.forEach((file: File) => {
          dispatch(uploadFile("Products", productId, file) as any);
        });
      }
    };

    if (id) {
      dispatch(
        updateResource("Products", id, restValues, (res: any) => {
          if (res === 200) {
            handleImageUploads(Number(id));
            navigate("/products");
          }
        }) as any
      );
    } else {
      const payload = {
        ...restValues,
        companyId: authUser?.companyId,
      };
      dispatch(
        createResource("Products", payload, (res: any, data: any) => {
          if (res === 200) {
            if (data && data.productId) {
              handleImageUploads(data.productId);
            }
            navigate("/products");
          }
        }) as any
      );
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Button
                  type="text"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/products")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  العودة للمنتجات
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {id ? "تعديل منتج" : "إضافة منتج جديد"}
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

            {/* Fields */}
            <ProductFields categories={categories || []} />

            {/* Footer Save Button */}
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

export default ProductForm;
