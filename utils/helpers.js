const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const buildHtmlEmail = (resetUrl) => {
  return `
    <p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email and your password will not be changed.</p>
  `;
};

const uploadFileToCloudinary = async (file, folder) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: file.mimetype.includes("video") ? "video" : "image",
        folder: folder,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
  return { secure_url: result.secure_url, duration: result.duration };
};

module.exports = {
  buildHtmlEmail,
  uploadFileToCloudinary,
};
