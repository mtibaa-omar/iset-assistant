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
    <div className="space-y-6">
      <div className="p-4 text-center border border-purple-200 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 dark:border-purple-800 backdrop-blur-sm">
        <Mail className="w-12 h-12 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We sent a 6-digit code to
        </p>
        <p className="font-medium text-purple-600 dark:text-purple-400">
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
            className="w-12 text-2xl font-bold text-center transition-all bg-white border-2 outline-none h-14 md:w-14 md:h-16 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 transition-colors dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-2">
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

      <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-400">
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
