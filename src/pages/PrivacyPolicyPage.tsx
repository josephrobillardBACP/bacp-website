import SiteSeo from '@/components/SiteSeo';
import { corePageSeo } from '@/lib/siteSeo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function PrivacyPolicyPage() {
  return (
    <>
      <SiteSeo page={corePageSeo('/privacy-policy')!} />
      <Header />
      <main className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-none text-navy/80">
            <h1 className="mb-8 text-4xl font-bold text-navy">Privacy Policy</h1>
            <p className="mb-8 text-sm text-navy/50">Last updated: March 31, 2026</p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Overview</h2>
            <p className="mb-4">
              Blue Angel Clinical Partners LLC respects your privacy and is committed to protecting the
              information you share with us through this website. This Privacy Policy explains how
              we collect, use, and safeguard information when you visit this website, submit a
              form, or otherwise interact with our online content.
            </p>
            <p className="mb-4">
              By using this website, you consent to the collection and use of information in
              accordance with this Privacy Policy.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">
              Information We Collect
            </h2>
            <p className="mb-4">
              We may collect personally identifiable information that you voluntarily provide to us
              when you complete website forms or contact us through the site. This may include your
              name, email address, phone number, and any additional details you choose to provide.
            </p>
            <p className="mb-4">
              We may also collect limited non-personal information automatically when you visit the
              site, including browser type, device type, general geographic location, IP address,
              pages viewed, and the way visitors interact with the site.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">
              How We Use Your Information
            </h2>
            <p className="mb-4">We may use collected information to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Respond to inquiries or appointment-related requests.</li>
              <li>Provide membership or practice information.</li>
              <li>Improve the performance and content of the website.</li>
              <li>Understand how visitors use the website.</li>
              <li>Maintain website security and integrity.</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">
              Cookies and Analytics
            </h2>
            <p className="mb-4">
              Like many websites, we may use cookies, analytics tools, and similar technologies to
              understand visitor behavior and improve website performance. Cookies are small text
              files placed on your device that help collect standard internet log information and
              visitor behavior information in an anonymous form.
            </p>
            <p className="mb-4">
              Information generated through these tools may include your IP address and general site
              activity. This information may be used to evaluate visitor use of the website and to
              compile statistical reports about website activity.
            </p>
            <p className="mb-4">
              We will never use analytics tools to intentionally track or collect personally
              identifiable information unless you choose to submit that information to us through a
              form on this website.
            </p>
            <p className="mb-4">
              We record information such as your geographical location, your internet service
              provider, and your IP address. We also record information about the software you are
              using to browse our website, such as the type of computer or device and screen
              resolution. We use this information in aggregate to assess the popularity of our pages
              and how well we are providing content to visitors.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">
              Accessing or Removing Your Information
            </h2>
            <p className="mb-4">
              If you would like us to remove personally identifiable information from our systems,
              please contact us through our contact page or by mail at the address below. When we
              receive any request to access, edit, or delete personally identifiable information, we
              will first take reasonable steps to verify your identity before granting access or
              otherwise taking action. This helps safeguard your information.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Jurisdiction</h2>
            <p className="mb-4">
              Our Privacy Policy has been compiled so as to comply with the law of every country or
              legal jurisdiction in which we aim to do business. If you believe it fails to satisfy
              the law of your jurisdiction, we would like to hear from you.
            </p>
            <p className="mb-4">
              Ultimately, it is your choice whether to use this website. If you have any questions
              regarding this Privacy Policy, please contact us using the information below.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Contact Us</h2>
            <p className="mb-2">Blue Angel Clinical Partners LLC</p>
            <p className="mb-4">
              <a
                href="mailto:info@blueangelclinical.com"
                className="text-steely-blue underline underline-offset-4 hover:text-navy"
              >
                info@blueangelclinical.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PrivacyPolicyPage;
