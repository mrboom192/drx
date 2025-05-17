import { Chat } from "@/types/chat";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "@firebase/firestore";
import { useMemo } from "react";
import { create } from "zustand";
import { auth, db } from "../../firebaseConfig";

interface ChatStoreState {
  chats: Chat[];
  isFetchingChats: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  startChatsListener: () => Promise<void>;
  stopChatsListener: () => void;
}

const useChatStore = create<ChatStoreState>((set, get) => ({
  // States
  chats: [],
  isFetchingChats: false,
  error: null,
  unsubscribe: null,

  // Actions
  startChatsListener: async () => {
    if (get().unsubscribe) return; // Prevent multiple listeners

    set({ isFetchingChats: true, error: null });

    try {
      const chatsRef = collection(db, "chats");
      const chatsQuery = query(
        chatsRef,
        where("users", "array-contains", auth.currentUser?.uid)
      );

      const unsub = onSnapshot(
        chatsQuery,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const fetchedChats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Chat[];

          set({
            chats: fetchedChats,
            isFetchingChats: false,
          });
        },
        (error) => {
          console.error("Error fetching appointments:", error);
          set({ error: error.message, isFetchingChats: false });
        }
      );

      set({ unsubscribe: unsub });
    } catch (error: any) {
      set({ error: error.message, isFetchingChats: false });
    }
  },
  stopChatsListener: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, chats: [] });
    }
  },
}));

// Selectors
export const useChats = () => useChatStore((state) => state.chats);

export const useIsFetchingChats = () =>
  useChatStore((state) => state.isFetchingChats);

export const useChatsError = () => useChatStore((state) => state.error);

export const useStartChatsListener = () =>
  useChatStore((state) => state.startChatsListener);

export const useStopChatsListener = () =>
  useChatStore((state) => state.stopChatsListener);

export const useChatsById = (chatId: string) => {
  const chats = useChatStore((state) => state.chats);

  return useMemo(() => {
    return chats.find((chat) => chat.id === chatId);
  }, [chats, chatId]);
};
