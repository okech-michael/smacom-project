export const ROLES = Object.freeze({
  WASTE_PRODUCER: 'waste_producer',
  BIO_PROCESSOR: 'bio_processor',
  FARMER: 'farmer',
  LEARNER: 'learner',
  ADMIN: 'admin',
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));
export const PUBLIC_REGISTRATION_ROLES = Object.freeze([
  ROLES.WASTE_PRODUCER,
  ROLES.BIO_PROCESSOR,
  ROLES.FARMER,
  ROLES.LEARNER,
]);

export const ROLE_LABELS = Object.freeze({
  [ROLES.WASTE_PRODUCER]: 'Waste Producer',
  [ROLES.BIO_PROCESSOR]: 'Bio Processor',
  [ROLES.FARMER]: 'Farmer',
  [ROLES.LEARNER]: 'Learner',
  [ROLES.ADMIN]: 'Administrator',
});

export const DASHBOARD_BY_ROLE = Object.freeze({
  [ROLES.WASTE_PRODUCER]: 'waste_producer',
  [ROLES.BIO_PROCESSOR]: 'bio_processor',
  [ROLES.FARMER]: 'farmer',
  [ROLES.LEARNER]: 'learner',
  [ROLES.ADMIN]: 'admin',
});

export const isValidRole = (role) => ALL_ROLES.includes(role);
export const isPublicRegistrationRole = (role) => PUBLIC_REGISTRATION_ROLES.includes(role);
export const dashboardRoleFor = (role) => (isValidRole(role) ? DASHBOARD_BY_ROLE[role] : null);
