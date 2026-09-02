const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const puppeteer = require("puppeteer");
const crypto = require("crypto");

const generateCertificateNumber = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `CERT-${Date.now()}-${random}`;
};

const generateCertificatePdf = async (data) => {
  const browser = await puppeteer.launch({
    headless: true, //This tells Puppeteer to run Chrome without displaying a browser window.
  });

  const page = await browser.newPage();

  await page.setContent(data.html);

  // convert page to pdf
  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true, //include colors
  });

  await browser.close();

  return pdf;
};

const buildHtmlEmail = (resetUrl) => {
  return `
    <p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email and your password will not be changed.</p>
  `;
};

const uploadFileToCloudinary = async (
  file,
  folder,
  publicId,
  resourceType,
  format,
) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type:
          resourceType ?? (file.mimetype.includes("video") ? "video" : "image"),
        folder: folder,
        ...(publicId && { public_id: publicId }),
        ...(format && { format }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(file).pipe(stream);
  });
  return { secure_url: result.secure_url, duration: result.duration };
};

const checkIfValidCoupon = (coupon) => {
  if (!coupon) return false;
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return false;
  }
  const now = new Date();
  if (!coupon.isActive || coupon.startDate > now || coupon.expiryDate < now) {
    return false;
  }
  return true;
};

module.exports = {
  buildHtmlEmail,
  uploadFileToCloudinary,
  checkIfValidCoupon,
  generateCertificatePdf,
  generateCertificateNumber,
};
