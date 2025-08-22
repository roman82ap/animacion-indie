export default function Series() {
  const seriesList = [
    {
      title: "Ecos del Vacío",
      desc: "Una serie de ciencia ficción oscura.",
      yt: "dQw4w9WgXcQ",
    },
    {
      title: "Mate & Monstruos",
      desc: "Un corto cómico con estilo latino.",
      yt: "9bZkp7q19f0",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Series independientes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {seriesList.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50"
          >
            <a
              href={`https://youtu.be/${s.yt}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://img.youtube.com/vi/${s.yt}/hqdefault.jpg`}
                alt={s.title}
                className="w-full aspect-video object-cover"
              />
            </a>
            <div className="p-4">
              <h2 className="font-semibold text-xl">{s.title}</h2>
              <p className="text-neutral-400 text-sm">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
