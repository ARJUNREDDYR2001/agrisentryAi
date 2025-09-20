import { cn } from "@/lib/utils";
import * as React from "react";

const LeafLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-leaf", props.className)}
    {...props}
  >
    <path d="M11 20A7 7 0 0 1 4 13V8a7.999 7.999 0 0 1 10-6 8 8 0 0 1 8 8 8 8 0 0 1-2 5 8 8 0 0 0-3-5.22" />
    <path d="M11 20A7 7 0 0 1 4 13V8" />
  </svg>
);

export default LeafLogo;
