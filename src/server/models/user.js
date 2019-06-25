import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import indexOf from 'lodash/indexOf';
import without from 'lodash/without';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  caloriesPerDay: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  permissions: [String],
}, {
  toObject: {virtuals: true},
});

userSchema.methods.can = async function (rbac, action, resource) {
  const permission = await rbac.getPermission(action, resource);
  if (!permission) return false;

  if (indexOf(this.permissions, permission.name) !== -1) return true;
  if (!this.role) return false;

  // check permission inside user role
  return rbac.can(this.role, action, resource);
};

userSchema.methods.addPermission = async function (rbac, action, resource) {
  const permission = await rbac.getPermission(action, resource);

  if (!permission) throw new Error('Permission not exists');
  if (indexOf(this.permissions, permission.name) !== -1) return this;

  this.permissions.push(permission.name);

  const user = await this.save();
  if (!user) throw new Error('User is undefined');

  return user;
};

userSchema.methods.removePermission = async function (permissionName) {
  if (indexOf(this.permissions, permissionName) === -1) return this;

  this.permissions = without(this.permissions, permissionName);

  const user = await this.save();
  if (!user) throw new Error('User is undefined');
  if (indexOf(user.permissions, permissionName) !== -1) throw new Error('Permission was not removed');

  return user;
};

userSchema.methods.hasRole = async function (rbac, role) {
  if (!this.role) return false;

  return rbac.hasRole(this.role, role);
};

userSchema.methods.setRole = async function (rbac, role) {
  if (this.role === role) return this;

  role = await rbac.getRole(role);

  if (!role) throw new Error('Role does not exists');

  this.role = role.name;

  const user = await this.save();
  if (!user) throw Error('User is undefined');

  return user;
};

userSchema.methods.removeRole = async function () {
  if (!this.role) return this;

  this.role = null;

  const user = await this.save();
  if (!user) return new Error('User is undefined');

  return user;
};

userSchema.plugin(passportLocalMongoose, {usernameField: 'email', usernameLowerCase: true});

mongoose.model('User', userSchema);

