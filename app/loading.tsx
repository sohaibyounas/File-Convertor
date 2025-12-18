export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-purple-500/20"></div>
        <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin-reverse"></div>
      </div>
    </div>
  );
}
