const Certificate = require("../models/certificate.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const {
  generateCertificateNumber,
  generateCertificatePdf,
  uploadFileToCloudinary,
} = require("../utils/helpers");
const certificateTemplate = require("../templates/certificate.template");
const Course = require("../models/course.model");

const createCertificateService = async ({ user, courseId }) => {
  // 1. Check existing certificate
  const existingCertificate = await Certificate.findOne({
    user: user._id,
    course: courseId,
  });

  if (existingCertificate) {
    return existingCertificate;
  }

  // 2. Generate certificate number
  const certificateNumber = generateCertificateNumber();

  const course = await Course.findById(courseId).populate({
    path: "user",
    select: "name",
  });
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }

  // 3. Generate HTML
  const html = certificateTemplate({
    userName: user.name,
    courseTitle: course.title,
    certificateNumber,
    issuedAt: new Date().toLocaleDateString(),
    instructorName: course.user.name,
  });

  // 4. Generate PDF
  const pdfBuffer = await generateCertificatePdf({
    html,
  });

  // Upload will go here
    const { secure_url: pdfUrl } = await uploadFileToCloudinary(
      pdfBuffer,
      "certificates",
      certificateNumber,
      "image",
    );
    if (!pdfUrl) {
      const error = new Error("Failed to upload certificate PDF");
      error.status = 500;
      throw error;
    }

  // 5. Save certificate
  const certificate = await Certificate.create({
    user: user._id,
    course: course._id,
    certificateNumber,
    certificateUrl: pdfUrl,
  });

  return certificate;
};

const getCertificateService = async (filter) => {
  const certificate = await Certificate.findOne(filter);
  if (!certificate) {
    const error = new Error("Certificate not found");
    error.status = 404;
    throw error;
  }
  return certificate;
};

module.exports = {
  createCertificateService,
  getCertificateService,
};
