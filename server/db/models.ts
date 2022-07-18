import { Auth } from "./models/auth";
import { User } from "./models/user";
import { Pet } from "./models/pet";

User.hasMany(Pet);
Pet.belongsTo(User);
User.hasOne(Auth);
Auth.belongsTo(User);

export { User, Auth, Pet };
