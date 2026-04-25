import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { authWithGoogle } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = ({ onLogin, loading, error }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      setAuthLoading(true);
      setAuthError("");
      const result = await authWithGoogle({ idToken: credentialResponse.credential });
      onLogin(result);
    } catch (apiError) {
      setAuthError(apiError.response?.data?.message || "Login failed. Please verify backend and MongoDB are running.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#fde68a_0%,#fff7ed_35%,#f8fafc_100%)] p-4">
      <section className="w-full max-w-md rounded-2xl border border-amber-200 bg-white/95 p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Smart Assignment Tracker</h1>
        <p className="mt-2 text-sm text-slate-600">
          Connect Google Classroom, prioritize due work, and get smart reminders.
        </p>

        <div className="mt-6">
          {loading || authLoading ? (
            <LoadingSpinner label="Signing in..." />
          ) : (
            <GoogleLogin onSuccess={handleSuccess} onError={() => setAuthError("Google sign-in was cancelled or failed.")} />
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {authError ? <p className="mt-2 text-sm text-red-600">{authError}</p> : null}
      </section>
    </main>
  );
};

export default LoginPage;
