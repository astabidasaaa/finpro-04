import { Separator } from '@/components/ui/separator';

export default function FormSeparator({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center">
      <Separator className="flex-grow bg-main-dark" />
      <div className="px-4 font-semibold text-sm text-center">{text}</div>
      <Separator className="flex-grow bg-main-dark" />
    </div>
  );
}
