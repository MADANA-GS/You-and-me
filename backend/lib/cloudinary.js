import cloudinary from "cloudinary";

import dotenv from "dotenv";

dotenv.config();
import fs from "fs";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaTocloudinary = async (filepath) => {
  try {
    const response = await cloudinary.v2.uploader.upload(filepath, {
      resource_type: "image",
    });


    fs.unlink(filepath, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nDeleted file: " , filepath);
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary");
  }
};

const deleteMediaFromCloudinary = async (public_id) => {
  try {
    const response = await cloudinary.v2.uploader.destroy(public_id);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting from cloudinary");
  }
};

export { uploadMediaTocloudinary, deleteMediaFromCloudinary };
