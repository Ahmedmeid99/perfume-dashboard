export const OrderStatus = {
  Pending: 1,
  Confirmed: 2,
  Processing: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 6,
  Returned: 7,
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderStatusDetails {
  label: string;
  color: string;
}

export const OrderStatusMap: Record<OrderStatus, OrderStatusDetails> = {
  [OrderStatus.Pending]: { label: "قيد الانتظار", color: "orange" },
  [OrderStatus.Confirmed]: { label: "مؤكد", color: "blue" },
  [OrderStatus.Processing]: { label: "قيد المعالجة", color: "purple" },
  [OrderStatus.Shipped]: { label: "تم الشحن", color: "cyan" },
  [OrderStatus.Delivered]: { label: "تم التوصيل", color: "green" },
  [OrderStatus.Cancelled]: { label: "ملغي", color: "red" },
  [OrderStatus.Returned]: { label: "مسترجع", color: "volcano" },
};
