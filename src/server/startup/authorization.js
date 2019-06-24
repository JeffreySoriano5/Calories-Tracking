import {RBAC} from 'rbac';

let rbac;

export default async function () {
  rbac = new RBAC({
    roles: ['admin', 'user', 'manager'],
    permissions: {
      user: ['create', 'read', 'update', 'delete'],
      password: ['change'],
      meal: ['create', 'read', 'update', 'delete'],
    },
    grants: {
      user: ['change_password', 'create_meal', 'read_meal', 'update_meal', 'delete_meal'],
      manager: ['create_user', 'read_user', 'update_user', 'delete_user'],
      admin: ['user', 'manager'],
    },
  });

  await rbac.init();
}

export function getRbac() {
  return rbac;
}
