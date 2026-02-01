export default function TextMessage({ body }) {
  return (
    <div className="px-4 py-2.5 max-w-[300px]">
      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
        {body}
      </p>
    </div>
  );
}
