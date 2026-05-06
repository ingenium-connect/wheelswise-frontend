"use client";

// cSpell:ignore ODPC POCAMLA uberrimae fidei reinsurers anonymised organisational unauthorised licence

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, Cookie } from "lucide-react";

const TABS = [
  { id: "privacy", label: "Privacy Policy", icon: Shield },
  { id: "disclaimer", label: "General Disclaimer", icon: AlertTriangle },
  { id: "cookies", label: "Cookies Policy", icon: Cookie },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-bold text-[#1e3a5f] mt-8 mb-3 first:mt-0">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
        {number}
      </span>
      {title}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 ml-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-[#334e68]">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#334e68] leading-relaxed">{children}</p>;
}

function LastUpdated({ date }: { date: string }) {
  return (
    <p className="text-xs text-muted-foreground mb-6">Last Updated: {date}</p>
  );
}

function PrivacyPolicy() {
  return (
    <div>
      <LastUpdated date="2026-04-21" />

      <Prose>
        At Med-Gen Insurance Agency (&ldquo;Med-Gen&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;), your privacy is important to us. This Privacy Policy
        sets out how we collect, use, share, and protect your personal data in
        accordance with the Data Protection Act, 2019 (DPA) and the regulations
        of the Office of the Data Protection Commissioner (ODPC) of Kenya. By
        using our platform, you acknowledge that you have read and understood
        this policy.
      </Prose>

      <SectionHeading number="1" title="Who We Are" />
      <Prose>
        Med-Gen Insurance Agency is a licensed insurance intermediary registered
        in Kenya and operating under the Insurance Act (Cap. 487). We act as
        both a data controller in respect of information you provide directly to
        us, and as a data processor when handling personal data on behalf of our
        underwriting partners. Insurers retain independent data controller
        status for the purposes of underwriting, policy administration, and
        claims management.
      </Prose>

      <SectionHeading number="2" title="Personal Data We Collect" />
      <Prose>
        To provide you with our services, we collect only what is necessary,
        including:
      </Prose>
      <div className="mt-2">
        <BulletList
          items={[
            "Identity and contact details (name, national ID, KRA PIN, phone number, email address)",
            "Vehicle and asset information relevant to your insurance cover",
            "Policy and risk-related data required by underwriters",
            "KYC and AML compliance documents as required by law",
            "Transaction and payment records",
            "Technical and platform usage data for security and performance",
          ]}
        />
      </div>

      <SectionHeading number="3" title="How We Use Your Data" />
      <Prose>
        Your personal data is processed for clearly defined purposes, including:
      </Prose>
      <div className="mt-2">
        <BulletList
          items={[
            "Issuing insurance quotations, policies, and cover certificates",
            "Facilitating underwriting, endorsements, and claims handling",
            "Fulfilling our obligations under Kenyan insurance and tax law",
            "Conducting identity verification and KYC/AML compliance checks",
            "Preventing fraud, money laundering, and platform abuse",
            "Communicating with you about your policy and account",
            "Improving the performance and security of our platform",
          ]}
        />
      </div>

      <SectionHeading number="4" title="Legal Basis for Processing" />
      <Prose>
        We process your personal data on one or more of the following lawful
        grounds under the Data Protection Act, 2019:
      </Prose>
      <div className="mt-2">
        <BulletList
          items={[
            "Your explicit consent, where required",
            "Performance of a contract to which you are a party",
            "Compliance with a legal or regulatory obligation",
            "Legitimate interests pursued by Med-Gen or our underwriting partners, where not overridden by your rights",
          ]}
        />
      </div>

      <SectionHeading number="5" title="Sharing Your Data" />
      <Prose>
        We share your personal data only where necessary and with appropriate
        safeguards in place. Recipients may include:
      </Prose>
      <div className="mt-2 mb-3">
        <BulletList
          items={[
            "Licensed insurers and reinsurers for underwriting and claims purposes",
            "Payment service providers for transaction processing",
            "The Insurance Regulatory Authority (IRA) and other regulatory bodies",
            "The Kenya Revenue Authority (KRA) where required by law",
            "Law enforcement or government agencies pursuant to a lawful order",
          ]}
        />
      </div>
      <Prose>
        We do not sell your personal data to third parties. Where data is shared
        with processors, we ensure appropriate data processing agreements are in
        place in line with the DPA.
      </Prose>

      <SectionHeading number="6" title="Data Retention" />
      <Prose>
        We retain your personal data for as long as is necessary to fulfil the
        purposes for which it was collected, or as required by applicable Kenyan
        law, IRA regulations, and insurer obligations - whichever period is
        longer. Upon request, data is securely deleted or anonymised.
      </Prose>

      <SectionHeading number="7" title="Your Rights" />
      <Prose>Under the Data Protection Act, 2019, you have the right to:</Prose>
      <div className="mt-2">
        <BulletList
          items={[
            "Access the personal data we hold about you",
            "Request correction of inaccurate or incomplete data",
            "Object to or request restriction of certain processing",
            "Request deletion of your data, subject to legal retention obligations",
            "Lodge a complaint with the Office of the Data Protection Commissioner",
          ]}
        />
      </div>
      <Prose>
        To exercise any of these rights, please contact us at the details below.
        We will respond within the timeframes prescribed by the DPA.
      </Prose>

      <SectionHeading number="8" title="Data Security" />
      <Prose>
        We apply appropriate technical and organisational measures to protect
        your personal data against unauthorised access, loss, alteration, or
        disclosure. These include encrypted data transmission, access controls,
        and regular security assessments. While we take every reasonable
        precaution, we encourage you to keep your account credentials
        confidential.
      </Prose>

      <SectionHeading number="9" title="KYC Document Submission" />
      <Prose>
        In compliance with the Proceeds of Crime and Anti-Money Laundering Act
        (POCAMLA) and applicable KYC regulations, users are required to submit
        valid identity verification documents — including a government-issued
        National ID or Passport and a KRA PIN Certificate — within{" "}
        <strong>48 hours</strong> of account registration or upon request by
        Med-Gen. Failure to comply within the stipulated timeframe may result in
        suspension of account access, cancellation of pending policy
        applications, or termination of active policies. Med-Gen reserves the
        right to reject documents that are illegible, expired, or inconsistent
        with registration details. Users bear sole responsibility for any loss
        or prejudice arising from the submission of inaccurate, fraudulent, or
        incomplete KYC documentation.
      </Prose>

      <SectionHeading number="10" title="Updates to This Policy" />
      <Prose>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or applicable law. Where changes are material, we will
        notify you via the platform or by email. Continued use of our services
        following such notice constitutes your acceptance of the updated policy.
      </Prose>

      <SectionHeading number="11" title="Contact Us" />
      <Prose>
        If you have any questions about this policy or wish to exercise your
        data rights, please reach out to us:
      </Prose>
      <div className="mt-3 p-4 bg-primary/5 rounded-xl border border-[#d7e8ee]">
        <p className="text-sm text-[#1e3a5f]">
          <span className="font-medium">Email: </span>
          <a
            href="mailto:support@medgeninsurance.com"
            className="text-primary hover:underline"
          >
            support@medgeninsurance.com
          </a>
        </p>
      </div>
    </div>
  );
}

function GeneralDisclaimer() {
  return (
    <div>
      <LastUpdated date="2026-04-21" />

      <Prose>
        Med-Gen Insurance Agency, trading as Med-Gen, is a licensed insurance
        intermediary duly registered and operating in compliance with the
        Insurance Act (Cap. 487) and the regulations of the Insurance Regulatory
        Authority (IRA) of Kenya. We are committed to delivering professional,
        transparent, and client-centred insurance intermediation services on
        behalf of our underwriting partners.
      </Prose>

      <SectionHeading number="1" title="Professional Insurance Advisory Role" />
      <Prose>
        Med-Gen Insurance Agency is a licensed insurance intermediary operating
        on behalf of, and in partnership with, regulated underwriters. The
        guidance, recommendations, and product information provided through this
        platform constitute professional insurance advisory services rendered in
        that capacity. Our team is committed to helping you find the right cover
        for your needs, backed by the expertise and authority of our
        underwriting partners.
      </Prose>

      <SectionHeading number="2" title="Coverage and Claims" />
      <Prose>
        While we work diligently to match you with the most suitable insurance
        products, the ultimate terms of coverage, claim determinations, and
        settlement decisions rest with the underwriting insurer in accordance
        with the policy contract and applicable Kenyan insurance law. We
        advocate on your behalf throughout the process and are here to support
        you at every step.
      </Prose>

      <SectionHeading number="3" title="Accuracy of Information" />
      <Prose>
        The reliability of your policy depends on the accuracy of the
        information you provide. In line with the Insurance Act and the
        principle of utmost good faith (<em>uberrimae fidei</em>), users are
        required to disclose all material facts truthfully and completely.
        Med-Gen shall not be liable for any prejudice arising from inaccurate,
        incomplete, or misleading information submitted by a user.
      </Prose>

      <SectionHeading number="4" title="Third-Party Services" />
      <Prose>
        Our platform integrates with third-party systems including payment
        processors and insurer portals to deliver a seamless experience. While
        we carefully select our partners, Med-Gen cannot be held responsible for
        the independent acts, omissions, or service interruptions of third
        parties operating under their own regulatory frameworks.
      </Prose>

      <SectionHeading number="5" title="Regulatory Compliance" />
      <Prose>
        All insurance products facilitated through this platform are subject to
        the terms and conditions of the issuing insurer and the regulatory
        oversight of the Insurance Regulatory Authority of Kenya. Med-Gen
        operates strictly within the bounds of its intermediary licence and
        applicable Kenyan law, including but not limited to the Insurance Act,
        the Data Protection Act, 2019, and any relevant IRA guidelines in force.
      </Prose>

      <SectionHeading number="6" title="Limitation of Liability" />
      <Prose>
        To the extent permitted by law, Med-Gen&apos;s liability in connection
        with the use of this platform is limited to direct losses arising solely
        from our own negligence or wilful default in the performance of our
        intermediary obligations. We remain fully committed to resolving any
        concerns promptly and professionally.
      </Prose>
    </div>
  );
}

function CookiesPolicy() {
  const cookieTypes = [
    {
      name: "Strictly Necessary Cookies",
      desc: "Essential for platform operation.",
    },
    {
      name: "Performance Cookies",
      desc: "Analytics and monitoring.",
    },
    {
      name: "Functional Cookies",
      desc: "User preferences and settings.",
    },
    {
      name: "Security Cookies",
      desc: "Fraud and abuse prevention.",
    },
  ];

  return (
    <div>
      <LastUpdated date="2026-04-18" />

      <Prose>
        This Cookies Policy explains how Med-Gen (&ldquo;Company&rdquo;) uses
        cookies and similar technologies on our platform.
      </Prose>

      <SectionHeading number="1" title="What Are Cookies" />
      <Prose>
        Cookies are small text files stored on your device to enhance
        functionality and performance.
      </Prose>

      <SectionHeading number="2" title="Types of Cookies Used" />
      <div className="mt-2 grid sm:grid-cols-2 gap-3">
        {cookieTypes.map((c) => (
          <div
            key={c.name}
            className="flex items-start gap-3 p-3 rounded-xl border border-[#d7e8ee] bg-white"
          >
            <Cookie className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#1e3a5f]">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading number="3" title="Third-Party Cookies" />
      <Prose>
        Third-party services may place cookies on your device beyond our direct
        control.
      </Prose>

      <SectionHeading number="4" title="Managing Cookies" />
      <Prose>
        You may disable cookies via your browser settings. Please note that
        disabling certain cookies may affect the functionality of the platform.
      </Prose>

      <SectionHeading number="5" title="Updates" />
      <Prose>
        This policy may be updated periodically. Continued use of the platform
        constitutes acceptance of any changes.
      </Prose>
    </div>
  );
}

export default function TermsContent() {
  const [activeTab, setActiveTab] = useState<TabId>("privacy");

  return (
    <div className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />

      {/* Tab bar */}
      <div className="flex border-b border-[#d7e8ee] overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
              activeTab === id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-[#1e3a5f] hover:bg-[#f0f6f9]",
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {activeTab === "privacy" && <PrivacyPolicy />}
        {activeTab === "disclaimer" && <GeneralDisclaimer />}
        {activeTab === "cookies" && <CookiesPolicy />}
      </div>
    </div>
  );
}
