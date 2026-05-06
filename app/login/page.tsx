export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Connexion
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-xl font-semibold"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Pas encore de compte ? Inscription bientôt disponible.
        </p>
      </div>
    </main>
  );
}