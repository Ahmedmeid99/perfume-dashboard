import React, { useEffect } from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CategoryFields from "./Fields";
import { fetchResource, createResource, updateResource, uploadFile } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

const CategoryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { show: currentCategory } = useSelector((state: any) => state.categories || { show: null });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    if (id) {
      dispatch(fetchResource("ProductCategories", id) as any);
    }
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("اسم التصنيف مطلوب"),
    categoryNameAr: Yup.string(),
  });

  const initialValues = {
    categoryName: currentCategory?.categoryName || "",
    categoryNameAr: currentCategory?.categoryNameAr || "",
    categoryImages: currentCategory?.categoryImages || [],
    tempImageFiles: [],
  };

  const onSubmit = (values: any) => {
    const { tempImageFiles, categoryImages, ...restValues } = values;

    const handleImageUploads = (categoryId: number) => {
      if (tempImageFiles && tempImageFiles.length > 0) {
        tempImageFiles.forEach((file: File) => {
          dispatch(uploadFile("ProductCategories", categoryId, file) as any);
        });
      }
    };

    if (id) {
      dispatch(updateResource("ProductCategories", id, restValues, (res: any) => {
        if (res === 200) {
          handleImageUploads(Number(id));
          navigate("/categories");
        }
      }) as any);
    } else {
      dispatch(createResource("ProductCategories", restValues, (res: any, data: any) => {
        if (res === 200) {
          if (data && data.categoryId) {
            handleImageUploads(data.categoryId);
          }
          navigate("/categories");
        }
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
                  onClick={() => navigate("/categories")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  العودة للتصنيفات
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {id ? "تعديل تصنيف" : "إضافة تصنيف جديد"}
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

            <CategoryFields />

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

export default CategoryForm;
