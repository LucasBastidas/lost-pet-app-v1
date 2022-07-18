import size from "lodash/size";
import { Router } from "@vaadin/router";
import * as crypto from "crypto";
import mapboxgl = require("mapbox-gl");

const state = {
	data: {
		myLat: "",
		myLng: "",
		myEmail: "",
		myName: "",
		password: "",
		token: "",
		recoverPasswordCheck: 3,
		logged: 0, //1 SIGNIFICA QUE ESTOY LOGEADO
		register: 3,
		completedMessage: "",
		go: "", //myData || myReports || reportPet
		telephone_number: "",
		newPetName: "", //NOMBRE DE LA MASCOTA QUE SE REPORTARA
		newPetDescription: "", //DESCRIPCION DE LA MASCOTA QUE SE REPORTARA
		newPetLat: "", //LAT DE LA MASCOTA QUE SE REPORTARA
		newPetLng: "", //LNG DE LA MASCOTA QUE SE REPORTARA
		newPetUrlImage: "", //IMAGEN URL DE LA MASCOTA QUE SE REPORTARA
		myPets: [],
		myPetUpdateData: {
			id: 0,
			name: "",
			imageUrl: "",
			description: "",
		},
		lostState: "",
		nearbyPets: [],
		petReportId: "",
		petReportMessage: "",
		petReportUserId: "",
		petReportName: "",
		petReportEmail: "",
	},
	listeners: [],
	getState() {
		return this.data;
	},

	//SETEA MI UBICACIÓN EN EL STATE
	async setMyLoc(callback) {
		function success(pos) {
			var crd = pos.coords;

			const lat = crd.latitude;
			const lng = crd.longitude;
			const currentState = state.data;
			currentState.myLat = lat;
			currentState.myLng = lng;
			state.setState(currentState);
			callback();
		}

		navigator.geolocation.getCurrentPosition(success);
	},
	//BUSCA MASCOTAS CERCANAS
	async searchNearbyPets(callback) {
		const lat = this.data.myLat;
		const lng = this.data.myLng;
		const currentState = this.data;

		const search = await fetch("/pets-close-to?lat=" + lat + "&lng=" + lng);
		const data = await search.json();
		for (const pet of data) {
			currentState.nearbyPets.push(pet);
			this.setState(currentState);
		}
		callback();
	},

	//SETEA MIS REPORTS
	async getMyReportPets(callback) {
		state.data.myPets = []; //SIEMPRE VACIA EL ARRAY PARA QUE NO HAYA DUPLICADOS
		const currentState = this.data;
		const myPets = await fetch("/pets/by-user-id", {
			headers: {
				"content-type": "application/json",
				authorization: "bearer " + this.data.token,
			},
		});
		const data = await myPets.json();
		for (const pet of data) {
			currentState.myPets.push(pet);
			this.setState(currentState);
			// console.log(pet);
		}
		callback();
	},

	//SETEA ID DE LA MASCOTA Y EL USER QUE LA REPORTO COMO PERDIDA
	setReportPetData(userId: number, petId: number, petName: string, callback) {
		this.data.petReportId = petId;
		this.data.petReportUserId = userId;
		this.data.petReportName = petName;

		callback();
	},

	//SETEA ID DE LA MASCOTA Y EL USER QUE LA REPORTO COMO PERDIDA
	setMyNameTelAndMessage(name: string, tel: number, message: string, callback) {
		this.data.myName = name;
		this.data.telephone_number = tel;
		this.data.petReportMessage = message;
		callback();
	},

	//SETEA EMAIL PARA ENVIAR REPORTE
	async setReportPetEmail(callback) {
		const user = await fetch("/users", {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				id: this.data.petReportUserId,
			}),
		});
		const userData = await user.json();
		this.data.petReportEmail = userData.email;
		callback();
	},

	//ENVIA EL EMAIL DE REPORTE AL PROPIETARIO DE LA MASCOTA
	async sendReportPetEmail(callback) {
		const emailReport = await fetch("/send-email", {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: this.data.myName,
				tel: this.data.telephone_number,
				message: this.data.petReportMessage,
				petName: this.data.petReportName,
				email: this.data.petReportEmail,
			}),
		});
		const emailReportData = await emailReport.json();
		// console.log(emailReportData);
		callback();
	},

	//SETEA EMAIL DEL USUARIO QUE QUIERE LOGEARSE O REGISTRARSE
	setMyEmail(email, callback) {
		this.data.myEmail = email;
		callback();
	},
	//CHECK-USER-EMAIL (CHEKEA SI EL EMAIL ESTA REGISTRADO)
	async checkUserEmail(callback) {
		const emailCheck = await fetch("/email-check", {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				email: this.data.myEmail,
			}),
		});
		const data = await emailCheck.json();
		// console.log(data);
		if (data.user === null) {
			this.data.register = 0;
		} else {
			this.data.register = 1;
		}
		callback();
	},

	//SETEA NAME PARA REGISTRARSE
	setMyNameForRegister(name: string, callback) {
		this.data.myName = name;
		callback();
	},

	//SETEA EL PATH DEL MENU
	setPathMenu(path: "myData" | "myReports" | "reportPet", callback) {
		state.data.go = path;
		callback();
	},

	//SETEA PASSWORD EN EL STATE MODIFICAR Y GUARDARLO HASHEADO
	setHashedPassword(password, callback) {
		this.data.password = password;
		callback();
	},

	//SIGNUP
	async signUp(password, callback) {
		const authSignUp = await fetch("/auth", {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				email: this.data.myEmail,
				fullName: this.data.myName,
				password: password,
			}),
		});
		const data = await authSignUp.json();
		// console.log(data);
		callback();
	},

	//OBTENGO MI TOKEN
	async getToken(password, callback) {
		const token = await fetch("/auth/token", {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				email: this.data.myEmail,
				password: password,
			}),
		});
		const tokenData = await token.json();
		// console.log(tokenData.token);
		this.data.token = tokenData.token;
		callback();
	},

	//SETEA QUE ESTOY LOGEADO
	setLogged(callback) {
		// console.log("te logeaste");
		state.data.logged = 1;
		callback();
	},

	//CAMBIAR EL NOMBRE EN DB
	async updateName(newName: string, callback) {
		const nameChange = await fetch("/me/update", {
			method: "PATCH",
			headers: {
				"content-type": "application/json",
				authorization: "bearer " + this.data.token,
			},
			body: JSON.stringify({
				fullName: newName,
			}),
		});
		const data = await nameChange.json();
		// console.log(data);
		callback();
	},

	//CAMBIAR PASSWORD
	async updatePassword(newPassword: string, callback) {
		const passwordChanged = await fetch("/auth/change-password", {
			method: "PATCH",
			headers: {
				"content-type": "application/json",
				authorization: "bearer " + this.data.token,
			},
			body: JSON.stringify({
				password: newPassword,
			}),
		});
		const data = await passwordChanged.json();
		// console.log(data);
		callback();
	},

	//RECUPERAR CONTRASEÑA
	async recoverPassword(callback) {
		const recoverPassword = await fetch("/recover-password", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				email: this.data.myEmail,
			}),
		});
		const data = await recoverPassword.json();
		// console.log(data);
		if (data.respuesta == "Email invalido") {
			state.data.recoverPasswordCheck = 0;
			callback();
		} else if (data.respuesta == "valido") {
			state.data.recoverPasswordCheck = 1;
			callback();
		}
	},

	//SETEA LOS DATOS DE LA MASCOTA QUE SE VA A POSTEAR
	setPostPetData(
		name: string,
		description: string,
		imageUrl: string,
		lat: number,
		lng: number,
		callback
	) {
		(this.data.newPetName = name),
			(this.data.newPetDescription = description),
			(this.data.newPetUrlImage = imageUrl),
			(this.data.newPetLat = lat),
			(this.data.newPetLng = lng);
		callback();
	},

	//POSTEA UN NUEVO REPORTE DE MASCOTA
	async postNewReport(callback) {
		const newReportPet = await fetch("/pets", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: "bearer " + this.data.token,
			},
			body: JSON.stringify({
				name: this.data.newPetName,
				lost: true,
				description: this.data.newPetDescription,
				imageUrl: this.data.newPetUrlImage,
				lat: this.data.newPetLat,
				lng: this.data.newPetLng,
			}),
		});
		// console.log(newReportPet);
		callback();
	},

	//SETEA ID DEL PET A MODIFICAR
	setPetIdToUpdate(id: number, callback) {
		state.data.myPetUpdateData.id = id;
		callback();
	},

	//SETEA NOMBRE DEL PET A MODIFICAR
	setPetDataToUpdate(name, description, imageUrl, callback) {
		state.data.myPetUpdateData.name = name;
		state.data.myPetUpdateData.description = description;
		state.data.myPetUpdateData.imageUrl = imageUrl;
		callback();
	},

	//MODIFICA LOS DATOS DE LA MASCOTA EN LA DB
	async updateDataOfMyReportedPet(callback) {
		const newReportPet = await fetch(
			"/me/pets?id=" + state.data.myPetUpdateData.id,
			{
				method: "PATCH",
				headers: {
					"content-type": "application/json",
					authorization: "bearer " + this.data.token,
				},

				body: JSON.stringify({
					name: state.data.myPetUpdateData.name,
					description: state.data.myPetUpdateData.description,
					imageUrl: state.data.myPetUpdateData.imageUrl,
				}),
			}
		);
		callback();
	},

	//SETEA EL NUEVO LOST STATE DE LA MASCOTA PUBLICADA
	setNewLostState(newStateLost: "lost" | "found", callback) {
		this.data.lostState = newStateLost;
		callback();
	},

	//CAMBIA A LA MASCOTA A: "ENCONTRADA"
	async changeStateOfReportToFounded(petId, callback) {
		const newReportPet = await fetch("/me/pets?id=" + petId, {
			method: "PATCH",
			headers: {
				"content-type": "application/json",
				authorization: "bearer " + this.data.token,
			},

			body: JSON.stringify({
				lost: "false",
			}),
		});
		// console.log(newReportPet);

		callback();
	},

	//ELIMINA LA PUBLICACIÓN Y LA MASCOTA DE LA DB
	async deletePet(petId, callback) {
		const deletePet = await fetch("/me/pets?id=" + petId, {
			method: "DELETE",
			headers: {
				"content-type": "application/json",
				authorization: "bearer " + this.data.token,
			},
		});
		callback();
	},
	setCompleteTaskMessage(text: 1 | 2 | 3, callback) {
		if (text == 1) {
			this.data.completedMessage = "La publicación se eliminó con exito!";
		} else if (text == 2) {
			this.data.completedMessage = "Ahora tu mascota aparece como encontrada!";
		} else if (text == 3) {
			this.data.completedMessage = "Se modificaron los datos de tu mascota";
		}
		callback();
	},
	//RESETEAR STATE
	resetState(callback) {
		var currentState = state.getState();
		currentState = {
			myLat: "",
			myLng: "",
			myEmail: "",
			myName: "",
			password: "",
			token: "",
			logged: 0,
			register: 3,
			completedMessage: "",
			go: "",
			telephone_number: "",
			newPetName: "",
			newPetDescription: "",
			newPetLat: "",
			newPetLng: "",
			newPetUrlImage: "",
			myPets: [],
			myPetUpdateData: {
				id: 0,
				name: "",
				imageUrl: "",
				description: "",
			},
			lostState: "",
			nearbyPets: [],
			petReportId: "",
			petReportMessage: "",
			petReportUserId: "",
			petReportName: "",
			petReportEmail: "",
		};
		this.setState(currentState);
		callback();
	},

	setState(newState) {
		this.data = newState;
		for (const cb of this.listeners) {
			cb();
		}
		// console.log("soy el state he cambiado", this.data);
	},
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},
};

export { state };
