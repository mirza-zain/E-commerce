import { StarIcon } from "@phosphor-icons/react/dist/ssr";

const reviews = [
  {
    quote: "Oud Maracuja surprised me in the best way. It starts off bright and fruity, then dries down into this warm, rich scent that feels really premium. I got compliments the same day I wore it.",
    name: "Hassan R.",
    detail: "Oud Maracuja",
  },
  {
    quote: "Pink Poison is sweet but not overwhelming. It's soft, feminine, and lasts way longer than I expected. I've been wearing it daily and it still feels special.",
    name: "Areeba M.",
    detail: "Pink Poison",
  },
  {
    quote: "Executive is exactly the kind of fragrance I wanted for office and formal events. Clean, confident, and masculine without being too strong. It gives a very put-together vibe.",
    name: "Usman K.",
    detail: "Executive",
  },
  {
    quote: "Maverick has become my go-to fragrance. It's fresh, bold, and lasts for hours. If you like strong, clean scents that get noticed, this one is worth it.",
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