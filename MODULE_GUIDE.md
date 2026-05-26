# Module Creation Guide — React-ITSM

This guide documents the standard pattern for creating a new CRUD module in the React-ITSM application.

---

## Module Structure

```
src/
├── constants/
│   ├── ActionTypes.js          # Add FETCH_{MODULE}_SUCCESS / FETCH_{SINGULAR}_SUCCESS
│   └── PermissionIds.js        # Add View/Create/Edit/Delete permission IDs
│
├── redux/
│   ├── reducers/
│   │   └── {ModuleName}.js     # New reducer file
│   └── rootReducer.js          # Register the new reducer
│
├── modules/
│   └── {parentGroup}/
│       └── {moduleName}/
│           ├── index.jsx       # Route definitions (Table, Form)
│           ├── Table.jsx       # Paginated data table with search, delete
│           ├── Form.jsx        # Create/Edit wrapper (fetches data, handles save)
│           └── Fields.jsx      # Formik form fields with validation
│
├── components/
│   └── common/
│       └── sidebar/
│           └── sidemenu/
│               └── sidemenu.jsx # Update dashboard menu
│
└── main.jsx                    # Register the route with permission guard
```

---

## Step-by-Step Workflow

### Step 1 — Action Types

**File:** `src/constants/ActionTypes.js`

Add two constants for collection and single-resource fetching:

```js
// {ModuleName} Module const
export const FETCH_{MODULE_UPPER}_SUCCESS = "FETCH_{MODULE_UPPER}_SUCCESS";
export const FETCH_{SINGULAR_UPPER}_SUCCESS = "FETCH_{SINGULAR_UPPER}_SUCCESS";
```

**Example** (for `CustomerServices`):

```js
export const FETCH_CUSTOMER_SERVICES_SUCCESS = "FETCH_CUSTOMER_SERVICES_SUCCESS";
export const FETCH_CUSTOMER_SERVICE_SUCCESS = "FETCH_CUSTOMER_SERVICE_SUCCESS";
```

> **Naming Rule:** The `fetchCollectionNew` action auto-generates the action type as
> `FETCH_${snakeCase(resource).toUpperCase()}_SUCCESS`. So if your API resource is
> `"customer-services"`, the generated type is `FETCH_CUSTOMER_SERVICES_SUCCESS`.

---

### Step 2 — Permission IDs

**File:** `src/constants/PermissionIds.js`

Add four permission constants with the next available IDs:

```js
// {ModuleName}
View{ModuleName}: XX,
Create{ModuleName}: XX+1,
Edit{ModuleName}: XX+2,
Delete{ModuleName}: XX+3,
```

> These IDs must match the backend permission seed data.

---

### Step 3 — Redux Reducer

**File:** `src/redux/reducers/{ModuleName}.js`

```js
import {
    FETCH_{MODULE_UPPER}_SUCCESS,
    FETCH_{SINGULAR_UPPER}_SUCCESS,
} from '../../constants/ActionTypes'

const initialSettings = {}

export default (state = initialSettings, action) => {
    switch (action.type) {
        case FETCH_{MODULE_UPPER}_SUCCESS: {
            return { ...state, index: action.payload }
        }
        case FETCH_{SINGULAR_UPPER}_SUCCESS: {
            return { ...state, show: action.payload }
        }
        default:
            return state
    }
}
```

---

### Step 4 — Register Reducer

**File:** `src/redux/rootReducer.js`

```js
// 1. Import
import {ModuleName} from "./reducers/{ModuleName}"

// 2. Add to combineReducers
export const rootReducer = combineReducers({
  // ... existing reducers
  {camelCaseName}: {ModuleName},
})
```

---

### Step 5 — Module UI Components

Create folder: `src/modules/{parentGroup}/{moduleName}/`

#### 5a. `index.jsx` — Route Definitions

```jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Table from "./Table";
import Form from "./Form";

export default function ModuleRoute() {
    return (
        <Routes>
            <Route index element={<Table />} />
            <Route path="/new" element={<Form />} />
            <Route path="/:id/edit" element={<Form />} />
        </Routes>
    );
}
```

