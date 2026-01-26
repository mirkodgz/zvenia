const ROLES = {
  BASIC: "Basic",
  EXPERT: "Expert",
  ADS: "Ads",
  EVENTS: "Events",
  COUNTRY_MANAGER: "CountryManager",
  ADMINISTRATOR: "Administrator"
};
function isAdministrator(role) {
  return role === ROLES.ADMINISTRATOR;
}

export { ROLES as R, isAdministrator as i };
