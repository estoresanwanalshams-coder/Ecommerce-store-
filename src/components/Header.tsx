import Link from "next/link";
import { CartIconLink } from "@/components/CartIconLink";
import { DynamicCategoryLinks } from "@/components/DynamicCategoryLinks";
import { HeaderSearch } from "@/components/HeaderSearch";
import { TopOfferText } from "@/components/TopOfferText";

const contactNumber = "+971 55 931 9338";
const contactHref = "tel:+971559319338";

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l2.1 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      />
    </svg>
  );
}

export function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-2 text-center sm:grid-cols-[1fr_auto_1fr] sm:text-left">
          <a
            href={contactHref}
            className="justify-self-center transition hover:text-zinc-200 sm:justify-self-start"
          >
            Call us: {contactNumber}
          </a>
          <TopOfferText />
          <span className="hidden sm:block" aria-hidden="true" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="brand-text text-xl font-bold tracking-wide text-zinc-950">
          Storefront
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <div className="group relative py-3">
            <Link href="/categories" className="nav-link flex items-center">
              Categories
            </Link>
            <div className="dropdown-panel invisible absolute left-0 top-full w-64 border border-zinc-200 bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col">
                <DynamicCategoryLinks />
              </div>
            </div>
          </div>
          <Link href="/about" className="nav-link">
            About Us
          </Link>
          <Link href="/contact" className="nav-link">
            Contact Us
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <HeaderSearch />
          <CartIconLink />
        </div>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900">
            Menu
          </summary>
          <div className="absolute right-0 mt-3 w-64 border border-zinc-200 bg-white p-4 shadow-xl">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-4">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-zinc-950">Categories</span>
                <DynamicCategoryLinks mobile />
              </div>
              <HeaderSearch />
              <Link href="/about" className="nav-link">
                About Us
              </Link>
              <Link href="/contact" className="nav-link">
                Contact Us
              </Link>
              <Link
                href="/cart"
                className="primary-action inline-flex items-center justify-center gap-2 text-center"
              >
                <CartIcon />
                Cart
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
