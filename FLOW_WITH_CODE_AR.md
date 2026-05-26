# شرح مسار البيانات مع أمثلة من الكود (Technical Data Flow)

يوضح هذا الملف كيفية انتقال البيانات برمجياً بين **Formik** و **Yup** و **Redux** و **API** داخل المشروع.

---

## 1. مرحلة التحقق (Yup Validation)
**الملف:** `Fields.jsx`  
هنا يتم تحديد القواعد؛ إذا لم يلتزم بها المستخدم، تمنع المكتبة عملية الإرسال وتظهر رسائل الخطأ.

```javascript
validationSchema: Yup.object().shape({
  name: Yup.string().max(200, "Name cannot exceed 200 characters").required("Task name is required"),
  description: Yup.string().nullable(),
  employeeId: Yup.number().required("Employee is required"),
  repeatType: Yup.number().required("Repeat type is required"),
})
```

---

## 2. مرحلة تهيئة النموذج (Formik Initialization)
**الملف:** `Fields.jsx`  
هنا يتم ربط بيانات Redux بالحقول عند فتح الصفحة (خاصة في حالة التعديل).

```javascript
const formik = useFormik({
  enableReinitialize: true,
  initialValues: task ? { ...task } : {
    name: "",
    description: "",
    employeeId: "",
    repeatType: "",
    isActive: true,
  },
  onSubmit: (values) => {
    saveTask(values); // إرسال القيم للدالة الأب
  }
})
```

---

## 3. مرحلة الإرسال (Redux Dispatch)
**الملف:** `Form.jsx`  
بمجرد نجاح الـ Validation، يتم استدعاء الأكشن (Action) المناسب.

```javascript
const saveTask = (values) => {
    if (id) {
        dispatch(updateResource("Tasks", id, values, callBack));
    } else {
        dispatch(createResource("Tasks", values, callBack));
    }
};
```

---

## 4. مرحلة الاتصال بالسيرفر (API Call)
**الملف:** `src/redux/actions/Apis.js`  
هنا يتم استخدام `Axios` لإرسال البيانات الفعلية للسيرفر.

```javascript
export const createResource = (resource, payload, callback) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios.post(`${baseUrl}/${resource}`, payload)
      .then(({ data }) => {
        if (data.message) {
          dispatch({ type: FETCH_SUCCESS });
          callback(200); // العودة لصفحة الجدول
        }
      })
      .catch(error => dispatch({ type: FETCH_ERROR, payload: error.message }));
  };
};
```

---

## 5. مرحلة تحديث الحالة (Reducer)
**الملف:** `src/redux/reducers/Tasks.js`  
بعد نجاح العملية، يتم تحديث مخزن البيانات ليعلم التطبيق بالتغيير ويقوم بتحديث الواجهة.

```javascript
case FETCH_TASK_SUCCESS: {
    return { ...state, show: action.payload }
}
```

---

## ملخص المسار (The Summary)
1. **المستخدم:** يدخل البيانات.
2. **Yup:** يتأكد من صحتها.
3. **Formik:** يجمعها ويرسلها عند الـ Submit.
4. **Form.jsx:** يرسلها عبر Dispatch.
5. **Apis.js:** يرسلها للسيرفر ويستقبل الرد.
6. **Reducer:** يحفظ البيانات في الـ State العالمي.
7. **UI:** تعيد عرض البيانات الجديدة تلقائياً.
