import type { ReactNode } from 'react';

// A drawn price line rather than a stock photo, ending on the accent dot that marks "now".
const DecorativeLine = () => (
  <svg viewBox="0 0 400 160" aria-hidden="true" className="w-full" fill="none">
    <path
      d="M0 132 L36 120 L64 126 L98 98 L128 106 L162 84 L196 92 L224 62 L260 72 L292 44 L326 54 L360 30 L388 22"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="388" cy="22" r="8" strokeWidth="3" className="chart-dot" />
  </svg>
);

/** Full-bleed split: the block on the left half, the form on the right. */
export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="grid md:min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
    <aside className="on-block hidden flex-col justify-between gap-12 bg-block p-10 text-on-block lg:flex xl:p-12">
      <p className="max-w-lg text-5xl leading-[0.95] font-extrabold tracking-tight">
        Your stocks, without the noise.
      </p>
      <div className="max-w-md">
        <DecorativeLine />
        <p className="mt-6 text-on-block-muted">
          Follow the companies you care about, see how they moved today and read what’s moving them.
        </p>
      </div>
    </aside>
    <div className="flex items-center px-4 py-10 sm:px-6 lg:px-12 xl:px-20">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  </div>
);
