// components/YouTubePlayer.jsx
export default function YouTubePlayer({ youtubeId, title = "" }) {
  if (!youtubeId) return null;
  return (
    <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-xl border border-neutral-800"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
