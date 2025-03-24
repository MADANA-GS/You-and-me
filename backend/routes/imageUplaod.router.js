import express from "express";
import multer from "multer";
import { deleteMediaFromCloudinary, uploadMediaTocloudinary } from "../lib/cloudinary.js";


const uploadRouter = express.Router();

const upload = multer({ dest: "uploads/" });

uploadRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file.path;
    const response = await uploadMediaTocloudinary(file);
    res.status(200).json({
      message: "File uploaded successfully",
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error while uploading", success: false });
  }
});

uploadRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "File id is required", success: false });
    }
    const response = await deleteMediaFromCloudinary(id);
    res.status(200).json({
      message: "File deleted successfully",
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error whiel delting ", success: false });
  }
});

uploadRouter.post(
  "/bulkupload",
  upload.array("files", 10),
  async (req, res) => {
    try {
        const uploadPromiese = req.files.map(fileItem =>uploadMediaTocloudinary(fileItem.path));
        const result = await Promise.all(uploadPromiese);
        res.status(200).json({
            message: "Files uploaded successfully",
            success: true,
            data: result,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error while uploading bulk files", success: false });
        
    }
  }
);

export default uploadRouter;
