
const iconColors = {
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600",
  green: "bg-emerald-50 text-emerald-600",
};

export default function StatsCard({ title, value, icon, color }) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value ?? 0}</h2>
      </div>

      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColors[color] || iconColors.blue}`}>
        {icon}
      </div>
    </article>
  );
}
