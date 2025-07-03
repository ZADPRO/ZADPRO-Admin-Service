import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { adminController } from "./controller";
import IRoute from "../../helper/routes";

export class adminRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new adminController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/adminRoutes/adminLogin",
          config: {
            handler: controller.adminLogin,
            description: "admin Login",
            // tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/addProducts",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addProducts,
            description: "addProducts",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/addNewAdmin",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addNewAdmin,
            description: "addNewAdmin",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/forgotPassword",
          config: {
            handler: controller.forgotPassword,
            description: "forgotPassword",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/resetPassword",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.resetPassword,
            description: "resetPassword",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listProducts",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listProducts,
            description: "listProducts",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/allProductData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.allProductData,
            description: "allProductData",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/visibleAccess",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.visibleAccess,
            description: "visibleAccess",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/updateProduct",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateProduct,
            description: "updateProduct",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/uploadProductLogo",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadProductLogo,
            description: "uploadProductLogo",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/getProducts",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getProducts,
            description: "getProducts",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/editAdmin",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.editAdmin,
            description: "editAdmin",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listAdmin",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAdmin,
            description: "listAdmin",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteAdmin",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteAdmin,
            description: "deleteAdmin",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/getAdmin",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getAdmin,
            description: "getAdmin",
            tags: ["api", "Users"],
            auth: false,
          },
        },

        
      ]);
      resolve(true);
    });
  }
}
