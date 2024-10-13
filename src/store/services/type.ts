interface User {
  email: string;
  id: string;
}

interface AccessToken {
  token: string;
  expires: string; // Consider using Date if you want to handle it as a Date object
}

interface RefreshToken {
  token: string;
  expires: string; // Consider using Date if you want to handle it as a Date object
}

interface Tokens {
  access: AccessToken;
  refresh: RefreshToken;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export interface Login {
  email: string;
  password: string;
}