#### 5b. `Table.jsx` — Data Table

Key elements:
- Uses `fetchCollectionNew("api-resource", pagination, search, filters, sorter)`
- Reads from `useSelector((state) => state?.{camelCaseName})`
- Defines `columns` array with `title`, `dataIndex`, optional `render`
- Handles delete with `deleteResource("api-resource", id)` + `useConfirm()`
- Uses `<Table>`, `<Pageheader>`, `<EditBtn>`, `<DeleteBtn>` core components

```jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteResource, fetchCollectionNew } from "../../../redux/actions/Apis";
import Pageheader from "../../../components/common/pageheader/pageheader";
import Table from "../../../components/core/Table/Table";
import { useConfirm } from "../../../components/core/Modal/DeleteConfirm/useConfirm";
import { EditBtn, DeleteBtn } from "../../../components/core/Buttons";
import { formatDate } from "../../../Helpers/date";

export default function {ModuleName}Table() {
  const dispatch = useDispatch();
  const {camelCaseName} = useSelector((state) => state?.{camelCaseName});
  const { loading } = useSelector((state) => state?.common);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState([]);
  const { confirm, ConfirmModalComponent } = useConfirm();

  useEffect(() => {
    dispatch(fetchCollectionNew("api-resource", { ...pagination }, search, filters, sortedInfo));
  }, [search, filters, pagination.current]);

  useEffect(() => {
    if ({camelCaseName}?.index?.data) {
      setData({camelCaseName}.index.data);
      if ({camelCaseName}?.index?.meta?.totalCount) {
        setPagination((prev) => ({ ...prev, total: {camelCaseName}?.index?.meta?.totalCount }));
      }
    }
  }, [{camelCaseName}, pagination.current]);

  const handleChange = (newPagination, newSearch, newFilters = filters, newSorter = sortedInfo) => {
    setPagination(newPagination);
    setSortedInfo(newSorter);
    setFilters(newFilters);
    setSearch(newSearch);
    dispatch(fetchCollectionNew("api-resource", newPagination, newSearch, newFilters, newSorter));
  };

  const onDelete = async (id) => {
    const isDeleted = await dispatch(deleteResource("api-resource", id));
    if (isDeleted) {
      setData((prev) => prev.filter((x) => x.{primaryKey} !== id));
      dispatch(fetchCollectionNew("api-resource", { ...pagination }, search, filters, sortedInfo));
    }
  };

  const columns = [
    { title: "Column Name", dataIndex: "fieldName" },
    // ... more columns
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-row items-center gap-2 text-[0.9375rem]">
          <EditBtn to={`${record.{primaryKey}}/edit`} />
          <DeleteBtn
            onClick={() =>
              confirm({
                title: `Confirm delete ID = ${record.{primaryKey}}?`,
                onOk: () => onDelete(record.{primaryKey}),
              })
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Pageheader currentpage="{Module Title}" activepage="{Module Title} Table" mainpage="Home" />
      <Table
        title="{Module Title}"
        rowKey="{primaryKey}"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleChange}
        loading={loading}
        showSearch={true}
      />
      {ConfirmModalComponent}
    </div>
  );
}
```

#### 5c. `Form.jsx` — Create/Edit Wrapper

Key elements:
- Fetches lists on mount: `dispatch(fetchLists("api-resource"))`
- Fetches single resource if editing: `dispatch(fetchResource("api-resource", id, "singular_name"))`
- Cleans up on unmount with `FETCH_{SINGULAR}_SUCCESS` reset
- Navigates back on success

```jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResource, createResource, updateResource, fetchLists } from "../../../redux/actions/Apis";
import { hideMessage } from "../../../redux/actions/Common";
import { FETCH_{SINGULAR_UPPER}_SUCCESS } from "../../../constants/ActionTypes";
import Pageheader from "../../../components/common/pageheader/pageheader";
import Fields from "./Fields";
import { useNavigate, useParams } from "react-router-dom";
import SaveBtn from "../../../components/core/Buttons/SaveBtn";

export default function {ModuleName}Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {singular} = useSelector((state) => state?.{camelCaseName}?.show);
  const lists = useSelector((state) => state.common?.lists);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchLists("api-resource"));
    if (id) {
      dispatch(fetchResource("api-resource", id, "singular_name"));
    }
    return () => {
      dispatch(hideMessage());
      dispatch({ type: FETCH_{SINGULAR_UPPER}_SUCCESS, payload: null });
    };
  }, [id]);

  const save{Singular} = (values) => {
    if (id) {
      dispatch(updateResource("api-resource", id, values, callBack));
    } else {
      dispatch(createResource("api-resource", values, callBack));
    }
  };

  const callBack = (response) => {
    if (response === 200) {
      navigate("/{parentGroup}/{moduleName}");
    } else if (response?.errors) {
      setErrors(response?.errors);
    }
  };

  const btnRef = useRef();
  const saveClick = () => { if (btnRef?.current) btnRef.current.click(); };

  return (
    <div className="xl:col-span-6 col-span-12">
      <Pageheader
        currentpage={id ? "Edit {Singular Title}" : "Add {Singular Title}"}
        activepage="{Singular Title} Form"
        mainpage="{Module Title}"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <h5 className="box-title">{id ? "Edit {Singular Title}" : "Add {Singular Title}"}</h5>
              <div><SaveBtn type="submit" onClick={saveClick} /></div>
            </div>
            <div className="box-body">
              <Fields
                {singular}={id && {singular}}
                lists={lists}
                btnRef={btnRef}
                save{Singular}={save{Singular}}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 5d. `Fields.jsx` — Form Fields

Key elements:
- Uses `useFormik` with `enableReinitialize: true`
- `initialValues` from props or empty defaults
- `validationSchema` using Yup
- Date formatting in `onSubmit`
- Uses `<Card>`, `<FormInput>`, `<CustomSelect>`, `<FormTextArea>` core components

```jsx
import React, { useEffect } from "react";
import { useFormik, FormikProvider, Field } from "formik";
import * as Yup from "yup";
import CustomSelect from "../../../components/core/Form/CustomSelect";
import FormInput from "../../../components/core/Form/FormInput";
import FormTextArea from "../../../components/core/Form/FormTextArea";
import { Card, CardBodyContent, CardBody, CardHeader } from "../../../components/core/FormCard/FormCard";

export default function Fields({ {singular}, lists, save{Singular}, btnRef, errors }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {singular}
      ? { ...{singular} }
      : {
          // define all fields with defaults
        },
    validationSchema: Yup.object().shape({
      // define validation rules
    }),
    onSubmit: (values, { setErrors }) => {
      // format dates if needed
      save{Singular}(values);
      if (errors) setErrors(errors);
    },
  });

  useEffect(() => {
    if (errors) formik.setErrors(errors);
  }, [errors]);

  return (
    <FormikProvider value={formik}>
      <form className="ti-validation" onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title="Section Title" />
          <CardBody>
            <CardBodyContent style="grid lg:grid-cols-2 gap-3 align-items-center mb-3">
              {/* Text input */}
              <Field name="fieldName" component={FormInput} label="Label" />

              {/* Select dropdown */}
              <CustomSelect name="fieldName" label="Label">
                <option value="">Please Select</option>
                {lists?.items?.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </CustomSelect>

              {/* Date input */}
              <Field name="dateField" component={FormInput} type="date" label="Date Label" />

              {/* Number input */}
              <Field name="numberField" component={FormInput} type="number" label="Number Label" />

              {/* Textarea */}
              <Field name="notes" component={FormTextArea} label="Notes" rows={4} />
            </CardBodyContent>
          </CardBody>
        </Card>

        <button type="submit" style={{ display: "none" }} ref={btnRef}></button>
      </form>
    </FormikProvider>
  );
}
```

---

### Step 6 — Register Route in `main.jsx`

```jsx
// 1. Import at top
import {ModuleName} from './modules/{parentGroup}/{moduleName}'

