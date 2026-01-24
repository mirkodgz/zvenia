// Definición de roles del sistema ZVENIA Mining
export const ROLES = {
  BASIC: 'Basic',
  EXPERT: 'Expert',
  ADS: 'Ads',
  EVENTS: 'Events',
  COUNTRY_MANAGER: 'CountryManager',
  ADMINISTRATOR: 'Administrator',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Jerarquía de roles (de menor a mayor poder)
export const ROLE_HIERARCHY: UserRole[] = [
  ROLES.BASIC,
  ROLES.EXPERT,
  ROLES.ADS,
  ROLES.EVENTS,
  ROLES.COUNTRY_MANAGER,
  ROLES.ADMINISTRATOR,
];

// Roles que pueden moderar contenido de otros
export const MODERATOR_ROLES: UserRole[] = [
  ROLES.COUNTRY_MANAGER,
  ROLES.ADMINISTRATOR,
];

// Roles que tienen acceso al dashboard admin
export const ADMIN_ROLES: UserRole[] = [
  ROLES.COUNTRY_MANAGER,
  ROLES.ADMINISTRATOR,
];

// Permisos por tipo de contenido
export const CONTENT_PERMISSIONS = {
  post: [ROLES.BASIC, ROLES.EXPERT, ROLES.ADS, ROLES.EVENTS, ROLES.COUNTRY_MANAGER, ROLES.ADMINISTRATOR],
  event: [ROLES.EVENTS, ROLES.COUNTRY_MANAGER, ROLES.ADMINISTRATOR],
  podcast: [ROLES.EXPERT, ROLES.COUNTRY_MANAGER, ROLES.ADMINISTRATOR],
  service: [ROLES.ADS, ROLES.COUNTRY_MANAGER, ROLES.ADMINISTRATOR],
} as const;

export type ContentType = keyof typeof CONTENT_PERMISSIONS;

/**
 * Verifica si un rol puede crear un tipo de contenido
 */
export function canCreateContent(role: UserRole, contentType: ContentType): boolean {
  return CONTENT_PERMISSIONS[contentType].includes(role);
}

/**
 * Verifica si un rol es moderador (puede editar/eliminar contenido de otros)
 */
export function isModerator(role: UserRole): boolean {
  return MODERATOR_ROLES.includes(role);
}

/**
 * Verifica si un rol tiene acceso al dashboard admin
 */
export function hasAdminAccess(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

/**
 * Verifica si un rol es administrador total
 */
export function isAdministrator(role: UserRole): boolean {
  return role === ROLES.ADMINISTRATOR;
}

/**
 * Obtiene el nivel jerárquico de un rol (0 = Basic, 5 = Administrator)
 */
export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/**
 * Compara dos roles y retorna true si role1 >= role2
 */
export function hasRoleOrHigher(role1: UserRole, role2: UserRole): boolean {
  return getRoleLevel(role1) >= getRoleLevel(role2);
}
