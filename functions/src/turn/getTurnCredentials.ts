"use strict";

import {
  onCall,
  HttpsError,
  CallableRequest,
} from "firebase-functions/v2/https";
import axios from "axios";

const TURN_KEY_ID = process.env.TURN_KEY_ID;
const TURN_API_TOKEN = process.env.TURN_API_TOKEN;

if (!TURN_KEY_ID || !TURN_API_TOKEN) {
  throw new Error(
    "TURN_KEY_ID and TURN_API_TOKEN must be defined in environment variables."
  );
}

/**
 * Generate TURN credentials for the WebRTC connection.
 */
export const getTurnCredentials = onCall(
  async (request: CallableRequest<{}>) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Only authenticated users can request TURN credentials."
      );
    }

    try {
      const response = await axios.post(
        `https://rtc.live.cloudflare.com/v1/turn/keys/${TURN_KEY_ID}/credentials/generate-ice-servers`,
        { ttl: 3600 }, // 1 hour
        {
          headers: {
            Authorization: `Bearer ${TURN_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // contains `iceServers`
    } catch (err: any) {
      console.error(
        "TURN credential generation failed:",
        err?.response?.data || err.message
      );
      throw new HttpsError(
        "internal",
        "TURN credentials could not be generated."
      );
    }
  }
);
