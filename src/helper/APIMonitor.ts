import axios from "axios";
import { executeQuery } from "./db";

export const checkServerHealth = async () => {
  try {
    // Simple memory or CPU usage check (can be extended)
    const uptime = process.uptime();
    return { success: true, uptime: `${Math.floor(uptime)} seconds` };
  } catch (error) {
    return { success: false, message: "Server check failed", error };
  }
};

export const checkDatabaseHealth = async () => {
  try {
    const result = await executeQuery(`SELECT
  *
FROM
  public."adminTable"`);
    return result
      ? { success: true, message: "Database is reachable" }
      : { success: false, message: "Database unreachable" };
  } catch (error) {
    return {
      success: false,
      message: "Database check failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const checkNetworkHealth = async () => {
  try {
    const response = await axios.get("https://medpredit.com/", {
      timeout: 3000,
    });
    return response.status === 200
      ? { success: true, message: "Network is online" }
      : { success: false, message: "Network unreachable" };
  } catch (error) {
    return {
      success: false,
      message: "Network check failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
