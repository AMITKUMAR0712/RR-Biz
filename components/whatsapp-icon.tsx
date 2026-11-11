export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="whatsapp-mark"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.5 23.5l5.9-1.5A11.8 11.8 0 0 0 20.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 7.1c-.3-.6-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.5 4 6.1 5.4 3 .1 3.6-.3 4.2-.4.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.7-.4s-1.9-1-2.2-1.1c-.3-.1-.5-.2-.8.2-.2.4-.9 1.1-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.8-1.8-1-.9-1.7-2-1.9-2.4-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5 0-.6-.1-.2-.7-1.8-1-2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
