import { sequelize } from "./db/connection";
import { User, Auth, Pet } from "./db/models";
import { petsIndex } from "./lib/algolia";
import * as cors from "cors";
import "dotenv/config";
import {
	findUserByEmail,
	signUp,
	signIn,
	updateUser,
	changePassword,
	recoverPassword,
} from "./controllers/users-controller";
import {
	createNewPet,
	updatePet,
	searchPetByCoordenate,
	sendPetReportEmail,
	searchPetsByUserId,
} from "./controllers/pets-controller";
import { middelwareAuth, bodyToIndex } from "./middlewares/middlewares";
import * as crypto from "crypto";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { json, where } from "sequelize/types";

(async function main() {
	function getSHA256ofJSON(text: string) {
		return crypto
			.createHash("sha256")
			.update(JSON.stringify(text))
			.digest("hex");
	}
	const app = express();

	app.use(cors());

	const port = process.env.PORT || 3000;
	// console.log("hola", process.env)//
	const SECRET = process.env.SECRET;

	app.use(express.json({ limit: "75mb" }));
	app.use(express.static("dist"));

	app.listen(port, () => {
		console.log("corriendo en el puerto: ", port);
	});

	app.get("/test", function (req, res) {
		res.json({ prueba: "hola" });
	});

	//EMAIL-CHECK
	app.post("/email-check", async function (req, res) {
		const email = req.body.email;
		const user = await findUserByEmail(email);
		res.json({ user: user });
	});

	//FIND EMAIL BY ID/
	app.post("/users", async function (req, res) {
		const id = req.body.id;
		const user = await User.findByPk(id);
		console.log(id);
		res.json({ email: (user as any).email });
	});

	//PRUEBA/
	app.get("/find-user/:id", async function (req, res) {
		const id = req.params.id;
		const user = await User.findByPk(id);
		console.log(id);
		res.json({ email: (user as any).email });
	});

	//SIGNUP
	app.post("/auth", async function (req, res) {
		const userData = req.body;
		const newUser = await signUp(
			userData.email,
			userData.fullName,
			userData.password
		);
		res.json(newUser);
	});

	//SIGNIN
	app.post("/auth/token", async function (req, res) {
		const { email, password } = req.body;
		const auth = await signIn(email, password);
		res.json(auth);
	});

	app.post("/me", middelwareAuth, async (req, res) => {
		const userId = req.userData.id;
		const user = await User.findByPk(userId);
		res.json(user);
	});

	//ACTUALIZAR MIS DATOS
	app.patch("/me/update", middelwareAuth, async (req, res) => {
		const { fullName, email, telephone_number } = req.body;
		const userId = req.userData.id;
		const userUpdate = await updateUser(
			userId,
			fullName,
			email,
			telephone_number
		);
		res.json(userUpdate);
	});

	//CHANGE PASSWORD//
	app.patch("/auth/change-password", middelwareAuth, async (req, res) => {
		const userId = req.userData.id;
		const newPassword = req.body.password;
		const passwordChange = await changePassword(newPassword, userId);
		res.json(passwordChange);
	});

	//RECOVER PASSWORD//
	app.post("/recover-password", async function (req, res) {
		const data = req.body;

		const respuesta = await recoverPassword(data.email);

		res.json({ respuesta });
	});

	// NEW PET
	app.post("/pets", middelwareAuth, async (req, res) => {
		const userId = req.userData.id;
		const petData = req.body;
		const newPet = await createNewPet(
			userId,
			petData.name,
			petData.description,
			petData.lost,
			petData.imageUrl,
			petData.ubication,
			petData.lat,
			petData.lng
		);
		res.json({ ok: true });
	});

	//GET ALL PETS
	app.get("/pets", async function (req, res) {
		const pets = await Pet.findAll();
		const indexItem = bodyToIndex(req.body, req.params.id);
		res.json(pets);
	});

	//UPDATE PET BY ID
	app.patch("/me/pets", middelwareAuth, async function (req, res) {
		const updatedPet = await updatePet(req.body, req.query.id);
		res.json(updatedPet);
	});

	//SEARCH PETS BY COORDENATES
	app.get("/pets-close-to", async function (req, res) {
		const lat = req.query.lat;
		const lng = req.query.lng;
		const petsClose = await searchPetByCoordenate(lat, lng);
		res.json(petsClose);
	});

	//SEARCH PETS BY USERID
	app.get("/me/pets", middelwareAuth, async function (req, res) {
		const userId = req.userData.id;
		const petsFound = await searchPetsByUserId(userId);
		res.json(petsFound);
	});

	//DELETE PET
	app.delete("/me/pets", middelwareAuth, async function (req, res) {
		const petId = req.query.id;
		const pet = await Pet.findByPk(petId);
		const deletePet = await pet.destroy();
		const deletePetAlgolia = await petsIndex.deleteObject(petId);
		res.json({ deletePet, deletePetAlgolia });
	});

	//SEND EMAIL-PET-REPORT
	app.post("/send-email", async function (req, res) {
		const data = req.body;
		const sendEmail = await sendPetReportEmail(
			data.name,
			data.tel,
			data.message,
			data.email,
			data.petName
		);
		res.json({ report: "sent", sendEmail });
	});
})();
