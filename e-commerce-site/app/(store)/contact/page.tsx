import {
  EnvelopeSimpleIcon,
  InstagramLogoIcon,
  PhoneIcon,
  TiktokLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

const contactDetails = [
  {
    label: "Email",
    value: "storezarb@gmail.com",
    href: "mailto:storezarb@gmail.com",
    icon: EnvelopeSimpleIcon,
  },
  {
    label: "Phone",
    value: "+92 XXX XXXXXXX",
    href: "tel:+92XXXXXXXXXX",
    icon: PhoneIcon,
  },
];

const socialLinks = [
  { label: "Instagram", icon: InstagramLogoIcon, href: "https://www.instagram.com/zarb.store/" },
  { label: "TikTok", icon: TiktokLogoIcon, href: "https://www.tiktok.com/@zarbstore7" },
];

export default function ContactPage() {
  return (
    <main className="w-full flex-1">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-neutral-500 font-medium">
            Zarb Official support
          </p>
          <h1 className="mt-5 text-5xl sm:text-6xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-neutral-900">
            Contact Us
          </h1>
          <p className="mt-7 max-w-xl text-lg sm:text-xl leading-relaxed text-neutral-600">
            Have a question about your order or our products? We&apos;re happy to help.
          </p>
        </div>

        <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 border-t border-neutral-300 pt-10 sm:pt-14">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {contactDetails.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="group flex min-h-52 flex-col justify-between rounded-2xl border border-neutral-300 bg-white/50 p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:border-black hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
              >
                <Icon className="size-8 text-neutral-700 transition-transform duration-200 group-hover:scale-110" weight="light" />
                <span>
                  <span className="block text-sm uppercase tracking-[0.2em] text-neutral-500">{label}</span>
                  <span className="mt-2 block wrap-break-word text-lg font-medium text-neutral-900">{value}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between border-l-0 border-neutral-300 lg:border-l lg:pl-12">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Follow us</p>
              <p className="mt-4 max-w-sm text-2xl sm:text-3xl leading-tight text-neutral-900">
                Stay close to the world of Zarb Official.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-black hover:bg-black hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
                >
                  <Icon className="size-5" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
