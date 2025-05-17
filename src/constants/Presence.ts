import { serverTimestamp } from "firebase/database";

export const isOfflineForDatabase = {
  state: "offline",
  last_changed: serverTimestamp(),
};

export const isOnlineForDatabase = {
  state: "online",
  last_changed: serverTimestamp(),
};
