import SiteSeo from '@/components/SiteSeo';
import { corePageSeo } from '@/lib/siteSeo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function TermsOfServicePage() {
  return (
    <>
      <SiteSeo page={corePageSeo('/terms-of-service')!} />
      <Header />
      <main className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-none text-navy/80">
            <h1 className="mb-8 text-4xl font-bold text-navy">Terms of Service</h1>
            <p className="mb-8 text-sm text-navy/50">Last updated: March 31, 2026</p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Agreement to Terms</h2>
            <p className="mb-4">
              These Terms of Use constitute a legally binding agreement made between you, whether
              personally or on behalf of an entity (&quot;you&quot;), and Blue Angel Clinical Partners LLC In
              this document, &quot;we,&quot; &quot;our,&quot; or &quot;us&quot; refer to Blue Angel Clinical
              Partners LLC concerning your access to and use of this website, as well as any other media
              form, media channel, or mobile website related, linked, or otherwise connected thereto
              (collectively, the &quot;Site&quot;).
            </p>
            <p className="mb-4">
              By accessing or using the Site, you acknowledge that you have read, understand, and
              agree, without limitation or qualification, to be bound by these Terms of Use.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">
              Intellectual Property Rights
            </h2>
            <p className="mb-4">
              Unless otherwise indicated, the Site is our proprietary property and all source code,
              databases, functionality, software, website designs, audio, video, text, photographs,
              and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks,
              service marks, and logos contained therein (the &quot;Marks&quot;) are owned or
              controlled by us or licensed to us, and are protected by copyright and trademark laws
              and various other intellectual property rights and unfair competition laws of the
              United States, international copyright laws, and international conventions.
            </p>
            <p className="mb-4">
              No content or marks may be copied, reproduced, aggregated, republished, uploaded,
              posted, publicly displayed, encoded, translated, transmitted, distributed, sold,
              licensed, or otherwise exploited for any commercial purpose whatsoever without our
              express prior written permission.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">User Representations</h2>
            <p className="mb-4">
              By using the Site, you represent and warrant that: (1) you have the legal capacity
              and you agree to comply with these Terms of Use; (2) you are not a minor in the
              jurisdiction in which you reside; (3) you will not access the Site through automated
              or non-human means, whether through a bot, script, or otherwise; (4) you will not use
              the Site for any illegal or unauthorized purpose; and (5) your use of the Site will
              not violate any applicable law or regulation.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Prohibited Activities</h2>
            <p className="mb-4">
              You may not access or use the Site for any purpose other than that for which we make
              the Site available. The Site may not be used in connection with any commercial
              endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p className="mb-4">As a user of the Site, you agree not to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                Systematically retrieve data or content from the Site to create or compile a
                collection, compilation, database, or directory without written permission from us.
              </li>
              <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
              <li>Use the Site in a manner inconsistent with any applicable laws or regulations.</li>
              <li>
                Harass, annoy, intimidate, or threaten any of our employees engaged in providing
                any portion of the Site to you.
              </li>
              <li>
                Use the Site as part of any effort to compete with us or otherwise use the Site
                and/or the Content for any revenue-generating endeavor or commercial enterprise.
              </li>
              <li>Use the Site to advertise or offer to sell goods and services.</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">User Content</h2>
            <p className="mb-4">
              When you transmit, upload, post, email, or otherwise make available data, text,
              software, music, sound, photographs, graphics, images, videos, messages, or other
              materials (&quot;User Content&quot;) on the Site, you are entirely responsible for
              such User Content.
            </p>
            <p className="mb-4">
              You agree not to engage in or assist or encourage others to engage in transmitting,
              uploading, posting, emailing, or otherwise making available on the Site User Content
              that (a) is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory,
              vulgar, obscene, pornographic, libelous, invasive of another&apos;s privacy, hateful,
              or racially, ethnically, or otherwise objectionable; (b) you do not have a right to
              make available under any law or under contractual or fiduciary relationships; (c) is
              known by you to be false, inaccurate, or misleading; (d) you were compensated for or
              granted any consideration by any third party; or (e) infringes any patent, trademark,
              trade secret, copyright, or other proprietary rights of any party.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Privacy Policy</h2>
            <p className="mb-4">
              We care about data privacy and security. Please review our Privacy Policy. By using
              the Site, you agree to be bound by our Privacy Policy, which is incorporated into
              these Terms of Use. Please be advised that the Site is hosted in the United States. If
              you access the Site from any other region of the world with laws or other requirements
              governing personal data collection, use, or disclosure that differ from applicable
              laws in the United States, then through your continued use of the Site, you are
              transferring your data to the United States, and you agree to have your data
              transferred to and processed in the United States.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Term and Termination</h2>
            <p className="mb-4">
              These Terms of Use shall remain in full force and effect while you use the Site.
              Without limiting any other provision of these Terms of Use, we reserve the right to,
              in our sole discretion and without notice or liability, deny access to and use of the
              Site (including blocking certain IP addresses), to any person for any reason or for no
              reason, including without limitation for breach of any representation, warranty, or
              covenant contained in these Terms of Use or any applicable law or regulation. We may
              terminate your use of the Site at any time, without warning, in our sole discretion.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Corrections</h2>
            <p className="mb-4">
              There may be information on the Site that contains typographical errors,
              inaccuracies, or omissions, including descriptions, availability, and various other
              information. We reserve the right to correct any errors, inaccuracies, or omissions
              and to change or update the information on the Site at any time, without prior notice.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
              affiliates, and all of our respective officers, employees, and agents, from and
              against any loss, damage, liability, claim, or demand, including reasonable
              attorneys&apos; fees and expenses, made by any third party due to or arising out of:
              (1) use of the Site; (2) breach of these Terms of Use; (3) any breach of your
              representations and warranties set forth in these Terms of Use; or (4) any overt
              harmful act toward any other user of the Site with whom you connected via the Site.
            </p>
            <p className="mb-4">
              Notwithstanding the foregoing, we reserve the right, at your expense, to assume the
              exclusive defense and control of any matter for which you are required to indemnify
              us, and you agree to cooperate, at your own expense, with our defense of such claims.
              We will use reasonable efforts to notify you of any such claim, action, or proceeding
              that is subject to this indemnification upon becoming aware of it.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">
              Electronic Communication, Transactions, and Signatures
            </h2>
            <p className="mb-4">
              Visiting the Site, sending us emails, and completing online forms constitute
              electronic communications. You consent to receive electronic communications, and you
              agree that all agreements, notices, disclosures, and other communications we provide
              to you electronically, via email and on the Site, satisfy any legal requirement that
              such communication be in writing.
            </p>
            <p className="mb-4">
              YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER
              RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS
              INITIATED OR COMPLETED BY US OR VIA THE SITE.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Miscellaneous</h2>
            <p className="mb-4">
              These Terms of Use and any policies or operating rules posted by us on the Site
              constitute the entire agreement and understanding between you and us. Our failure to
              exercise or enforce any right or provision of these Terms of Use shall not operate as
              a waiver of such right or provision.
            </p>
            <p className="mb-4">
              These Terms of Use operate to the fullest extent permissible by law. We may assign any
              or all of our rights and obligations to others at any time. We shall not be
              responsible or liable for any loss, damage, delay, or failure to act caused by any
              cause beyond our reasonable control.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">Contact Us</h2>
            <p className="mb-2">
              In order to resolve a complaint regarding the Site or to receive further information
              regarding the use of the Site, please contact us at:
            </p>
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

export default TermsOfServicePage;
