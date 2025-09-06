import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url: string) => {
  const matches = url.match(/\/upload\/.*\/([^/]+)\.pdf/i);
  return matches ? matches[1] : null;
};

const uploadPdfOnCloudinary = async (
  buffer: Buffer,
  fileName: string,
  folderName: string
) => {
  try {
    if (!buffer || !fileName) return null;

    // Stream the buffer directly to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `suvash-edu/${folderName}`,
          resource_type: "raw",
          access_mode: "authenticated",
          type: "private",
          public_id: `${fileName.split(".")[0]}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return null;
  }
};

const deletePdfFromCloudinary = async (
  url: string,
  folderName: string,
  resourceType: string = "raw"
) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      console.log("No valid public ID found in URL");
      return false;
    }

    const result = await cloudinary.uploader.destroy(
      `suvash-edu/${folderName}/${publicId}`,
      { resource_type: resourceType }
    );
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

export { deletePdfFromCloudinary, uploadPdfOnCloudinary };
