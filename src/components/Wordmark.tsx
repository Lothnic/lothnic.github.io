import { cn } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
};

export function Wordmark({ className }: WordmarkProps) {
  return (
    <div
      className={cn(
        "hw-feature-stop hw-wordmark relative z-1 mt-[12rem] w-screen left-1/2 -translate-x-1/2 translate-y-[8px] text-center max-md:mt-[4rem]",
        className,
      )}
    >
      LOTH<span style={{ display: "inline-block", transform: "scaleX(-1)" }}>N</span>IC
    </div>
  );
}
