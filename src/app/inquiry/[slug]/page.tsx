import { notFound } from "next/navigation";
import { InquiryOrderSummary } from "@/components/InquiryOrderSummary";
import { getProductBySlug, products } from "@/lib/products";
import { fetchSupabaseProductBySlug } from "@/lib/supabase-products";

type InquiryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export const dynamic = "force-dynamic";

export default async function InquiryPage({ params }: InquiryPageProps) {
  const { slug } = await params;
  const product =
    (await fetchSupabaseProductBySlug(slug).catch(() => null)) ??
    getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="inquiry-shell">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="content-reveal overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="inquiry-summary p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Checkout inquiry
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Share your details and our team will contact you to confirm
                availability, delivery, and payment options.
              </p>
              <div
                className="mt-8 aspect-[4/3] rounded-2xl border border-white/10 bg-white/10 bg-cover bg-center shadow-xl"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
              <InquiryOrderSummary fallbackProduct={product} />
            </aside>

            <form className="inquiry-form grid gap-5 p-6 sm:p-8 lg:p-10 md:grid-cols-2">
              <label className="form-field">
                First name*
                <input type="text" placeholder="Enter first name" required />
              </label>
              <label className="form-field">
                Last name*
                <input type="text" placeholder="Enter last name" required />
              </label>
              <label className="form-field">
                Email*
                <input type="email" placeholder="Enter email address" required />
              </label>
              <label className="form-field">
                Phone number*
                <div className="phone-control">
                  <select defaultValue="+971" aria-label="Country code">
                    <option value="+971">+971</option>
                    <option value="+966">+966</option>
                    <option value="+91">+91</option>
                    <option value="+968">+968</option>
                    <option value="+974">+974</option>
                  </select>
                  <input
                    type="text"
                    inputMode="tel"
                    autoComplete="off"
                    placeholder="55 931 9338"
                    required
                  />
                </div>
              </label>
              <label className="form-field md:col-span-2">
                Country
                <select defaultValue="">
                  <option value="" disabled>
                    Select a Country
                  </option>
                  <option>United Arab Emirates</option>
                  <option>Saudi Arabia</option>
                  <option>India</option>
                  <option>Oman</option>
                  <option>Qatar</option>
                </select>
              </label>
              <label className="form-field md:col-span-2">
                Message
                <textarea
                  placeholder="Mention quantity, delivery location, or any special request"
                  rows={4}
                />
              </label>
              <label className="terms-check md:col-span-2">
                <input type="checkbox" required />
                <span>I accept the Terms</span>
              </label>
              <button className="animated-button inquiry-submit md:col-span-2">
                Inquire Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
