import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "token";

let cachedToken: string | null = null;
let isCacheLoaded = false;

export async function getToken(): Promise<string | null> {
  if (isCacheLoaded) {
    return cachedToken;
  }

  try {
    cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    isCacheLoaded = true;
  } catch {
    return null;
  }

  return cachedToken;
}

export async function setToken(token: string): Promise<void> {
  cachedToken = token;
  isCacheLoaded = true;

  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    return;
  }
}

export async function clearToken(): Promise<void> {
  cachedToken = null;
  isCacheLoaded = true;

  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    return;
  }
}
