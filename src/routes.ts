import * as Hapi from "@hapi/hapi";
import { adminRoutes } from "./api/admin/routes";
import { settingsRoutes } from "./api/settings/routes";
import { UserRoutes } from "./api/user/routes";

export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new adminRoutes().register(server);
    await new settingsRoutes().register(server);
    await new UserRoutes().register(server);

  }
}