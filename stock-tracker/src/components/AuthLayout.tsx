import type { ReactNode } from 'react';

// A drawn price line rather than a stock photo: white on ultramarine, ending on
// the marigold dot that marks "now" throughout the app.
const DecorativeLine = () => (
  <svg viewBox="0 0 400 160" aria-hidden="true" className="w-full" fill="none">
    <path
      d="M0 132 L36 120 L64 126 L98 98 L128 106 L162 84 L196 92 L224 62 L260 72 L292 44 L326 54 L360 30 L388 22"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="388" cy="22" r="8" fill="#ffc94a" stroke="white" strokeWidth="3" />
  </svg>
);

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-2 lg:items-stretch lg:py-12">
    <aside className="on-brand hidden flex-col justify-between rounded-block bg-brand p-12 text-white lg:flex">
      <div>
        <p className="text-6xl leading-[0.95] font-extrabold tracking-tight">
          Your stocks, without the noise.
        </p>
        <p className="mt-6 max-w-sm text-lg text-brand-soft">
          Follow the companies you care about, see how they moved today and read what’s moving them.
        </p>
      </div>
      <DecorativeLine />
    </aside>
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  </div>
);
