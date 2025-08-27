export default function ThumbCard({ item }) {
  return (
    <a
      href={item.href || "#"}
      className="group block min-w-[160px] sm:min-w-[180px] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/50 hover:-translate-y-0.5 transition"
      title={item.title}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={item.thumb}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
        />
        {item.tag && (
          <span className="absolute left-2 top-2 text-[10px] uppercase tracking-wide bg-black/70 border border-neutral-700 px-2 py-0.5 rounded">
            {item.tag}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-sm font-semibold line-clamp-2">{item.title}</h3>
        <p className="text-[11px] text-neutral-400 mt-1">{item.meta}</p>
      </div>
    </a>
  );
}
