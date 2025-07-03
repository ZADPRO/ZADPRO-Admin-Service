import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { generateFileName, generatePassword } from "../../helper/common";
import { Client } from "minio";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { generateTokenWithExpire } from "../../helper/token";

import { CurrentTime } from "../../helper/common";
import { createUploadUrl, getFileUrl } from "../../helper/minio";
import { getProductQuery } from "../user/query";

export class settingRepository {
  public async addBlogsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName, blogTitle, blogContent, blogImage, blogDate } =
        userData;

      const addBlogsQuery = `
      INSERT INTO "${refProductName}".blogTable (
        "blogTitle",
        "blogContent",
        "blogImage", 
        "blogDate",
        "createdAt",
        "createdBy"
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

      const result = await executeQuery(addBlogsQuery, [
        blogTitle,
        blogContent,
        blogImage,
        blogDate,
        CurrentTime(),
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "add Blogs successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Blogs",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async uploadBlogImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const filename = userData.fileName.split(".");
      const { productId } = userData;
      const getProduct = await executeQuery(getProductQuery, [productId]);
      const { refProductsName } = getProduct[0]; // ✅ fixed key

      console.log("filename", filename);

      const extention = filename[filename.length - 1];

      const generatedfilename = `${refProductsName}/${generateFileName()}.${extention}`;

      console.log("filename", filename);
      // Generate signed URL for uploading and file view
      const { upLoadUrl, fileUrl } = await createUploadUrl(
        generatedfilename,
        15
      ); // expires in 15 mins

      // Return success response
      return encrypt(
        {
          success: true,
          message: "blog Image Stored Successfully",
          token: tokens,
          uploadUrl: upLoadUrl,
          fileUrl: fileUrl,
          fileName: generatedfilename,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the Image",
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteBlogsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");
      const { refProductName, blogId } = userData;

      const deleteBlogsQuery = `
          UPDATE
        "${refProductName}"."blogtable"
         SET
        "isDelete" = true,
        "deletedAt" = $2,
        "deletedBy" = $3
       WHERE
      "blogId" = $1
     RETURNING
  *;
    `;

      const result = await client.query(deleteBlogsQuery, [
        blogId,
        CurrentTime(),
        tokendata.id,
      ]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "blog deleted successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during deleting blog",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateBlogsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const {
        blogId,
        refProductName,
        blogTitle,
        blogContent,
        blogImage,
        blogDate,
      } = userData;

      const updateBlogsQuery = `
      UPDATE "${refProductName}"."blogtable"
SET
  "blogTitle" = $1,
  "blogContent" = $2,
  "blogImage" = $3,
  "blogDate" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
WHERE
  "blogId" = $7
