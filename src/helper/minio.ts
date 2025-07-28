import { Client } from "minio";
// import logger from "./logger";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!, // No https://
  port: parseInt(process.env.MINIO_PORT!), // 443
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  region: "us-east-1", // 💡 this is REQUIRED
});

export const createUploadUrl = async (fileName: string, expireMins: number) => {
  try {
    const bucketName = process.env.MINIO_BUCKET!;
    const expirySeconds = expireMins * 60;
    const objectName = fileName;
    const signedUrl: string = await minioClient.presignedUrl(
      "PUT",
      bucketName,
      objectName,
      expirySeconds
    );

    const fileUrl = await getFileUrl(fileName, expireMins);
    return { upLoadUrl: signedUrl, fileUrl };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw new Error("Failed to generate upload URL");
  }
};

// export const getFileUrl = async (fileName: string, expireMins: number) => {
//   try {
//     const bucketName = process.env.MINIO_BUCKET!;
//     const objectName = fileName;
//     const expirySeconds = expireMins * 60;

//     const fileUrl = await minioClient.presignedUrl(
//       "GET",
//       bucketName,
//       objectName,
//       expirySeconds
//     );

//     return fileUrl;
//   } catch (error) {
//     console.log("error", error);
//     logger.info(`\n\nError IN Generating the View File Url \n\n`);
//     return Error;
//   }
// };

export const getFileUrl = async (
  fileName: string,
  expireMins: number
): Promise<string> => {
  try {
    const bucketName = process.env.MINIO_BUCKET!;
    const expirySeconds = expireMins * 60;

    const fileUrl = await minioClient.presignedUrl(
      "GET",
      bucketName,
      fileName,
      expirySeconds
    );

    return fileUrl;
  } catch (error) {
    console.log("Error generating view URL:", error);
    throw new Error("Failed to generate view file URL"); // ✅ throw an actual error
  }
};
