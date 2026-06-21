const cloudinary = require("../config/cloudinary");
// extracts the public ID from a Cloudinary URL.
// https://res.cloudinary.com/dfpg6ti6c/video/upload/v1780827069/lessons/nchnmwvxkwqrnbolnnam.mp4
const extractPublicId = (url) => {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  const parts = url.split("?")[0].split("/");
  // finds the index of the version part in the URL. like v1692534400
  const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));

  const publicIdParts =
    versionIndex !== -1
      ? parts.slice(versionIndex + 1)
      : parts
          .slice(parts.indexOf("upload") + 1)
          .filter((part) => !part.includes(","));

  if (publicIdParts.length === 0) return null;

  const lastIndex = publicIdParts.length - 1;
  const lastPart = publicIdParts[lastIndex];
  const dotIndex = lastPart.lastIndexOf(".");
  if (dotIndex !== -1) {
    publicIdParts[lastIndex] = lastPart.slice(0, dotIndex);
  }

  return publicIdParts.join("/");
};

const getResourceType = (url) =>
  url.includes("/video/upload/") ? "video" : "image";

const destroyFromUrl = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, {
    resource_type: getResourceType(url),
  });
};

module.exports = {
  extractPublicId,
  destroyFromUrl,
};
