import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";

export class User extends Model {}
User.init(
	{
		fullName: DataTypes.STRING,
		email: DataTypes.STRING,
		telephone_number: DataTypes.INTEGER,
	},
	{ sequelize, modelName: "user" }
);