RETURNING *;

    `;

      const result = await executeQuery(updateBlogsQuery, [
        blogTitle,
        blogContent,
        blogImage,
        blogDate,
        CurrentTime(),
        tokendata.id,
        blogId,
      ]);

      return encrypt(
        {
          success: true,
          message: "add Blogs successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Blogs",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listBlogsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName } = userData;

      const listBlogsQuery = `
      SELECT
        *
    FROM
    "${refProductName}"."blogtable"
    WHERE
    "isDelete" IS NOT true
   `;
      const result = await executeQuery(listBlogsQuery);
      const blogs = result;

      // Enrich blogs with signed image URLs
      const expireMins = 15;

      const enrichedBlogs = await Promise.all(
        blogs.map(async (blog) => {
          let signedImageUrl: string | null = null;
          if (blog.blogImage) {
            try {
              // Assuming blogImage is something like: assets/blogs/filename.jpeg
              const fileName = blog.blogImage.split("/").pop();
              if (fileName) {
                signedImageUrl = await getFileUrl(fileName, expireMins);
              }
            } catch (err) {
              console.warn(
                `Failed to generate signed URL for blog ID ${blog.id}`,
                err
              );
            }
          }

          return {
            ...blog,
            signedImageUrl, // add the signed URL to the response
          };
        })
      );
      return encrypt(
        {
          success: true,
          message: "list Blogs successfully",
          token: tokens,
          result: result,
          image: enrichedBlogs,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Blogs",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  // ------------------------------------
  public async addAchievementsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const {
        refProductName,
        achievementTitle,
        achievementDescription,
        achievedOn,
      } = userData;

      const addAchievementsQuery = `
      INSERT INTO
  "${refProductName}"."achievements" (
    "achievementTitle",
    "achievementDescription",
    "achievedOn",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *;
    `;

      const result = await executeQuery(addAchievementsQuery, [
        achievementTitle,
        achievementDescription,
        achievedOn,
        CurrentTime(),
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "add Achievements successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Achievements",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateAchievementsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const {
        refProductName,
        achievementId,
        achievementTitle,
        achievementDescription,
        achievedOn,
      } = userData;

      const updateAchievementsQuery = `
  UPDATE
  "${refProductName}"."achievements"
SET
  "achievementTitle" = $1,
  "achievementDescription" = $2,
  "achievedOn" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
WHERE
  "achievementId" = $6
RETURNING
  *;
    `;

      const result = await executeQuery(updateAchievementsQuery, [
        achievementTitle,
        achievementDescription,
        achievedOn,
        CurrentTime(),
        tokendata.id,
        achievementId,
      ]);

      return encrypt(
        {
          success: true,
          message: "update Achievements successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during update  Achievements",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteAchievementsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");
      const { refProductName, achievementId } = userData;

      const deleteAchievementsQuery = `
     UPDATE
        "${refProductName}"."achievements"
         SET
        "isDelete" = true,
        "deletedAt" = $2,
        "deletedBy" = $3
       WHERE
      "achievementId" = $1
     RETURNING
  *;
    `;

      const result = await client.query(deleteAchievementsQuery, [
        achievementId,
        CurrentTime(),
        tokendata.id,
      ]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Achievements deleted successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during deleting Achievements",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listAchievementsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName } = userData;

      const listAchievementQuery = `
     SELECT
        *
    FROM
    "${refProductName}"."achievements"
    WHERE
    "isDelete" IS NOT true
   `;
      const result = await executeQuery(listAchievementQuery);
      console.log("result", result);

      return encrypt(
        {
          success: true,
          message: "list achievements successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list achievements",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  // --------------------------------------------------
  public async addReleaseV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName, version, notes, releaseDate } = userData;

      const addReleaseQuery = `
   INSERT INTO
  "${refProductName}"."newrelease" (
    "version",
    "notes",
    "releaseDate",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *;
    `;

      const result = await executeQuery(addReleaseQuery, [
        version,
        notes,
        releaseDate,
        CurrentTime(),
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "add Release successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Release",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateReleaseV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { releaseId, refProductName, version, notes, releaseDate } =
        userData;

      const updateReleaseQuery = `
  UPDATE
  "${refProductName}"."newrelease"
SET
  "version" = $1,
  "notes" = $2,
  "releaseDate" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
WHERE
  "releaseId" = $6
RETURNING
  *;
    `;

      const result = await executeQuery(updateReleaseQuery, [
        version,
        notes,
        releaseDate,
        CurrentTime(),
        tokendata.id,
        releaseId,
      ]);

      return encrypt(
        {
          success: true,
          message: "update Release successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during update Release",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteReleaseV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");
      const { refProductName, releaseId } = userData;

      const deleteReleaseQuery = `
UPDATE
  "${refProductName}"."newrelease"
SET
  "isDelete" = true,
  "deletedAt" = $2,
        "deletedBy" = $3
WHERE
  "releaseId" = $1
RETURNING
  *;
    `;

      const result = await client.query(deleteReleaseQuery, [
        releaseId,
        CurrentTime(),
        tokendata.id,
      ]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Release deleted successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during deleting Release",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listReleaseV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName } = userData;

      const listReleaseQuery = `
    SELECT
        *
    FROM
    "${refProductName}"."newrelease"
    WHERE
    "isDelete" IS NOT true
   `;
      const result = await executeQuery(listReleaseQuery);

      return encrypt(
        {
          success: true,
          message: "list Release successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Release",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  // ---------------------------------------------------------------------
  public async addReviewsV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id, roleId: tokendata.roleId };
    // const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName, userName, userEmail, reviewContent, ratings } =
        userData;

      const addReviewsQuery = `
 INSERT INTO
  "${refProductName}"."feedBackTable" (
    "userName",
    "userEmail",
    "reviewContent",
    "ratings",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *;
    `;

      const result = await executeQuery(addReviewsQuery, [
        userName,
        userEmail,
        reviewContent,
        ratings,
        CurrentTime(),
        "User",
      ]);

      return encrypt(
        {
          success: true,
          message: "add Review successfully",
          // token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Review",
          // token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateReviewsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refProductName, refViewStatus, feedbackId } = userData;
      console.log("userData", userData);

      const updateReviewsQuery = `
UPDATE
  "${refProductName}"."feedBackTable"
SET
  "refViewStatus" = $1,
  "updatedAt" = $2,
  "updatedBy" = $3
WHERE
  "feedbackId" = $4
RETURNING
  *;
    `;

      const result = await executeQuery(updateReviewsQuery, [
        refViewStatus,
        CurrentTime(),
        tokendata.id,
        feedbackId,
      ]);

      console.log("result", result);
      return encrypt(
        {
          success: true,
          message: "add Review successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Review",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteReviewsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");
      const { refProductName, feedbackId } = userData;

      const deleteReviewQuery = `
    UPDATE
  "${refProductName}"."feedBackTable"
SET
  "isDelete" = true,
  "deletedAt" = $2,
        "deletedBy" = $3
WHERE
  "feedbackId" = $1
RETURNING
  *;
    `;

      const result = await client.query(deleteReviewQuery, [
        feedbackId,
        CurrentTime(),
        tokendata.id,
      ]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Review deleted successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during deleting Review",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listReviewsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refProductName } = userData;
      console.log("userData", userData);

      const listReviewQuery = `
    SELECT
        *
    FROM
    "${refProductName}"."feedBackTable"
    WHERE
    "isDelete" IS NOT true
    `;

      const result = await executeQuery(listReviewQuery);

      console.log("result", result);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Review listed successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listing Review",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  // -------------------------------------------------
  public async getBlogsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refProductName, blogId } = userData;

      const getBlogsQuery = `
      SELECT
        *
    FROM
    "${refProductName}"."blogtable"
    WHERE
    "blogId" = $1
    `;
      const result = await executeQuery(getBlogsQuery, [blogId]);

      return encrypt(
        {
          success: true,
          message: "list Blogs successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Blogs",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getReviewsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refProductName, feedbackId } = userData;

      const getReviewsQuery = `
      SELECT
     *
    FROM
    "${refProductName}"."feedBackTable"
      WHERE
    "feedbackId" = $1
    `;
      const result = await executeQuery(getReviewsQuery, [feedbackId]);

      return encrypt(
        {
          success: true,
          message: "list review successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list review",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getReleaseV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refProductName, releaseId } = userData;

      const getReleaseQuery = `
   SELECT
    *
   FROM
  "${refProductName}"."newrelease"
   WHERE
  "releaseId" = $1
    `;
      const result = await executeQuery(getReleaseQuery, [releaseId]);

      return encrypt(
        {
          success: true,
          message: "list Release successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Release",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getAchivementsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refProductName, achievementId } = userData;

      const getAchivementsQuery = `
  SELECT
  *
FROM
  "${refProductName}"."achievements"
WHERE
  "achievementId" = $1
    `;
      const result = await executeQuery(getAchivementsQuery, [achievementId]);

      return encrypt(
        {
          success: true,
          message: " get Achivements successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during get Achivements",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
