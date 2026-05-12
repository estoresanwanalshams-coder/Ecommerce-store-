const contactNumber = "+971 55 931 9338";

export default function ContactPage() {
  return (
    <section className="page-shell bg-zinc-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="content-reveal rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Contact us
          </p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">
            Send us a message
          </h1>
          <form className="mt-8 grid gap-5">
            <label className="light-form-field">
              Name
              <input type="text" placeholder="Enter your name" required />
            </label>
            <label className="light-form-field">
              Email address
              <input type="email" placeholder="Enter email address" required />
            </label>
            <label className="light-form-field">
              Contact number
              <input type="tel" placeholder="+971 Enter phone number" required />
            </label>
            <label className="light-form-field">
              Message
              <textarea placeholder="Write your message" rows={5} required />
            </label>
            <button className="animated-button rounded-md bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-700">
              Submit
            </button>
          </form>
        </div>

        <aside className="content-reveal rounded-2xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Contact details
          </p>
          <h2 className="mt-3 text-3xl font-bold">We are here to help</h2>
          <div className="mt-8 space-y-6 text-sm text-zinc-300">
            <div>
              <p className="font-bold text-white">Phone / WhatsApp</p>
              <a href="tel:+971559319338" className="mt-2 block hover:text-white">
                {contactNumber}
              </a>
            </div>
            <div>
              <p className="font-bold text-white">Email</p>
              <p className="mt-2">support@storefront.com</p>
            </div>
            <div>
              <p className="font-bold text-white">Working hours</p>
              <p className="mt-2">Mon to Sat, 10:00 AM - 7:00 PM</p>
            </div>
            <div>
              <p className="font-bold text-white">Location</p>
              <p className="mt-2">United Arab Emirates</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
