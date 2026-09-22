import { prisma } from '../config/db.js';

const ADMIN_ROLE = 'admin';
const isAdmin = (user) => user?.role === ADMIN_ROLE;
const isOwner = (user, ...ids) => ids.some((id) => id && id === user?.id);

const readAllEntities = new Set(['Product', 'Course', 'Lesson']);
const adminOnlyEntities = new Set(['User']);
const userOwnedEntities = new Set([
  'WasteReport',
  'Order',
  'Enrollment',
  'CreditWallet',
  'Transaction',
  'Subscription',
  'Notification',
]);

const getEntity = (name) => ({
  WasteReport: prisma.wasteReport,
  Product: prisma.product,
  Order: prisma.order,
  OrderItem: prisma.orderItem,
  Course: prisma.course,
  Lesson: prisma.lesson,
  Enrollment: prisma.enrollment,
  CreditWallet: prisma.creditWallet,
  Transaction: prisma.transaction,
  Subscription: prisma.subscription,
  IoTDevice: prisma.iOTDevice,
  SensorReading: prisma.sensorReading,
  Inventory: prisma.inventory,
  Notification: prisma.notification,
  User: prisma.user,
}[name]);

const ownershipWhere = (entity, user) => {
  switch (entity) {
    case 'WasteReport':
      return user.role === 'bio_processor'
        ? { OR: [{ user_id: user.id }, { assigned_processor_id: user.id }] }
        : { user_id: user.id };
    case 'Order':
      return { OR: [{ buyer_id: user.id }, { seller_id: user.id }] };
    case 'Enrollment':
    case 'CreditWallet':
    case 'Transaction':
    case 'Subscription':
    case 'Notification':
      return { user_id: user.id };
    default:
      return null;
  }
};

const mergeWhere = (base, restriction) => {
  if (!restriction) return base;
  return Object.keys(base || {}).length ? { AND: [base, restriction] } : restriction;
};

export const restrictListWhere = (entity, where, user) => {
  if (isAdmin(user) || readAllEntities.has(entity)) return where;
  if (adminOnlyEntities.has(entity)) return null;
  if (userOwnedEntities.has(entity)) return mergeWhere(where, ownershipWhere(entity, user));
  if (entity === 'IoTDevice') return mergeWhere(where, { owner_id: user.id });
  if (entity === 'Inventory') return user.role === 'bio_processor' ? mergeWhere(where, { processor_id: user.id }) : null;
  if (entity === 'SensorReading') return { device: { owner_id: user.id } };
  return null;
};

export const assertEntityAccess = async (entity, record, user, operation = 'read') => {
  if (!record) return { allowed: false, status: 404, error: 'Not found' };
  if (isAdmin(user)) return { allowed: true };
  if (adminOnlyEntities.has(entity)) return { allowed: false, status: 403, error: 'Forbidden' };

  if (readAllEntities.has(entity) && operation === 'read') return { allowed: true };
  if (entity === 'Product') {
    if (operation === 'create') return user.role === 'bio_processor'
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
    return isOwner(user, record.seller_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'WasteReport') {
    return isOwner(user, record.user_id, record.assigned_processor_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'Order') {
    return isOwner(user, record.buyer_id, record.seller_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'OrderItem') {
    const order = await prisma.order.findUnique({ where: { id: record.order_id } });
    return order && isOwner(user, order.buyer_id, order.seller_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'Lesson') {
    return operation === 'read'
      ? { allowed: true }
      : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'Course') {
    return operation === 'read'
      ? { allowed: true }
      : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'Enrollment' || entity === 'CreditWallet' || entity === 'Transaction' || entity === 'Subscription' || entity === 'Notification') {
    return isOwner(user, record.user_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'IoTDevice') {
    return isOwner(user, record.owner_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'SensorReading') {
    const device = await prisma.iOTDevice.findUnique({ where: { device_id: record.device_id } });
    return device && isOwner(user, device.owner_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'Inventory') {
    return user.role === 'bio_processor' && isOwner(user, record.processor_id)
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  return { allowed: false, status: 403, error: 'Forbidden' };
};

export const assertCreateAccess = (entity, data, user) => {
  if (isAdmin(user)) return { allowed: true };
  if (entity === 'Product') return user.role === 'bio_processor' && data.seller_id === user.id
    ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  if (entity === 'OrderItem') return { allowed: false, status: 403, error: 'Create order items through the order workflow' };
  if (entity === 'Course' || entity === 'Lesson') return { allowed: false, status: 403, error: 'Forbidden' };
  if (entity === 'WasteReport') return user.role === 'waste_producer' && data.user_id === user.id
    ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  if (entity === 'Order') return data.buyer_id === user.id
    ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  if (entity === 'Enrollment' || entity === 'CreditWallet' || entity === 'Transaction' || entity === 'Subscription' || entity === 'Notification') {
    return data.user_id === user.id
      ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  }
  if (entity === 'IoTDevice') return data.owner_id === user.id
    ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  if (entity === 'Inventory') return user.role === 'bio_processor' && data.processor_id === user.id
    ? { allowed: true } : { allowed: false, status: 403, error: 'Forbidden' };
  return { allowed: false, status: 403, error: 'Forbidden' };
};
