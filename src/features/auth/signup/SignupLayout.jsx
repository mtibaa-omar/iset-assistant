import { Outlet, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../../context/DarkModeContext";
import { SignupProvider } from "./SignupContext";
import AuthCard from "../AuthCard";
import StepIndicator from "./StepIndicator";

const STEP_CONFIG = {
  1: {
    path: "/signup",
    title: "Create Account",
    subtitle: "Join ISET Assistant today",
  },
  2: {
    path: "/signup/verify",
    title: "Verify Email",
    subtitle: "Check your inbox for the code",
  },
  3: {
    path: "/signup/profile",
    title: "Almost Done!",
    subtitle: "Tell us about your studies",
  },
};

function SignupLayoutContent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const getCurrentStep = () => {
    switch (location.pathname) {
      case "/signup/verify":
        return 2;
      case "/signup/profile":
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getCurrentStep();
  const config = STEP_CONFIG[currentStep];

  return (
    <>
      <div className="fixed z-10 top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full cursor-pointer transition-all duration-200 backdrop-blur-md shadow-sm bg-white/70 dark:bg-white/10 border border-slate-300/60 dark:border-white/20 hover:bg-white/90 dark:hover:bg-white/20 hover:shadow-md hover:scale-105"
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? (
            <Sun className="text-white size-5 lg:size-4" />
          ) : (
            <Moon className="text-slate-700 size-5 lg:size-4" />
          )}
        </button>
      </div>

      <AuthCard title={config.title} subtitle={config.subtitle}>
        <StepIndicator currentStep={currentStep} totalSteps={3} />
        <Outlet />
      </AuthCard>
    </>
  );
}

export default function SignupLayout() {
  return (
    <SignupProvider>
      <SignupLayoutContent />
    </SignupProvider>
  );
}

export { STEP_CONFIG, SignupProvider };
