export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      role="img"
      aria-label="New Frontier Security"
      className={className}
    >
      <circle cx="40" cy="40" r="40" fill="#d81b60" />
      <path
        d="M40 14c10.4 8.2 16 18.6 16 30.4 0 7.4-2.4 13.8-7.2 18.6L40 50.8 31.2 63c-4.8-4.8-7.2-11.2-7.2-18.6C24 32.6 29.6 22.2 40 14Z"
        fill="white"
      />
      <circle cx="40" cy="36" r="8" fill="#d81b60" />
      <path
        d="M22 44c6-2.4 12.6-3.6 18-3.6s12 1.2 18 3.6"
        fill="none"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
