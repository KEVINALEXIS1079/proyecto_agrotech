export default function AuthBackButton() {
  return (
    <button
      type="button"
      aria-label="Volver"
      className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5"
      onClick={() => history.back()}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
