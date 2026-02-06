import { LoaderCircle } from "lucide-react";

export default function Spinner({ className = "", size = "h-[6.4rem] w-[6.4rem]" }) {
  return (
    <div
      className={`flex items-center justify-center my-4 ${className}`}
      aria-label="Chargement"
      role="status"
    >
      <LoaderCircle
        className={`${size} animate-spin text-gray-400`}
        strokeWidth={1.5}
      />
    </div>
  );
}
