export default function DisabledButton({ text }: { text: string }) {
  return (
    <button className="w-full text-left text-sm opacity-50" disabled>
      <span className="w-full">{text}</span>
    </button>
  );
}