// 2. Add route inside <App> routes
<Route element={<RequireAuth permission={PermissionIds.View{ModuleName}} />} >
  <Route path={`${import.meta.env.BASE_URL}{parentGroup}/{route-name}/*`} element={<{ModuleName} />} />
</Route>
```

---

## Naming Conventions Reference

| Concept | Example (CustomerServices) |
|---|---|
| Module folder | `customerServices` |
| API resource (URL) | `customer-services` |
| Redux state key | `customerServices` |
| Reducer file | `CustomerServices.js` |
| Action type (collection) | `FETCH_CUSTOMER_SERVICES_SUCCESS` |
| Action type (single) | `FETCH_CUSTOMER_SERVICE_SUCCESS` |
| `fetchResource` singular arg | `"customer_service"` |
| Primary key | `customerServiceId` |
| Permission prefix | `ViewCustomerServices` |
| Route path | `customers/customer-services` |

---

## Available Core Components

| Component | Import Path | Usage |
|---|---|---|
| `FormInput` | `components/core/Form/FormInput` | Text, number, date inputs |
| `FormTextArea` | `components/core/Form/FormTextArea` | Multi-line text |
| `CustomSelect` | `components/core/Form/CustomSelect` | Dropdown select |
| `Card / CardHeader / CardBody / CardBodyContent` | `components/core/FormCard/FormCard` | Form sections |
| `Table` | `components/core/Table/Table` | Paginated data table |
| `Pageheader` | `components/common/pageheader/pageheader` | Page breadcrumb |
| `EditBtn / DeleteBtn` | `components/core/Buttons` | Action buttons |
| `SaveBtn` | `components/core/Buttons/SaveBtn` | Form save button |
| `useConfirm` | `components/core/Modal/DeleteConfirm/useConfirm` | Delete confirmation |

---

## Available Redux Actions (`redux/actions/Apis.js`)

| Action | Purpose |
|---|---|
| `fetchCollectionNew(resource, pagination, search, filters, sorter)` | Paginated list |
| `fetchResource(resource, id, singular)` | Single item |
| `fetchResourceDetails(resource, id, singular)` | Single item details |
| `createResource(resource, payload, callback, onSuccess)` | Create |
| `updateResource(resource, id, payload, callback)` | Update |
| `deleteResource(resource, id)` | Delete (returns boolean) |
| `fetchLists(model)` | Dropdown lists (`GET /model/lists`) |
| `fetchList(model)` | Dropdown list (`GET /model/list`) |
| `updateStatus(id, resource, status)` | Toggle active status |

---

### Step 7 — Update Dashboard Menu

**File:** `src/components/common/sidebar/sidemenu/sidemenu.jsx`

Add the new module to the `MENUITEMS` array under the appropriate section (create a new section if needed):

```js
{
  icon: <i className="side-menu__icon bx bx-wrench"></i>,
  type: "sub",
  title: "{Section Name}",
  permissionId: PermissionIds.View{ModuleName},
  children: [
    {
      path: `${import.meta.env.BASE_URL}{section}/{module}`,
      icon: <i className="side-menu__icon bx bx-cog"></i>,
      type: "link",
      title: "{Module Title}",
      permissionId: PermissionIds.View{ModuleName},
    },
  ],
},
```

---

## Checklist for New Module

- [ ] Add action types in `constants/ActionTypes.js`
- [ ] Add permission IDs in `constants/PermissionIds.js`
- [ ] Create reducer in `redux/reducers/{ModuleName}.js`
- [ ] Register reducer in `redux/rootReducer.js`
- [ ] Create module folder `modules/{parentGroup}/{moduleName}/`
- [ ] Create `index.jsx` (routes)
- [ ] Create `Table.jsx` (list view)
- [ ] Create `Form.jsx` (create/edit wrapper)
- [ ] Create `Fields.jsx` (form fields)
- [ ] Register route in `main.jsx` with permission guard
- [ ] Update dashboard menu in `sidemenu.jsx`
