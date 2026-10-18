import { client } from "./client";
import type { User } from "./types";

export type GetMeResponse = {
  user: User;
};

export async function getMe(): Promise<User> {
  const { data } = await client.get<GetMeResponse>("/auth/me");

  return data.user;
}
