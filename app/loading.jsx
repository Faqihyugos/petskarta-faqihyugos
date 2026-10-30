export default function Loading() {
  return (
    <div className="flex flex-col py-8 sm:py-12 animate-pulse">
      {/* Skeleton Hero Header */}
      <section className="mb-8">
        <div className="h-6 w-48 rounded-full bg-garis mb-4"></div>
        <div className="h-10 w-72 sm:w-96 rounded-xl bg-garis mb-3"></div>
        <div className="h-5 w-full max-w-lg rounded-lg bg-garis/60 mb-2"></div>
        <div className="h-4 w-40 rounded-lg bg-garis/50"></div>
      </section>

      {/* Skeleton Search and Filter */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="h-12 w-full rounded-xl bg-garis/60"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 rounded-full bg-garis"></div>
          <div className="h-8 w-28 rounded-full bg-garis/60"></div>
          <div className="h-8 w-32 rounded-full bg-garis/60"></div>
          <div className="h-8 w-24 rounded-full bg-garis/60"></div>
        </div>
      </div>

      {/* Skeleton Grid Kartu Produk */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-garis bg-latar p-3"
          >
            <div className="aspect-square w-full rounded-xl bg-garis/70 mb-3"></div>
            <div className="h-3 w-16 rounded bg-garis/50 mb-2"></div>
            <div className="h-5 w-3/4 rounded bg-garis mb-3"></div>
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="h-6 w-24 rounded bg-garis"></div>
              <div className="h-8 w-8 rounded-lg bg-garis/50"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

