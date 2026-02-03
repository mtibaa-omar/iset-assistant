import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Mail, RefreshCw } from "lucide-react";
import Button from "../ui/components/Button";
import { useSignupContext } from "../features/auth/signup/SignupContext";
import { useVerifyOtp, useResendOtp } from "../features/auth/useOtp";

export default function SignupStep2() {
  const navigate = useNavigate();
  const { signupData, markStepCompleted, isStepCompleted, canAccessStep } =
    useSignupContext();
  const [resendTimer, setResendTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const { isLoading: isVerifying, verifyOtp } = useVerifyOtp();
  const { isLoading: isResending, resendOtp } = useResendOtp();

  useEffect(() => {
    if (!canAccessStep(2)) {
      navigate("/signup", { replace: true });
      return;
    }
    if (isStepCompleted(2)) {
      navigate("/signup/profile", { replace: true });
    }
  }, [canAccessStep, isStepCompleted, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const submitOtp = (otpCode) => {
    verifyOtp(
      { email: signupData.email, token: otpCode },
      {
        onSuccess: () => {
          markStepCompleted(2);
          navigate("/signup/profile");
        },
        onError: resetOtp,
      }
    );
  };

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every(d => d !== "")) {
      submitOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    if (pastedData.length === 6) {
      submitOtp(newOtp.join(""));
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every(d => d !== "")) {
      submitOtp(otp.join(""));
    }
  };

  const handleResendOtp = () => {
    resendOtp(signupData.email, {
      onSuccess: () => {
        setResendTimer(60);
        resetOtp();
      },
    });
  };

  const goBack = () => {
    navigate("/signup");
  };

  const isLoading = isVerifying || isResending;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="p-3 md:p-4 text-center border border-purple-200 rounded-lg md:rounded-xl bg-purple-50/50 dark:bg-purple-900/20 dark:border-purple-800 backdrop-blur-sm">
        <Mail className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-1.5 md:mb-2 text-purple-600 dark:text-purple-400" />
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
          We sent a 6-digit code to
        </p>
        <p className="text-sm md:text-base font-medium text-purple-600 dark:text-purple-400">
          {signupData.email}
        </p>
      </div>

      <div className="flex justify-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-10 h-12 md:w-12 md:h-14 lg:w-14 lg:h-16 text-xl md:text-2xl font-bold text-center transition-all bg-white border-2 outline-none rounded-lg md:rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 md:focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isVerifying}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resend code in {resendTimer}s
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-purple-600 transition-colors dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>

      <div className="flex gap-2 md:gap-3 pt-1.5 md:pt-2">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          icon={ArrowLeft}
          onClick={goBack}
          disabled={isLoading}
          className="flex-1"
        >
          Back
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          onClick={handleVerify}
          disabled={isLoading || !otp.every(d => d !== "")}
          className="flex-1"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </div>

      <p className="mt-4 md:mt-6 text-xs md:text-sm text-center text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
