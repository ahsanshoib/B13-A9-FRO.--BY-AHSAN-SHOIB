export default function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[30vh]">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-red-700 rounded-full animate-spin" />
    </div>
  );
}