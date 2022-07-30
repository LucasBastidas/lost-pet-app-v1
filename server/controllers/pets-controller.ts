import { User, Auth, Pet } from "../db/models";
import { cloudinary } from "../lib/cloudinary";
import { petsIndex } from "../lib/algolia";
import { bodyToIndex } from "../middlewares/middlewares";
import { sgMail } from "../lib/sendgrind";

async function uploadOnCloudinary(urlData: string, imageName: string) {
	const urlImage = await cloudinary.v2.uploader.upload(
		urlData,
		{ public_id: imageName + "image" + Math.random() },
		function (error, result) {
			return result.secure_url;
		}
	);
	// console.log("soy urlImage:", urlImage);
	return urlImage.secure_url;
}
//CREA UNA PET
export async function createNewPet(
	userId: number,
	petName: string,
	petDescription: string,
	lostState: boolean,
	imageUrl: string,
	ubication: string,
	lat: number,
	lng: number
) {
	const newUrl = await uploadOnCloudinary(imageUrl, petName);

	const newPet = await Pet.create({
		name: petName,
		description: petDescription,
		lost: lostState,
		imageUrl: newUrl,
		lat,
		lng,
		user_id: userId,
		userId: userId,
		ubication: ubication,
	});
	const algoliaRes = await petsIndex.saveObject({
		objectID: newPet.get("id"),
		name: newPet.get("name"),
		user_id: newPet.get("user_id"),
		category: newPet.get("category"),
		imageUrl: newPet.get("imageUrl"),
		description: newPet.get("description"),
		ubication: newPet.get("ubication"),
		lost: newPet.get("lost"),
		_geoloc: {
			lat: newPet.get("lat"),
			lng: newPet.get("lng"),
		},
	});
	return newPet;
}

//MODIFICAR UNA PET
export async function updatePet(data: object, id: number) {
	if (data["lost"] === "true") {
		data["lost"] = true;
	}
	if (data["lost"] === "false") {
		data["lost"] = false;
	}
	if (data["imageUrl"]) {
		const imageUrl = await uploadOnCloudinary(
			data["imageUrl"],
			data["name"] || "petLostImage"
		);
		data["imageUrl"] = imageUrl;
		const updatedPet = await Pet.update(data, {
			where: {
				id: id,
			},
		});
		const indexItem = bodyToIndex(data, id);
		const algoliaUpdate = await petsIndex
			.partialUpdateObject(indexItem)
			.catch((e) => {
				console.log(e);
			});
		return updatedPet;
	} else {
		const updatedPet = await Pet.update(data, {
			where: {
				id: id,
			},
		});
		if (data["lost"] === true) {
			data["lost"] = "true";
		}
		if (data["lost"] === false) {
			data["lost"] = "false";
		}

		const indexItem = bodyToIndex(data, id);
		const algoliaUpdate = await petsIndex
			.partialUpdateObject(indexItem)
			.catch((e) => {
				console.log(e);
			});

		return updatedPet;
	}
}

//BUSCAR PET EN POR COORDENADAS
export async function searchPetByCoordenate(lat: number, lng: number) {
	const latAndLng = `${lat},${lng}`;
	const algoliaRes = await petsIndex.search("", {
		aroundLatLng: latAndLng,
		aroundRadius: 50000,
	});

	return algoliaRes.hits;
}

//SEARCH PETS BY ID
export async function searchPetsByUserId(userId) {
	const petsByUserId = await Pet.findAll({
		where: {
			userId: userId,
		},
	});
	return petsByUserId;
}

//ENVIAR PET-REPORT-EMAIL
export async function sendPetReportEmail(
	remitentName: string,
	remitentTel: number,
	message: string,
	email: string,
	petName
) {
	const msg = {
		to: email, // Change to your recipient
		from: "lucaasbastidas@hotmail.com", // Change to your verified sender
		subject: "INFORMACIÓN SOBRE TU MASCOTA",
		text: "INFORMACIÓN SOBRE TU MASCOTA",
		html: `<h1>Reportaron información sobre ${petName}</h1>
					<strong>Nombre:${remitentName} </strong><br>
					<br>
					<strong>Telefono:${remitentTel}</strong><br>
					<br>
					<strong>datos: ${message}</strong>
						`,
	};
	const sendEmail = await (sgMail as any).send(msg);
	return sendEmail;
}
