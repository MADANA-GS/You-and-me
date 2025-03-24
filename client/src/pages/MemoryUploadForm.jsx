import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiUpload,
  FiPlus,
  FiX,
  FiCalendar,
  FiMessageCircle,
  FiMaximize,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



const MemoryUploadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    thumbnailImage: "",
  });


  const [images, setImages] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/media/upload`,
        formDataForUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      return response.data.data; // Return the Cloudinary response data
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));

      try {
        const cloudinaryData = await uploadToCloudinary(file);
        // Store just the secure_url as a string
        setFormData({
          ...formData,
          thumbnailImage: cloudinaryData.secure_url,
        });
      } catch (error) {
        alert("Failed to upload thumbnail. Please try again.");
        setThumbnailPreview(null);
      }
    }
  };

  // Handle image uploads
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const preview = URL.createObjectURL(file);

      try {
        // Add placeholder while uploading
        const newImageIndex = images.length;
        setImages([
          ...images,
          {
            image: file,
            preview: preview,
            message: "",
            isUploading: true,
          },
        ]);

        // Upload to Cloudinary
        const cloudinaryData = await uploadToCloudinary(file);

        // Update with Cloudinary data
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[newImageIndex] = {
            image: cloudinaryData.secure_url, // Store just the URL
            preview: preview,
            message: "",
            isUploading: false,
            cloudinaryData: cloudinaryData, // Keep full data for reference if needed
          };
          return updatedImages;
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        // Remove failed upload
        setImages((prevImages) =>
          prevImages.filter((img) => img.preview !== preview)
        );
        URL.revokeObjectURL(preview);
        alert("Failed to upload one or more images. Please try again.");
      }
    }
  };

  // Handle message updates for an image
  const updateImageMessage = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index].message = value;
    setImages(updatedImages);
  };

  // Remove an image
  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(images.filter((_, i) => i !== index));
  };

  // Open image in modal
  const openImageModal = (image) => {
    setModalImage(image);
  };

  // Close modal
  const closeModal = () => {
    setModalImage(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Prepare data for API
      const memoryData = {
        title: formData.title,
        date: formData.date,
        description: formData.description,
        thumbnailImage: formData.thumbnailImage,
        images: images.map((img) => ({
          image: img.image, // Use the secure_url that was stored
          message: img.message || "",
        })),
      };

      console.log("Memory data to submit:", memoryData);

      // Send data to your memory API endpoint
      const response = await axios.post(
       ` ${import.meta.env.VITE_BACKEND}/memory`,
        memoryData
      );

      console.log("Memory created:", response.data);
      setSubmitSuccess(true);

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/memory");
      }, 1500);
    } catch (error) {
      console.error("Error submitting memory:", error);
      alert(
        `Failed to save memory: ${
          error.response?.data?.message || "Please try again"
        }`
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Back Button */}
      <Link
        to="/memory"
        className="text-sm text-gray-400 hover:text-white flex items-center mb-6"
      >
        <FiChevronLeft className="mr-1" />
        Back to all memories
      </Link>

      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Form Header */}
        <h1 className="text-3xl font-bold">Create New Memory</h1>
        <p className="text-gray-400 mt-2 mb-6">Save the moments that matter.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail Upload - Moved to top */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="text-lg font-medium text-white">
                Thumbnail Image
              </label>
              <label
                htmlFor="thumbnailUpload"
                className="bg-white text-black text-sm px-6 py-2 rounded-md hover:bg-gray-200 cursor-pointer inline-block font-semibold transition flex items-center"
              >
                <FiUpload className="mr-2" />
                Upload Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnailUpload"
                required
              />
            </div>

            {thumbnailPreview ? (
              <div className="relative rounded-md overflow-hidden border border-gray-700">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  className="w-full h-72 md:h-80 object-contain bg-gray-800 cursor-pointer"
                  onClick={() => openImageModal({ preview: thumbnailPreview })}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      openImageModal({ preview: thumbnailPreview })
                    }
                    className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                  >
                    <FiMaximize className="text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview(null);
                      setFormData({ ...formData, thumbnailImage: "" });
                    }}
                    className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                  >
                    <FiX className="text-white" />
                  </button>
                </div>
                {formData.thumbnailImage ? (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-green-400">
                    Uploaded successfully
                  </div>
                ) : (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-yellow-400">
                    Uploading... {uploadProgress}%
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-700 rounded-md p-8 text-center h-48">
                <FiUpload className="mx-auto text-3xl text-gray-500 mb-2" />
                <p className="text-gray-400">No thumbnail selected yet</p>
                <p className="text-xs text-gray-500 mt-2">
                  Click the upload button above
                </p>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="text-sm text-gray-300">Memory Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-white mt-1"
              placeholder="e.g., My Birthday Party"
              required
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="text-sm text-gray-300">Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-white mt-1"
                required
              />
              <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/4 text-gray-400" />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-white mt-1"
              rows="4"
              placeholder="Tell the story behind this memory..."
              required
            />
          </div>

          {/* Additional Images Section - Always visible */}
          <div className="space-y-4 border-t border-gray-800 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">Additional Images</h3>
              <label
                htmlFor="imagesUpload"
                className="bg-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer inline-flex items-center"
              >
                <FiPlus className="mr-1" /> Add Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
                className="hidden"
                id="imagesUpload"
              />
            </div>

            {/* Uploaded Images Preview */}
            {images.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Images selected: {images.length}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-md">
                      <div className="relative">
                        <div
                          className="h-48 md:h-56 overflow-hidden rounded-md cursor-pointer"
                          onClick={() => openImageModal(img)}
                        >
                          <img
                            src={img.preview}
                            alt="Preview"
                            className="w-full h-full object-contain bg-gray-800"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            type="button"
                            onClick={() => openImageModal(img)}
                            className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                          >
                            <FiMaximize className="text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                          >
                            <FiX className="text-white" />
                          </button>
                        </div>
                        {img.isUploading ? (
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-yellow-400">
                            Uploading...
                          </div>
                        ) : img.image ? (
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-green-400">
                            Uploaded successfully
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center">
                          <FiMessageCircle className="text-gray-400 mr-2 flex-shrink-0" />
                          <input
                            type="text"
                            value={img.message}
                            onChange={(e) =>
                              updateImageMessage(index, e.target.value)
                            }
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                            placeholder="Add a caption..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-700 rounded-md p-8 text-center">
                <FiPlus className="mx-auto text-3xl text-gray-500 mb-2" />
                <p className="text-gray-400">No additional images yet</p>
                <p className="text-xs text-gray-500 mt-2">
                  Click the add images button above
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.thumbnailImage ||
              images.some((img) => img.isUploading)
            }
            className={`w-full p-3 font-semibold rounded-md transition ${
              isSubmitting ||
              submitSuccess ||
              !formData.thumbnailImage ||
              images.some((img) => img.isUploading)
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {isSubmitting
              ? "Saving memory..."
              : submitSuccess
              ? "Memory Saved!"
              : "Save Memory"}
          </button>
        </form>
      </motion.div>

      {/* Modal View for Images */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex justify-end p-2">
                <button
                  className="bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                  onClick={closeModal}
                >
                  <FiX className="text-white text-xl" />
                </button>
              </div>
              <div className="p-2 h-full">
                <img
                  src={modalImage.preview}
                  alt="Preview"
                  className="max-h-full h-auto max-w-full mx-auto object-contain"
                />
              </div>
              {modalImage.message && (
                <div className="p-4 border-t border-gray-800">
                  <p className="text-gray-300">{modalImage.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryUploadForm;
