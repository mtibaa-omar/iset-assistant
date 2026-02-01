const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

export async function uploadToCloudinary(file, folder = "chat-files") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: formData });
  const data = await response.json();

  if (!response.ok) throw new Error(data?.error?.message || "Upload failed");

  console.log("Cloudinary:", {
    secure_url: data.secure_url,
    type: data.type,              
    resource_type: data.resource_type,
    access_mode: data.access_mode 
  });

  return { url: data.secure_url, publicId: data.public_id };
}

export async function deleteFromCloudinary(publicId) {
  // Note: Deletion requires backend API with signature
  console.log("Delete file:", publicId);
}
