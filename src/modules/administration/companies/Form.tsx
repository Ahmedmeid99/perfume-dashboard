import React, { useEffect } from "react";
import { Button } from "antd";
import { ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CompanyFields from "./Fields";
import { fetchResource, createResource, updateResource, uploadFile } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";

const CompanyForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { show: currentCompany } = useSelector((state: any) => state.companies || { show: null });
  const { loading } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    if (id) {
      dispatch(fetchResource("Companies", id) as any);
    }
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    companyName: Yup.string().required("اسم الشركة مطلوب"),
    companyNameAr: Yup.string().required("اسم الشركة بالعربي مطلوب"),
    email: Yup.string().email("بريد إلكتروني غير صالح"),
  });

  const initialValues = {
    companyName: currentCompany?.companyName || "",
    companyNameAr: currentCompany?.companyNameAr || "",
    email: currentCompany?.email || "",
    phone: currentCompany?.phone || "",
    address: currentCompany?.address || "",
    latitude: currentCompany?.latitude || null,
    longitude: currentCompany?.longitude || null,
    isActive: currentCompany?.isActive ?? true,
    logo: currentCompany?.logo || null,
    tempLogoFile: null,
  };

  const onSubmit = (values: any) => {
    const { tempLogoFile, logo, ...restValues } = values;

    const handleLogoUpload = (companyId: number) => {
      if (tempLogoFile) {
        dispatch(uploadFile("Companies", companyId, tempLogoFile, "logo") as any);
      }
    };

    if (id) {
      dispatch(updateResource("Companies", id, restValues, (res: any) => {
        if (res === 200) {
          handleLogoUpload(Number(id));
          navigate("/companies");
        }
      }) as any);
    } else {
      dispatch(createResource("Companies", restValues, (res: any, data: any) => {
        if (res === 200) {
          if (data && data.companyId) {
            handleLogoUpload(data.companyId);
          }
          navigate("/companies");
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
                  onClick={() => navigate("/companies")}
                  className="text-gray-400 hover:text-white mb-2"
                >
                  العودة للشركات
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {id ? "تعديل شركة" : "إضافة شركة جديدة"}
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

            <CompanyFields />

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

export default CompanyForm;
