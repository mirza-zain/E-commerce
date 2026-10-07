import { StarIcon } from "@phosphor-icons/react/dist/ssr";

const reviews = [
  {
    quote: "Oud Maracuja has the kind of dry-down people ask about. It opens bright, then settles into something warm and quietly luxurious. Two sprays lasted through dinner and the drive home.",
    name: "Hassan R.",
    detail: "Oud Maracuja",
  },
  {
    quote: "Pink Poison is playful without being too sweet. I wore it to a brunch and ended up taking the bottle along for the evening because the scent stayed soft and noticeable all day.",
    name: "Areeba M.",
    detail: "Pink Poison",
  },
  {
    quote: "Executive feels polished from the first spray. It has a clean, confident edge that works especially well for meetings, but it never becomes too sharp or overpowering.",
    name: "Usman K.",
    detail: "Executive",
  },
  {
    quote: "Maverick is my everyday choice now. Fresh, bold and easy to wear, with a familiar Sauvage-style energy but enough character to feel like its own fragrance.",
    name: "Bilal A.",
    detail: "Maverick",
  },
];

export default function Reviews() {
  return (
    <section className="w-full border-t border-neutral-200/80 py-16 sm:py-20" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col items-center justify-between gap-3 text-center sm:mb-12 md:flex-row md:items-end md:text-left">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">The Zarb Edit</p>
            <h2 id="reviews-heading" className="text-3xl font-medium sm:text-4xl md:text-5xl">Loved for the last note</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-neutral-500 sm:text-base">
            Fragrance notes from people who made these scents part of their routine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <article key={review.name} className="flex min-h-67.5 flex-col border border-neutral-200 bg-white/60 p-6 transition-colors duration-300 hover:border-neutral-400 sm:p-7">
              <div className="flex items-center gap-1 text-amber-600" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} weight="fill" className="size-4" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-neutral-700">“{review.quote}”</blockquote>
              <footer className="mt-6 border-t border-neutral-200 pt-4">
                <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500">{review.detail}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}