import { executeQuery, getClient } from "../../helper/db";

import path from "path";
import { encrypt } from "../../helper/encrypt";
import { getProductQuery, listProductsQuery } from "./query";
import { getFileUrl } from "../../helper/minio";
import {
  checkDatabaseHealth,
  checkNetworkHealth,
  checkServerHealth,
} from "../../helper/APIMonitor";

export class UserRepository {
  public async listBlogsV1(userData: any, token_data: any): Promise<any> {
    try {
      const { refProductsId } = userData;
      const getProduct = await executeQuery(getProductQuery, [refProductsId]);

      console.log("getProduct", getProduct);

      const { refProductsName } = getProduct[0]; // ✅ fixed key
      console.log("refProductsName", refProductsName);

      const listAllBlogsQuery = `
      SELECT
        *
    FROM
    "${refProductsName}"."blogtable"
    WHERE
    "isDelete" IS NOT true
        ORDER BY
    "blogId" DESC
   `;
      const result = await executeQuery(listAllBlogsQuery);

      const expireMins = 15;
      const blogs = result;

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
          AllBlogs: enrichedBlogs,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Blogs :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Blogs",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    }
  }
  public async listReviewsV1(userData: any, token_data: any): Promise<any> {
    try {
      const { refProductsId } = userData;
      const getProduct = await executeQuery(getProductQuery, [refProductsId]);

      console.log("getProduct", getProduct);

      const { refProductsName } = getProduct[0]; // ✅ fixed key
      console.log("refProductsName", refProductsName);

      const listReviewQuery = `
SELECT
  *
FROM
  "${refProductsName}"."feedBackTable"
WHERE
  "isDelete" IS NOT true
  AND (
    "refViewStatus" = 'Show'
    OR "refViewStatus" IS NOT NULL
  )
ORDER BY
  "feedbackId" DESC
LIMIT
  5;
    `;

      const listAllReviewQuery = `
SELECT
  *
FROM
  "${refProductsName}"."feedBackTable"
WHERE
  "isDelete" IS NOT true
  AND (
    "refViewStatus" = 'Show'
    OR "refViewStatus" IS NOT NULL
  )
      ORDER BY 
  "feedbackId" DESC;
    `;

      const result = await executeQuery(listReviewQuery);
      const result1 = await executeQuery(listAllReviewQuery);

      return encrypt(
        {
          success: true,
          message: "list Review successfully",
          Review5: result,
          allReview: result1,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Review :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Review",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    }
  }
  public async listAchievementsV1(
    userData: any,
    token_data: any
  ): Promise<any> {
    try {
      const { refProductsId } = userData;
      const getProduct = await executeQuery(getProductQuery, [refProductsId]);

      console.log("getProduct", getProduct);

      const { refProductsName } = getProduct[0]; // ✅ fixed key
      console.log("refProductsName", refProductsName);

      const listAchievementQuery = `
    SELECT
  *
FROM
  "${refProductsName}"."achievements"
WHERE
  "isDelete" IS NOT true
ORDER BY
  "achievementId" DESC;
   `;
      const result = await executeQuery(listAchievementQuery);

      return encrypt(
        {
          success: true,
          message: "list Achievements successfully",
          Achievements: result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Achievements :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Achievements",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    }
  }
  public async listReleaseV1(userData: any, token_data: any): Promise<any> {
    try {
      const { refProductsId } = userData;
      const getProduct = await executeQuery(getProductQuery, [refProductsId]);

      console.log("getProduct", getProduct);

      const { refProductsName } = getProduct[0]; // ✅ fixed key
      console.log("refProductsName", refProductsName);

      const listReleaseQuery = `
    SELECT
        *
    FROM
    "${refProductsName}"."newrelease"
    WHERE
    "isDelete" IS NOT true
   `;
      const result = await executeQuery(listReleaseQuery);

      return encrypt(
        {
          success: true,
          message: "list newrelease successfully",
          Release: result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list newrelease :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list newrelease",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    }
  }
  public async ourProductsV1(userData: any, token_data: any): Promise<any> {
    try {
      const Products = await executeQuery(listProductsQuery);
      const product = Products;

      const expireMins = 15;

      // Enrich blogs with signed image URLs
      const enrichedBlogs = await Promise.all(
        product.map(async (product) => {
          let signedImageUrl: string | null = null;

          // Only try generating a URL if refProductLogo exists
          if (
            product.refProductLogo &&
            typeof product.refProductLogo === "string" &&
            product.refProductLogo.trim() !== ""
          ) {
            try {
              signedImageUrl = await getFileUrl(
                product.refProductLogo,
                expireMins
              );
            } catch (err) {
              console.warn(`Failed to generate signed URL`, err);
              signedImageUrl = null;
            }
          }

          return {
            ...product,
            signedImageUrl, // Always present (null if error)
          };
        })
      );
      return encrypt(
        {
          success: true,
          message: "list Products successfully",
          Products: Products,
          productImage: enrichedBlogs,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Products :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Products",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    }
  }
  public async statusV1(userData: any, token_data: any): Promise<any> {
    try {
      const serverStatus = await checkServerHealth();
      const dbStatus = await checkDatabaseHealth();
      const networkStatus = await checkNetworkHealth();

      const allHealthy =
        serverStatus.success && dbStatus.success && networkStatus.success;

      return {
        success: allHealthy,
        server: serverStatus,
        database: dbStatus,
        network: networkStatus,
        message: allHealthy
          ? "All systems are operational."
          : "Some systems are down.",
      };
    } catch (error: unknown) {
      console.error("MonitorRepository Error:", error);
      return {
        success: false,
        message: "Health check failed.",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
