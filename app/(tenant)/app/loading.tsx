export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-9 w-2/3 rounded-2xl" />
      <div className="skeleton h-40 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3"><div className="skeleton h-28 rounded-3xl" /><div className="skeleton h-28 rounded-3xl" /></div>
      <div className="skeleton h-32 rounded-3xl" />
    </div>
  );
}
