import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/"},
  { label: "Categories", href: "/categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "FAQ", href: "/faq" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

const contactNumber = "+971 55 931 9338";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="brand-text text-xl font-bold tracking-wide"
          >
            Storefront
          </Link>

          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
            A clean ecommerce experience for curated products,
            seasonal offers, and simple shopping from product
            discovery to checkout.
          </p>
        </div>

        {/* Main Links */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Explore
          </h2>

          <nav className="mt-4 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-zinc-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Policy Links */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Policies
          </h2>

          <nav className="mt-4 flex flex-col gap-3">
            {policyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-zinc-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Contact
          </h2>

          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <p>support@storefront.com</p>

            <a
              href="tel:+971559319338"
              className="w-fit block transition hover:text-white"
            >
              {contactNumber}
            </a>

            <p>Mon to Sat, 10:00 AM - 7:00 PM</p>
            <p>United Arab Emirates</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
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