import { useState } from 'react';
import Page from '@/components/Page';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import NetworkMotif from '@/components/NetworkMotif';
import IntakeForm from '@/components/IntakeForm';
import partnerConversation from '@/assets/partner-conversation.webp';
import partnerConversationSm from '@/assets/partner-conversation-sm.webp';

type PartnerPath = 'selling' | 'joining';

const partnerPaths: Record<
  PartnerPath,
  {
    buttonLabel: string;
  }
> = {
  selling: {
    buttonLabel: 'I own a practice',
  },
  joining: {
    buttonLabel: 'I want to join a practice',
  },
};

function BeAPartnerPage() {
  const [selectedPath, setSelectedPath] = useState<PartnerPath | null>(null);

  return (
    <Page title="Become a Partner">
      <PageHero
        eyebrow="Become a Partner"
        title="Choose the conversation that fits your next chapter."
        lede="Looking for a concierge medicine practice partner? Talk with Blue Angel about practice succession, operational support or joining an established concierge practice. Choose the path that fits your goals to start a confidential conversation."
        image={partnerConversation}
        imageMobile={partnerConversationSm}
        decoration={<NetworkMotif variant="partner" className="opacity-40" />}
        imageAlt="Watercolour of a physician and a visitor talking across a small table by a window, the bay, Bay Bridge and San Francisco skyline beyond"
        actions={
          <>
            {(Object.keys(partnerPaths) as PartnerPath[]).map((path) => {
              const isSelected = selectedPath === path;

              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => setSelectedPath(path)}
                  aria-pressed={isSelected}
                  aria-controls="partner-inquiry"
                  className={`inline-flex min-h-[3.75rem] items-center justify-center border px-6 py-4 text-sm font-semibold tracking-[0.01em] shadow-[0_10px_24px_rgba(6,56,98,0.10)] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                    isSelected
                      ? 'border-gold bg-navy text-white shadow-[0_16px_32px_rgba(6,56,98,0.22)]'
                      : 'border-navy/15 bg-white text-navy hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_32px_rgba(6,56,98,0.18)]'
                  }`}
                >
                  {partnerPaths[path].buttonLabel}
                </button>
              );
            })}
          </>
        }
      />

      {selectedPath && (
        <section className="relative overflow-hidden bg-light-gray py-20 md:py-28">
          <NetworkMotif variant="b" className="opacity-30" />
          <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
            <Reveal key={selectedPath}>
              <div id="partner-inquiry">
                <IntakeForm kind={selectedPath} />
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </Page>
  );
}

export default BeAPartnerPage;
