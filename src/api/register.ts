import { client } from "./client";
import type { User } from "./types";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
  token: string;
};

export async function register(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await client.post<RegisterResponse>(
    "/auth/register",
    payload,
  );

  return data;
}
