export const Spinner = ({ label = 'Loading' }: { label?: string }) => (
  <div role="status" className="flex items-center justify-center py-4">
    <div
      aria-hidden="true"
      className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
    />
    <span className="sr-only">{label}…</span>
  </div>
);
