export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-zinc-800">
      <h1 className="mb-8 text-4xl font-bold">
        Terms & Conditions
      </h1>

      <div className="space-y-6 leading-8">
        <p>
          Welcome to Storefront. By accessing this website,
          you agree to comply with our terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold">
          Orders & Payments
        </h2>

        <p>
          All payments are securely processed through trusted
          payment gateways.
        </p>

        <h2 className="text-2xl font-semibold">
          Shipping
        </h2>

        <p>
          Delivery timelines may vary depending on location
          and logistics availability.
        </p>

        <h2 className="text-2xl font-semibold">
          Privacy
        </h2>

        <p>
          Your information is protected using secure
          encryption technologies.
        </p>
      </div>
    </div>
  );
}