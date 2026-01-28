import { LoaderCircle } from "lucide-react";

export default function Spinner({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center my-[4.8rem] ${className}`}
      aria-label="Loading"
      role="status"
    >
      <LoaderCircle
        className="h-[6.4rem] w-[6.4rem] animate-spin text-gray-400"
        strokeWidth={1.5}
      />
    </div>
  );
}
