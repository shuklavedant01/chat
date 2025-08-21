import { useUser } from '../../../context/UserContext';
import navItems from './navItems';

// Recursively filter nav items by allowedRoles
function filterNavItemsByRole(items, userRole) {
  return items
    .filter((item) => {
      if (item.allowedRoles) {
        return item.allowedRoles.includes(userRole);
      }
      return true;
    })
    .map((item) => {
      if (item.menuChildren) {
        return {
          ...item,
          menuChildren: filterNavItemsByRole(item.menuChildren, userRole),
        };
      }
      return item;
    });
}

const useRoleNavItems = () => {
  const userContext = useUser();
  const user = userContext?.user;
  const userRole = user?.role;
  return filterNavItemsByRole(navItems, userRole);
};

export default useRoleNavItems;
