import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { UserController } from "./controller";
import IRoute from "../../helper/routes";

export class UserRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/UserRoutes/listBlogs",
          config: {
            handler: controller.listBlogs,
            description: "listBlogs",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/UserRoutes/listReviews",
          config: {
            handler: controller.listReviews,
            description: "listReviews",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/UserRoutes/listAchievements",
          config: {
            handler: controller.listAchievements,
            description: "listAchievements",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/UserRoutes/listRelease",
          config: {
            handler: controller.listRelease,
            description: "listRelease",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/UserRoutes/ourProducts",
          config: {
            handler: controller.ourProducts,
            description: "ourProducts",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
