import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";

export class Pet extends Model {}
Pet.init(
	{
		name: DataTypes.STRING,
		lost: DataTypes.BOOLEAN,
		lat: DataTypes.FLOAT,
		lng: DataTypes.FLOAT,
		description: DataTypes.STRING,
		imageUrl: DataTypes.STRING,
		user_id: DataTypes.INTEGER,
		user_email: DataTypes.STRING,
	},
	{ sequelize, modelName: "pet" }
);
