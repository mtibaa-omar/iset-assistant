import { FcGoogle } from "react-icons/fc";
import { useLoginWithGoogle } from "./useLogin";


export default function GoogleButton({ mode = "login" }) {
  const label = mode === "signup" ? "Sign up" : "Login";
  const { loginWithGoogle } = useLoginWithGoogle();
  
  function handleGoogleAuth() {
    loginWithGoogle();
  }

  return (
    <>
      <div className="mb-4 space-y-3 2xl:mb-6">
        <button
          onClick={handleGoogleAuth}
          type="button"
          className="flex items-center justify-center w-full gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 lg:py-3 text-sm md:text-base font-semibold transition-all border-2 rounded-lg md:rounded-xl border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/30 text-slate-700 dark:text-white bg-white/50 dark:bg-white/5"
        >
          <FcGoogle className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>{label} avec Google</span>
        </button>
      </div>

      <div className="relative mb-4 2xl:mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs md:text-sm">
          <span className="px-3 font-medium bg-white/80 dark:bg-zinc-900/80 text-slate-500 dark:text-slate-400">
            Ou avec votre email
          </span>
        </div>
      </div>
    </>
  );
}

