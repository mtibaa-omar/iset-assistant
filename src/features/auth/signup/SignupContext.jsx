import { createContext, useContext, useReducer, useEffect } from "react";

const SignupContext = createContext(null);

const STORAGE_KEY = "signup_data";

const initialData = {
  email: "",
  completedSteps: [],
};

function signupReducer(state, action) {
  switch (action.type) {
    case "update_data":
      return { ...state, ...action.payload };
    
    case "mark_step_completed":
      return {
        ...state,
        completedSteps: [...new Set([...state.completedSteps, action.payload])],
      };
    
    case "reset_signup":
      return initialData;
    
    case "init_from_storage":
      return action.payload || initialData;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export function SignupProvider({ children }) {
  const [signupData, dispatch] = useReducer(signupReducer, initialData, () => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(signupData));
  }, [signupData]);

  const updateSignupData = (data) => {
    dispatch({ type: "update_data", payload: data });
  };

  const markStepCompleted = (step) => {
    dispatch({ type: "mark_step_completed", payload: step });
  };

  const isStepCompleted = (step) => {
    return signupData.completedSteps.includes(step);
  };

  const canAccessStep = (step) => {
    if (step === 1) return true;
    return isStepCompleted(step - 1);
  };

  const resetSignup = () => {
    dispatch({ type: "reset_signup" });
  };

  return (
    <SignupContext.Provider
      value={{
        signupData,
        updateSignupData,
        markStepCompleted,
        isStepCompleted,
        canAccessStep,
        resetSignup,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignupContext() {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignupContext must be used within a SignupProvider");
  }
  return context;
}
