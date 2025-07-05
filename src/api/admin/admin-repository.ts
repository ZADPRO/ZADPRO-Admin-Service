import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { generateFileName, generatePassword } from "../../helper/common";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime } from "../../helper/common";
import {
  addProductsQuery,
  changeVIsibleQuery,
  checkPasswordQuery,
  checkProductQuery,
  checkQuery,
  deleteAdminQuery,
  getAdminQuery,
  insertUserQuery,
  listAdminQuery,
  listAllProductsQuery,
  listProductsQuery,
  listRoleTypeQuery,
  ProductsQuery,
  resetPasswordQuery,
  selectUserByLogin,
  updateAdminQuery,
  updateProductQuery,
  UpdateUserQuery,
} from "./query";
import {
  generateForgotPasswordEmailContent,
  generateSignupEmailContent,
} from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";
import { custom } from "@hapi/joi";
import { createUploadUrl, getFileUrl } from "../../helper/minio";

export class adminRepository {
  public async adminLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      const params = [user_data.login];
      const users = await client.query(selectUserByLogin, params);

      if (!users.rows || users.rows.length === 0) {
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials. User not found.",
          },
          true
        );
      }
      const user = users.rows[0];
      console.log("user", user);

      const { refRoleIdARRINT, refProductIdARRINT, refProductsName } =
        users.rows[0];
      console.log("users.rows[0]", users.rows[0]);

      const checkProduct = await client.query(checkProductQuery, [
        refProductIdARRINT,
      ]);
      console.log("checkProduct", checkProduct);
      if (
        !checkProduct.rows ||
        (checkProduct.rows.length === 0 && refRoleIdARRINT != `[5]`)
      ) {
        return encrypt(
          {
            success: false,
            message: "Could not find your product",
          },
          true
        );
      }

      if (!user.refUserHashedpassPassword) {
        console.error("Error: User has no hashed password stored.");
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials UserHashedPassword not match",
          },
          true
        );
      }

      const validPassword = await bcrypt.compare(
        user_data.password,
        user.refUserHashedpassPassword
      );

      if (!validPassword) {
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials, validPassword is in false",
          },
          true
        );
      }

      // validPassword === true
      const tokenData = {
        id: user.adminId,
        roleId: refRoleIdARRINT,
        productId: refProductIdARRINT,
      };

      // const history = [
      //   1,
      //   user.refUserId,
      //   `${user_data.login} login successfully`,
      //   CurrentTime(),
      //   user.adminId,
      // ];

      // await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "Login successful",
          userId: user.adminId,
          roleId: refRoleIdARRINT,
          productId: refProductIdARRINT,
          productsName: refProductsName,
          token: generateTokenWithExpire(tokenData, true),
        },
        true
      );
    } catch (error) {
      console.error("Error during login:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async addProductsV1(userData: any, token_data: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");
      function validateIdentifier(name: string) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
          throw new Error("Invalid schema name");
        }
      }

      function getCreateBlogTableQuery(schema: string) {
        validateIdentifier(schema);
        return `
    CREATE TABLE IF NOT EXISTS "${schema}".blogTable (
    "blogId" serial NOT NULL PRIMARY KEY,
    "blogTitle" text NOT NULL,
    "blogContent" text NOT NULL,
    "blogImage" text NULL,
    "blogDate" text NULL,
    "refDummy1" text NULL,
    "refDummy2" text NULL,
    "refDummy3" text NULL,
    "refDummy4" text NULL,
    "refDummy5" text NULL,
    "createdAt" text NULL,
    "createdBy" text NULL,
    "updatedAt" text NULL,
    "updatedBy" text NULL,
    "deletedAt" text NULL,
    "deletedBy" text NULL,
    "isDelete" boolean NULL
    );
  `;
      }

      function getCreateNewReleaseTableQuery(schema: string) {
        validateIdentifier(schema);
        return `
    CREATE TABLE IF NOT EXISTS "${schema}".newRelease (
    "releaseId" SERIAL NOT NULL PRIMARY KEY,
    "version" TEXT NULL,
    "notes" TEXT NULL,
    "releaseDate" TEXT NULL,
    "refDummy1" text NULL,
    "refDummy2" text NULL,
    "refDummy3" text NULL,
    "refDummy4" text NULL,
    "refDummy5" text NULL,
    "createdAt" text NULL,
    "createdBy" text NULL,
    "updatedAt" text NULL,
    "updatedBy" text NULL,
     "deletedAt" text NULL,
    "deletedBy" text NULL,
    "isDelete" boolean NULL
    );
  `;
      }

      function getCreateAchievementsTableQuery(schema: string) {
        validateIdentifier(schema);
        return `
      CREATE TABLE IF NOT EXISTS "${schema}"."achievements" (
      "achievementId" SERIAL NOT NULL PRIMARY KEY,
      "achievementTitle" TEXT NULL,
      "achievementDescription" TEXT NULL,
      "achievedOn" text NULL,
      "refDummy1" text NULL,
      "refDummy2" text NULL,
      "refDummy3" text NULL,
      "refDummy4" text NULL,
      "refDummy5" text NULL,
      "createdAt" text NULL,
      "createdBy" text NULL,
      "updatedAt" text NULL,
      "updatedBy" text NULL,
       "deletedAt" text NULL,
    "deletedBy" text NULL,
      "isDelete" boolean NULL
    );
  `;
      }
      function getCreateFeedBackTableQuery(schema: string) {
        validateIdentifier(schema);
        return `
      CREATE TABLE IF NOT EXISTS "${schema}"."feedBackTable" (
      "feedbackId" SERIAL NOT NULL PRIMARY KEY,
      "userName" TEXT NULL,
      "userEmail" TEXT NULL,
      "reviewContent" text NULL,
      "ratings" text NULL,
      "refViewStatus" text NULL,
      "refDummy2" text NULL,
      "refDummy3" text NULL,
      "refDummy4" text NULL,
      "refDummy5" text NULL,
      "createdAt" text NULL,
      "createdBy" text NULL,
      "updatedAt" text NULL,
      "updatedBy" text NULL,
       "deletedAt" text NULL,
       "deletedBy" text NULL,
      "isDelete" boolean NULL
    );
  `;
      }

      // const refProductName = userData.refProductName;
      const {
        refProductName,
        refProductDescription,
        refProductLink,
        refProductLogo,
      } = userData;
      console.log("refProductName line ------ 183", refProductName);
      validateIdentifier(refProductName);
      const addProduct = await client.query(addProductsQuery, [
        refProductName,
        refProductDescription,
        refProductLink,
        refProductLogo,
        CurrentTime(),
        token_data.id,
      ]);

      const productSchema = await client.query(
        `CREATE SCHEMA IF NOT EXISTS "${refProductName}"`
      );
      const blogTable = await client.query(
        getCreateBlogTableQuery(refProductName)
      );
      const newReleaseTable = await client.query(
        getCreateNewReleaseTableQuery(refProductName)
      );
      const achievementsTable = await client.query(
        getCreateAchievementsTableQuery(refProductName)
      );
      const feedBackTable = await client.query(
        getCreateFeedBackTableQuery(refProductName)
      );
      const adminProduct = addProduct.rows[0];
      console.log("adminProduct", adminProduct);
      const updateAdmin = await client.query(updateAdminQuery, [
        adminProduct.refProductsId,
        1,
      ]);
      // Commit transaction
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Products added successfully",
          token: tokens,
          productName: refProductName,
        },
        true
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error during Products added:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Products addition",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async addNewAdminV1(userData: any, token_data: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { UserName, userEmail, refName, refDescription } = userData;
      const genPassword = generatePassword();
      const genHashedPassword = await bcrypt.hash(genPassword, 10);

      const userCheck = await client.query(checkQuery, [UserName]);
      if (userCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: true,
            message: "User already exists",
            token: tokens,
          },
          true
        );
      }

      const roleId = Array.isArray(userData.roleId)
        ? `{${userData.roleId.join(",")}}`
        : "{}";

      const productId = Array.isArray(userData.productId)
        ? `{${userData.productId.join(",")}}`
        : "{}";

      const params = [
        roleId,
        UserName,
        genPassword,
        genHashedPassword,
        productId,
        userEmail,
        refName,
        refDescription,
        CurrentTime(),
        token_data.id,
      ];

      const userResult = await client.query(insertUserQuery, params);
      console.log("userResult", userResult);

      await client.query("COMMIT");

      // Send signup email
      try {
        await sendEmail({
          to: userEmail,
          subject: "Your account has been created successfully",
          html: generateSignupEmailContent(UserName, genPassword),
        });
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
        // optionally: log this or insert into notification failure table
      }
     
      return encrypt(
        {
          success: true,
          message: "User added successfully",
          token: tokens,
          userResult: userResult.rows[0], // more useful than the full Result object
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during Employee added:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Employee creation",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async forgotPasswordV1(userData: any, token_data: any): Promise<any> {
    try {
      const { UserName, userEmail } = userData;

      const userCheck = await executeQuery(checkPasswordQuery, [
        UserName,
        userEmail,
      ]);

      if (userCheck.length > 0) {
        return encrypt(
          {
            success: true,
            message: "User does not exists",
          },
          true
        );
      }

      const { refUsername, refPassword } = userCheck[0];
      // Send signup email
      try {
        await sendEmail({
          to: userEmail,
          subject: "Zadroit Account – Password Assistance",
          html: generateForgotPasswordEmailContent(refUsername, refPassword),
        });
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
        // optionally: log this or insert into notification failure table
      }

      return encrypt(
        {
          success: true,
          message: "User added successfully",
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during Employee added:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Employee creation",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    }
  }
  public async resetPasswordV1(userData: any, token_data: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { UserName, newPassword } = userData;

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the DB
      const updateResult = await client.query(resetPasswordQuery, [
        newPassword,
        hashedPassword,
        CurrentTime(),
        token_data.id,
        UserName,
        token_data.id,
      ]);

      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "User not found or password update failed",
            token: tokens,
          },
          true
        );
      }

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Password reset successfully",
          token: tokens,
          updateResult: updateResult,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during password reset:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during password reset",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async listProductsV1(userData: any, token_data: any): Promise<any> {
  //   const token = { id: token_data.id, roleId: token_data.roleId };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {

  //        let listProducts: any[] = [];
  //   let listRoleType: any[] = [];

  //     if ((token_data.roleId === 5)) {
  //       const listProducts = await executeQuery(listProductsQuery, []);
  //       const listRoleType = await executeQuery(listRoleTypeQuery, []);
  //     } else {
  //       const listAllProducts = await executeQuery(listAllProductsQuery, []);
  //     }

  //     const logo = listProducts;

  //     // Enrich blogs with signed image URLs
  //     const expireMins = 15;

  //     const enrichedImage = await Promise.all(
  //       logo.map(async (logo) => {
  //         let signedImageUrl: string | null = null;
  //         if (logo.refProductLogo) {
  //           try {
  //             // Assuming refProductLogo is something like: assets/blogs/filename.jpeg
  //             const fileName = logo.refProductLogo.split("/").pop();
  //             if (fileName) {
  //               signedImageUrl = await getFileUrl(fileName, expireMins);
  //             }
  //           } catch (err) {
  //             console.warn(
  //               `Failed to generate signed URL for blog ID ${logo.id}`,
  //               err
  //             );
  //           }
  //         }

  //         return {
  //           ...logo,
  //           signedImageUrl, // add the signed URL to the response
  //         };
  //       })
  //     );
  //     return encrypt(
  //       {
  //         success: true,
  //         message: "list Products successfully",
  //         token: tokens,
  //         Products: listProducts,
  //         roleType: listRoleType,
  //         image: enrichedImage,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.error("Error during list Products :", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unexpected error occurred during list Products",
  //         error: error instanceof Error ? error.message : String(error),
  //         token: tokens,
  //       },
  //       true
  //     );
  //   }
  // }

  public async listProductsV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };
    console.log("token", token);

    const tokens = generateTokenWithExpire(token, true);
    try {
      let listProducts: any[] = [];
      let listRoleType: any[] = [];

      if (token_data.roleId === 5) {
        listProducts = await executeQuery(listProductsQuery, []);
        listRoleType = await executeQuery(listRoleTypeQuery, []);
      } else {
        listProducts = await executeQuery(listAllProductsQuery, [
          // token_data.roleId,
          // token_data.productId,
          token_data.id,
        ]);
        // You can optionally skip roleType in this case or set it to null/empty
        listRoleType = [];
      }

      const expireMins = 15;
      console.log("listProducts", listProducts);

      const enrichedImage = await Promise.all(
        listProducts.map(async (product) => {
          let signedImageUrl: string | null = null;

          if (product.refProductLogo) {
            try {
              const fileName = product.refProductLogo.split("/").pop();
              if (fileName) {
                signedImageUrl = await getFileUrl(fileName, expireMins);
              }
            } catch (err) {
              console.warn(
                `Failed to generate signed URL for product ID ${product.id}`,
                err
              );
            }
          }

          return {
            ...product,
            signedImageUrl,
          };
        })
      );

      return encrypt(
        {
          success: true,
          message: "List Products successfully",
          token: tokens,
          // Products: listProducts,
          roleType: listRoleType,
          image: enrichedImage,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Products:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Products",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }

  public async allProductDataV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);
    const client = await getClient();

    try {
      // Step 1: Get all product schemas from public.refProducts
      const schemaRes = await client.query(
        `
        SELECT
   "refProductsName"
  FROM
  public."refProducts"
  WHERE
  "isDelete" IS NOT true
  AND "hideStatus" IS NULL
  `
      );
      const schemas = schemaRes.rows.map((row) => row.refProductsName);

      const productData: Record<string, any> = {};

      // Step 2: Loop over each schema and fetch data from each table
      for (const schema of schemas) {
        const schemaQuoted = `"${schema}"`;

        // Prepare queries for each table
        const queries = {
          blogs: `SELECT * FROM ${schemaQuoted}."blogtable" WHERE "isDelete" IS NOT TRUE`,
          reviews: `SELECT * FROM ${schemaQuoted}."feedBackTable" WHERE "isDelete" IS NOT TRUE`,
          achievements: `SELECT * FROM ${schemaQuoted}."achievements" WHERE "isDelete" IS NOT TRUE`,
          releases: `SELECT * FROM ${schemaQuoted}."newrelease" WHERE "isDelete" IS NOT TRUE`,
        };

        const data: Record<string, any> = {};

        // Step 3: Execute each query, handle errors gracefully
        for (const [key, query] of Object.entries(queries)) {
          try {
            const res = await client.query(query);
            data[key] = res.rows;
          } catch (error: any) {
            console.warn(
              `Error fetching ${key} from schema ${schema}:`,
              error.message
            );
            data[key] = [];
          }
        }

        productData[schema] = data;
      }

      // Step 4: Return encrypted data
      return encrypt(
        {
          success: true,
          message: "List Products successfully",
          token: tokens,
          result: productData,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Products:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Products",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async visibleAccessV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const changeVIsible = await executeQuery(changeVIsibleQuery, [
        userData.newStatus,
        userData.refProductId,
      ]);

      return encrypt(
        {
          success: true,
          message: "change VIsible successfully",
          token: tokens,
          visibleStatus: changeVIsible,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during change VIsible:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during change VIsible",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async updateProductV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const updateProduct = await executeQuery(updateProductQuery, [
        userData.refProductsName,
        userData.refProductDescription,
        userData.refProductLink,
        userData.refProductLogo,
        CurrentTime(),
        token_data.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "update Product successfully",
          token: tokens,
          result: updateProduct,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during update Product:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during update Product",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }
  // public async uploadProductLogoV1(
  //   userData: any,
  //   token_data: any
  // ): Promise<any> {
  //   // const token = { id: token_data.id, roleId: token_data.roleId };
  //   const token = {
  //     id: token_data.id,
  //     roleId: token_data.roleId,
  //     productId: token_data.productId,
  //   };

  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     const filename = userData.fileName.split(".");

  //     const extention = filename[filename.length() - 1];

  //     const generatedfilename = `products/${generateFileName()}.${extention}`;

  //     // Generate signed URL for uploading and file view
  //     const { upLoadUrl, fileUrl } = await createUploadUrl(
  //       generatedfilename,
  //       15
  //     ); // expires in 15 mins

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "upload Product Logo successfully",
  //         token: tokens,
  //         uploadUrl: upLoadUrl,
  //         fileUrl: fileUrl,
  //         fileName: generatedfilename,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.error("Error during update Product:", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unexpected error occurred during update Product",
  //         error: error instanceof Error ? error.message : String(error),
  //         token: tokens,
  //       },
  //       true
  //     );
  //   }
  // }
  public async uploadProductLogoV1(
    userData: any,
    token_data: any
  ): Promise<any> {
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const fileNameRaw = userData?.fileName;

      // ✅ Validate fileName presence and type
      if (!fileNameRaw || typeof fileNameRaw !== "string") {
        throw new Error("Invalid or missing fileName");
      }

      const filename = fileNameRaw.split(".");

      if (filename.length < 2) {
        throw new Error("Invalid file name format");
      }

      // ✅ Fixed: Use filename.length without ()
      const extention = filename[filename.length - 1] || "png"; // fallback to png if missing

      const generatedfilename = `products/${generateFileName()}.${extention}`;

      // ✅ Generate signed URL
      const { upLoadUrl, fileUrl } = await createUploadUrl(
        generatedfilename,
        15
      );

      return encrypt(
        {
          success: true,
          message: "Upload Product Logo successfully",
          token: tokens,
          uploadUrl: upLoadUrl,
          fileUrl: fileUrl,
          fileName: generatedfilename,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during update Product:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during update Product",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }

  public async getProductsV1(userData: any, token_data: any): Promise<any> {
    console.log("userData", userData);
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const Products = await executeQuery(ProductsQuery, [
        userData.refProductsId,
      ]);
      console.log("Products", Products);
      const product = Products;
      console.log("product", product);

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

      console.log("enrichedBlogs", enrichedBlogs);
      return encrypt(
        {
          success: true,
          message: "list Products successfully",
          token: tokens,
          Products: Products,
          Productimage: enrichedBlogs,
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
          token: tokens,
        },
        true
      );
    }
  }
  public async editAdminV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const client = await getClient();
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { adminId, userEmail, refName, refDescription } = userData;

      const roleId = Array.isArray(userData.roleId)
        ? `{${userData.roleId.join(",")}}`
        : "{}";

      const productId = Array.isArray(userData.productId)
        ? `{${userData.productId.join(",")}}`
        : "{}";

      const params = [
        adminId,
        roleId,
        productId,
        userEmail,
        refName,
        refDescription,
        CurrentTime(),
        token_data.id,
      ];

      const userResult = await client.query(UpdateUserQuery, params);
      console.log("userResult", userResult);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "User updated successfully",
          token: tokens,
          userResult: userResult.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during Employee updated:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Employee updated",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listAdminV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const listAdmin = await executeQuery(listAdminQuery);
      console.log("listAdmin", listAdmin);

      return encrypt(
        {
          success: true,
          message: "list admin successfully",
          token: tokens,
          result: listAdmin,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list admin :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list admin",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteAdminV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);
    try {
      const deleteAdmin = await executeQuery(deleteAdminQuery, [
        userData.adminID,
      ]);

      return encrypt(
        {
          success: true,
          message: "delete admin successfully",
          token: tokens,
          result: deleteAdmin,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during delete admin :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during delete admin",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async getAdminV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };

    const tokens = generateTokenWithExpire(token, true);
    try {
      const getAdmin = await executeQuery(getAdminQuery, [userData.adminID]);

      return encrypt(
        {
          success: true,
          message: "get admin successfully",
          token: tokens,
          result: getAdmin,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during get admin :", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during delete get",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async productDropdownV1(userData: any, token_data: any): Promise<any> {
    // const token = { id: token_data.id, roleId: token_data.roleId };
    const token = {
      id: token_data.id,
      roleId: token_data.roleId,
      productId: token_data.productId,
    };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);
    try {
      const listProducts = await executeQuery(listProductsQuery);
      const listRoleType = await executeQuery(listRoleTypeQuery);

      return encrypt(
        {
          success: true,
          message: "List Products successfully",
          token: tokens,
          products: listProducts,
          roleType: listRoleType,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error during list Products:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during list Products",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    }
  }
}
