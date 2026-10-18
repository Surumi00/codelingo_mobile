export interface TokenStore {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
}

let currentToken: string | null = null;

const inMemoryTokenStore: TokenStore = {
  async get() {
    return currentToken;
  },
  async set(token: string) {
    currentToken = token;
  },
  async clear() {
    currentToken = null;
  },
};

let tokenStore: TokenStore = inMemoryTokenStore;

export function setTokenStore(store: TokenStore): void {
  tokenStore = store;
}

export async function getToken(): Promise<string | null> {
  return tokenStore.get();
}

export async function setToken(token: string): Promise<void> {
  await tokenStore.set(token);
}

export async function clearToken(): Promise<void> {
  await tokenStore.clear();
}
