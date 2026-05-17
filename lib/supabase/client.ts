type AuthError = { message: string };
type AuthResult = { data: null; error: AuthError | null };

const STUB_ERROR: AuthError = {
  message: "Auth non disponible en version de test",
};

type SignInWithPasswordCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  email: string;
  password: string;
  options?: {
    emailRedirectTo?: string;
  };
};

export function createClient() {
  return {
    auth: {
      async signInWithPassword(_credentials: SignInWithPasswordCredentials): Promise<AuthResult> {
        return { data: null, error: STUB_ERROR };
      },
      async signUp(_credentials: SignUpCredentials): Promise<AuthResult> {
        return { data: null, error: STUB_ERROR };
      },
      async signOut(): Promise<AuthResult> {
        return { data: null, error: null };
      },
    },
  };
}
