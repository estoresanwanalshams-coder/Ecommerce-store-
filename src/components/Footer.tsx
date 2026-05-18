import Link from "next/link";

const footerLinks = [
  { label: "Categories", href: "/categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping", href: "/shipping" },
];

const contactNumber = "+971 55 931 9338";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="brand-text text-xl font-bold tracking-wide">
            Storefront
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
            A clean ecommerce experience for curated products, seasonal offers,
            and simple shopping from product discovery to checkout.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Explore
          </h2>
          <nav className="mt-4 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <p>support@storefront.com</p>
            <a href="tel:+971559319338" className="block transition hover:text-white">
              {contactNumber}
            </a>
            <p>Mon to Sat, 10:00 AM - 7:00 PM</p>
            <p>United Arab Emirates</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-zinc-400">
        <p>&copy; 2026 Storefront. All rights reserved.</p>
        <p className="mt-2">
          Designed and developed by{" "}
          <a
            href="https://hussainiitservices.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white transition hover:text-zinc-200"
          >
            hussainiitservices.com
          </a>
        </p>
      </div>
    </footer>
  );
}
