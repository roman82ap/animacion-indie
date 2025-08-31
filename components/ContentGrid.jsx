import WorkCard from './WorkCard';

export default function ContentGrid({ title, items = [] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {title ? <h1 className="text-3xl font-bold mb-6">{title}</h1> : null}
      {items.length === 0 ? (
        <div className="text-neutral-400">Pronto…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <WorkCard key={it.slug} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}
