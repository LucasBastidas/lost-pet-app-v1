import { Sequelize } from "sequelize";
import "dotenv/config";
export const sequelize = new Sequelize({
	dialect: "postgres",
	username: process.env.SEQUALIZE_USERNAME,
	password: process.env.SEQUALIZE_PASSWORD,
	database: process.env.SEQUALIZE_DATABASE,
	port: 5432,
	host: process.env.SEQUALIZE_HOST,
	ssl: true,
	// esto es necesario para que corra correctamente
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});
sequelize.authenticate();
