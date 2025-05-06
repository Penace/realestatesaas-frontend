// src/utils/imageUpload.js

/**
 * Optimize image file name and upload to backend
 * @ param {File[]} files - array of File objects
 * @ returns {Promise<string[]>} - array of uploaded image URLs
 */
export async function optimizeAndUploadImages(files) {
  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    const ext = file.name.split(".").pop();
    const name = file.name.split(".")[0].replace(/\s+/g, "-").toLowerCase();
    const timestamp = Date.now();
    const newFileName = `${name}-${timestamp}.${ext}`;
    const renamedFile = new File([file], newFileName, { type: file.type });

    formData.append("images", renamedFile);

    const res = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const { url } = await res.json();
    uploadedUrls.push(url);
  }

  return uploadedUrls;
}
