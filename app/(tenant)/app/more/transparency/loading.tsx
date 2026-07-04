export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-36 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3"><div className="skeleton h-28 rounded-3xl" /><div className="skeleton h-28 rounded-3xl" /></div>
      <div className="skeleton h-52 rounded-3xl" />
    </div>
  );
}
