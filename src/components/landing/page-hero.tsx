import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Consistent page hero used on every interior route. Keeps composition and
 * spacing aligned with the home hero without repeating markup.
 */
export function PageHero({ eyebrow, title, description, image, imageAlt }: Props) {
  return (
    <header className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-spring-soft/40 via-white to-white">
      <div className="absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-spring/10 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <span className="inline-block px-3 py-1 rounded-full bg-spring/10 text-forest text-xs font-bold uppercase tracking-widest mb-6">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05] text-balance">
            {title}
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl text-pretty leading-relaxed">
            {description}
          </p>
        </div>
        {image && (
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl shadow-xl outline outline-1 -outline-offset-1 outline-black/5 aspect-[4/3]">
              <img
                src={image}
                alt={imageAlt ?? ""}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
