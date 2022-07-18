import * as cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: "lucasbas123",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export { cloudinary };
