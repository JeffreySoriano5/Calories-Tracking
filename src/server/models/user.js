import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import indexOf from 'lodash/indexOf';
import without from 'lodash/without';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  role: String,
  permissions: [String],
});

userSchema.methods.can = async function (rbac, action, resource) {
  // check existence of permission
  const permission = await rbac.getPermission(action, resource);

  if (!permission) return false;

  // check user additional permissions
  if (indexOf(this.permissions, permission.name) !== -1) return true;

  if (!this.role) return false;

  // check permission inside user role
  return rbac.can(this.role, action, resource);
};

userSchema.methods.addPermission = async function (rbac, action, resource) {
  const permission = rbac.getPermission(action, resource);

  if (!permission) return new Error('Permission not exists');
  if (indexOf(this.permissions, permission.name) !== -1) return new Error('Permission is already assigned');

  this.permissions.push(permission.name);

  const user = await this.save();

  if (!user) return new Error('User is undefined');

  return true;
};

userSchema.methods.removePermission = async function (permissionName) {
  if (indexOf(this.permissions, permissionName) === -1) return true;

  this.permissions = without(this.permissions, permissionName);

  const user = await this.save();
  if (!user) return new Error('User is undefined');

  if (indexOf(user.permissions, permissionName) !== -1) return new Error('Permission was not removed');

  return true;
};

userSchema.methods.hasRole = async function (rbac, role) {
  if (!this.role) return false;

  return rbac.hasRole(this.role, role);
};

userSchema.methods.setRole = async function (rbac, role) {
  if (this.roles === role) return true;

  role = rbac.getRole(role);

  if (!role) return new Error('Role does not exists');
  if (indexOf(this.roles, role.name) !== -1) return new Error('Role is already assigned');

  this.role = role.name;

  const user = await this.save();

  if (!user) return new Error('User is undefined');

  return true;
};

userSchema.methods.removeRole = async function () {
  if (!this.role) return true;

  this.role = null;

  const user = await this.save();
  if (!user) return new Error('User is undefined');

  return true;
};

userSchema.plugin(passportLocalMongoose, {usernameField: 'email', usernameLowerCase: true});

mongoose.model('User', userSchema);

