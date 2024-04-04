export default function LoadingScreen() {
  return (
    <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden bg-white text-4xl text-slate-900">
      <span>Loading...</span>
      <svg
        className="h-[80px] animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
    </div>
  );
}
