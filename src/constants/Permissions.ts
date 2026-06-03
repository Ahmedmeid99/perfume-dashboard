/**
 * Permission ID constants as defined in the backend database.
 * Each constant matches the PermissionId value stored in the Permissions table.
 */
export const PERMISSIONS = {
  // Roles
  ViewRoles: 17,
  CreateRoles: 18,
  EditRoles: 19,
  DeleteRoles: 20,

  // Permissions
  ViewPermissions: 21,
  EditPermissions: 22,
  AssignPermissions: 23,
  RevokePermissions: 24,

  // Users
  ViewUsers: 33,
  CreateUsers: 34,
  EditUsers: 35,
  DeleteUsers: 36,

  // Companies
  ViewCompanies: 55,
  CreateCompanies: 56,
  EditCompanies: 57,
  DeleteCompanies: 58,

  // Orders
  ViewOrders: 77,
  CreateOrders: 78,
  EditOrders: 79,
  DeleteOrders: 80,

  // Products
  ViewProductCatalogs: 81,
  CreateProductCatalogs: 82,
  EditProductCatalogs: 83,
  DeleteProductCatalogs: 84,

  // Categories
  ViewProductCategories: 85,
  CreateProductCategories: 86,
  EditProductCategories: 87,
  DeleteProductCategories: 88,

  // Gallery Images
  ViewGallery: 89,
  CreateGallery: 90,
  EditGallery: 91,
  DeleteGallery: 92,
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionId = (typeof PERMISSIONS)[PermissionKey];
