import {RBAC} from 'rbac';
import authorization from 'express-rbac/lib';

export default async function (app) {
  const rbac = new RBAC({
    roles: ['admin', 'user', 'manager'],
    permissions: {
      user: ['create', 'read', 'update', 'delete'],
      password: ['change'],
      meal: ['create', 'read', 'update', 'delete'],
    },
    grants: {
      user: ['change_password', 'create_meal', 'read_meal', 'update_meal', 'delete_meal'],
      manager: ['create_user', 'delete_user', 'update_user', 'delete_user'],
      admin: ['user', 'manager'],
    },
  });

  await rbac.init();

  app.use(authorization.authorize(
    {
      bindToProperty: "user"
    }, function (req, done) {
      if (!req.isAuthenticated()) {
        done(false);
      } else {
        const authData = {roles: [], permissions: []};
        authData.roles = req.user.roles.map(function (r) {
          return r.name;
        });
        authData.permissions = req.user.permissions.map(function (p) {
          return p.name;
        });
        done(authData);
      }
    }
  ));
}
