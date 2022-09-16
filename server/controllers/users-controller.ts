import { User, Auth } from "../db/models";
import { cloudinary } from "../lib/cloudinary";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { sgMail } from "../lib/sendgrind";

export async function createProfile(name: string, bio: string, image: string) {
	const newUserProfile = await User.create({
		fullName: name,
		bio: bio,
		image:
			image ||
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT506ZsK-eVOupbaeHAVgjVepudA8vXWC6t6exzvdIHXjCmNF-GhCgGMSrYb6H1jk3qzLc&usqp=CAU",
	});
	return newUserProfile;
}

function getSHA256ofJSON(text: string) {
	return crypto.createHash("sha256").update(JSON.stringify(text)).digest("hex");
}
//BUSCAR USUARIO POR EMAIL
export async function findUserByEmail(email: string) {
	const user = await User.findOne({
		where: {
			email: email,
		},
	});
	return user;
}
const SECRET = process.env.SECRET;

//SE CREA EL USUARIO Y SU AUTH//
export async function signUp(
	email: string,
	fullName: string,
	password: string
) {
	const [user, created] = await User.findOrCreate({
		where: { email },
		defaults: {
			fullName,
			email,
		},
	});
	const [auth, authCreated] = await Auth.findOrCreate({
		where: { user_id: user.get("id") },
		defaults: {
			email,
			password: getSHA256ofJSON(password),
			user_id: user.get("id"),
			userId: user.get("id"),
		},
	});
	return user;
}
//SE CREA EL TOKEN
export async function signIn(email: string, password: string) {
	const passwordHashed = getSHA256ofJSON(password);
	const auth = await Auth.findOne({
		where: { email: email, password: passwordHashed },
	});
	if (auth === null) {
		console.log("Not found!");
		return { error: "email or password incorrect" };
	} else {
		const token = await jwt.sign({ id: auth.get("userId") }, SECRET);

		console.log(auth instanceof Auth); // true
		console.log(auth); // 'My Title'
		return { token: token };
	}
}

//CAMBIAR CONTRASEÑA
export async function changePassword(password, userId) {
	const newPassword = password;
	const authById = await Auth.findByPk(userId);
	const passwordHashed = getSHA256ofJSON(newPassword);
	const passwordChange = await authById.update({ password: passwordHashed });
	return passwordChange;
}

//RECUPERAR CONTRASEÑA POR EMAIL
export async function recoverPassword(email) {
	const account = await Auth.findOne({
		where: {
			email: email,
		},
	});
	if (account == null) {
		console.log("invalido");
		return "Email invalido";
	} else {
		const newPassword = Math.floor(Math.random() * 100000).toString();
		const newPasswordHashed = getSHA256ofJSON(newPassword);
		console.log(newPassword);

		console.log(newPasswordHashed);

		account.update({ password: newPasswordHashed });
		const msg = {
			to: email, // Change to your recipient
			from: "lucaasbastidas@hotmail.com", // Change to your verified sender
			subject: "Recuperar contraseña",
			text: "Recuperar contraseña",
			html: `<h1>Tu nueva contraseña.</h1>
                  <strong>Esta es tu nueva contraseña.</strong><br>
                  <br>
                  <strong>contraseña: ${newPassword}</strong><br>
                  <br>
                  <strong>Una vez que inicies sesión puedes cambiarla.</strong>
                     `,
		};
		const sendEmail = await (sgMail as any).send(msg);
		return "valido";
	}
}
//MODIFICAR DATOS DEL USER
export async function updateUser(
	userId: number,
	fullName?: string,
	email?: string,
	telephone_number?: number
) {
	const user = await User.findByPk(userId);
	const updateUser = await user.update({
		fullName,
		email,
		telephone_number,
	});
	return updateUser;
}

export async function uploadOnCloudinary(urlData: string, imageName: string) {
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
