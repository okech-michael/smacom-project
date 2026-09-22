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

export const isValidRole = (role) => ALL_ROLES.includes(role);
export const isPublicRegistrationRole = (role) => PUBLIC_REGISTRATION_ROLES.includes(role);
