import { Target, ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a className="brand" href="/">
      <span className="brand-mark">
        <Target />
        <ArrowUpRight />
      </span>
      <span>
        LuxGrowth <b>AI</b>
      </span>
    </a>
  );
}
