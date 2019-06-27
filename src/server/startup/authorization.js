import {RBAC} from 'rbac';

let rbac;

export default async function () {
  rbac = new RBAC({
    roles: ['admin', 'user', 'manager'],
    permissions: {
      user: ['create', 'read', 'update', 'delete'],
      meal: ['create', 'read', 'update', 'delete'],
    },
    grants: {
      user: [],
      manager: ['create_user', 'read_user', 'update_user', 'delete_user'],
      admin: ['manager', 'read_meal', 'update_meal', 'delete_meal'],
    },
  });

  await rbac.init();
}

export function getRbac() {
  return rbac;
}
