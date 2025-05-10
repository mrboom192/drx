import { User } from "./user";

export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean; // Indicates whether or not this is a system message
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
}
