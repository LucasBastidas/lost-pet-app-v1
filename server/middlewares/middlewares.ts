import * as jwt from "jsonwebtoken";

export function middelwareAuth(req, res, next) {
	const SECRET = process.env.SECRET;
	const authorization = req.get("authorization");
	if (authorization) {
		const token = authorization.split(" ")[1];
		try {
			const data = jwt.verify(token, SECRET);
			req.userData = data;
			next();
		} catch (err) {
			console.log(err);
			res.status(401).json({ error: "error validating token" });
		}
	} else {
		res.status(401).json({ error: true });
	}
}
export function bodyToIndex(body, id?) {
	const respuesta: any = {};
	if (body.name) {
		respuesta.name = body.name;
	}
	if (body.lost) {
		respuesta.lost = body.lost;
	}
	if (body.description) {
		respuesta.description = body.description;
	}
	if (body.imageUrl) {
		respuesta.imageUrl = body.imageUrl;
	}
	if (body.lat && body.lng) {
		respuesta._geoloc = {
			lat: body.lat,
			lng: body.lng,
		};
	}
	if (body.ubication) {
		respuesta.ubication = body.ubication;
	}
	if (id) {
		respuesta.objectID = id;
	}
	return respuesta;
}
