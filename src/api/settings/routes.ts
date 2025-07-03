import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { settingsController } from "./controller";
import IRoute from "../../helper/routes";

export class settingsRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new settingsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/addBlogs",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addBlogs,
            description: "addBlogs",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/uploadBlogImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadBlogImage,
            description: "uploadBlogImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/deleteBlogs",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteBlogs,
            description: "deleteBlogs",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/updateBlogs",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateBlogs,
            description: "updateBlogs",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/listBlogs",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listBlogs,
            description: "listBlogs",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/addAchievements",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addAchievements,
            description: "addAchievements",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/updateAchievements",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateAchievements,
            description: "updateAchievements",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/deleteAchievements",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteAchievements,
            description: "deleteAchievements",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/listAchievements",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAchievements,
            description: "listAchievements",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/addRelease",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addRelease,
            description: "addRelease",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/updateRelease",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateRelease,
            description: "updateRelease",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/deleteRelease",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteRelease,
            description: "deleteRelease",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/listRelease",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listRelease,
            description: "listRelease",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/addReviews",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addReviews,
            description: "addReviews",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/updateReviews",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateReviews,
            description: "updateReviews",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/deleteReviews",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteReviews,
            description: "deleteReviews",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/listReviews",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listReviews,
            description: "listReviews",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/getBlogs",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getBlogs,
            description: "getBlogs",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/getReviews",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getReviews,
            description: "getReviews",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/getRelease",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getRelease,
            description: "getRelease",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/getAchivements",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getAchivements,
            description: "getAchivements",
            tags: ["api", "Users"],
            auth: false,
          },
        },
       
      ]);
      resolve(true);
    });
  }
}
