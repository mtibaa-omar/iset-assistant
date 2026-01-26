import { AlertCircle } from "lucide-react";

export function FormError({ message }) {
  if (!message) return null;

  return (
    <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <p className="text-red-800 text-sm">{message}</p>
    </div>
  );
}

export default FormError;
