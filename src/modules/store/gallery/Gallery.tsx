import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Modal, Spin, Empty, message } from "antd";
import { InboxOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchCollection, deleteResource } from "../../../redux/actions/Apis";
import type { RootState } from "../../../redux/store";
import { getImageUrl } from "../../../utils/image";
import DeleteBtn from "../../../components/ui/DeleteBtn";
import { PERMISSIONS } from "../../../constants/Permissions";
import axios from "../../../services/api/axiosInstance";
import { toast } from "react-toastify";

const { Dragger } = Upload;

const Gallery: React.FC = () => {
  const dispatch = useDispatch();
  const { data: responseData } = useSelector((state: any) => state.galleryImages || { data: [] });
  const { loading } = useSelector((state: RootState) => state.common);
  const { permissionIds } = useSelector((state: RootState) => state.auth);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Check permissions
  const hasPermission = (permissionId: number): boolean => {
    return Array.isArray(permissionIds) && permissionIds.includes(permissionId);
  };

  const canView = hasPermission(PERMISSIONS.ViewGallery);
  const canCreate = hasPermission(PERMISSIONS.CreateGallery);
  const canDelete = hasPermission(PERMISSIONS.DeleteGallery);

  useEffect(() => {
    if (canView) {
      dispatch(fetchCollection("GalleryImages") as any);
    }
  }, [dispatch, canView]);

  // Extract images array from response wrapper
  const images = Array.isArray(responseData) ? responseData : responseData?.data || [];

  const getImageId = (img: any): number =>
    img.galleryImageId || img.imageId || img.GalleryImageId || img.ImageId || 0;

  const handleDelete = (id: number) => {
    if (!id || id <= 0) {
      toast.error("معرف الصورة غير صالح");
      return;
    }
    dispatch(deleteResource("GalleryImages", id) as any).then((success: boolean) => {
      if (success) {
        dispatch(fetchCollection("GalleryImages") as any);
      }
    });
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await axios.post("/GalleryImages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success(response.data.message || "تم رفع الصورة بنجاح");
        onSuccess(response.data);
        dispatch(fetchCollection("GalleryImages") as any);
      } else {
        toast.error("فشل رفع الصورة");
        onError(new Error("Upload failed"));
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "حدث خطأ أثناء رفع الصورة";
      toast.error(errorMsg);
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <Empty description="ليست لديك صلاحية لعرض معرض الصور" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="px-1 lg:px-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">معرض الصور</h1>
          <p className="text-gray-400 text-sm lg:text-base">إدارة وتحميل صور المعرض في التطبيق</p>
        </div>
      </div>

      {canCreate && (
        <div className="premium-card p-6">
          <h2 className="text-white text-lg font-semibold mb-4 text-right">إضافة صور جديدة</h2>
          <Dragger
            name="file"
            multiple={false}
            customRequest={handleCustomUpload}
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("يمكنك تحميل ملفات الصور فقط!");
                return Upload.LIST_IGNORE;
              }
              return true;
            }}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon text-primary text-4xl mb-2">
              {uploading ? <Spin size="large" /> : <InboxOutlined />}
            </p>
            <p className="text-white text-base font-medium">انقر أو اسحب الصورة هنا لتحميلها</p>
            <p className="text-gray-500 text-xs mt-1">يدعم فقط صيغ الصور (JPG, PNG, WEBP, GIF)</p>
          </Dragger>
        </div>
      )}

      <div className="premium-card p-6">
        <h2 className="text-white text-lg font-semibold mb-6 text-right">الصور الحالية</h2>

        {loading && images.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : images.length === 0 ? (
          <div className="py-12">
            <Empty description={<span className="text-gray-400">لا توجد صور في المعرض حالياً</span>} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {images.map((img: any) => {
              const absoluteUrl = getImageUrl(img.imageUrl);
              return (
                <div
                  key={getImageId(img)}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-dark-700/50 border border-dark-600/50 hover:border-primary/30 transition-all duration-300 shadow-lg shadow-black/10"
                >
                  <img
                    src={absoluteUrl}
                    alt="Gallery item"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handlePreview(absoluteUrl)}
                      className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 rounded-lg w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer"
                      title="عرض الصورة"
                    >
                      <EyeOutlined className="text-lg" />
                    </button>
                    {canDelete && (
                      <DeleteBtn
                        onClick={() => handleDelete(getImageId(img))}
                        title="حذف الصورة"
                        confirmTitle="هل أنت متأكد من حذف هذه الصورة من المعرض؟"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={previewOpen}
        title={null}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={800}
        bodyStyle={{ padding: 0, backgroundColor: "#141414" }}
        closeIcon={<span className="text-white hover:text-primary text-lg">×</span>}
      >
        <img alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" src={previewImage} />
      </Modal>
    </div>
  );
};

export default Gallery;
