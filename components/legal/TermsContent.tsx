"use client";

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
      <LastUpdated date="2026-03-08" />

      <Prose>
        This Privacy Policy explains how MedGen Insurance Agency trading as
        MedGen (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects, uses, discloses, and protects personal data when you use our
        platform.
      </Prose>

      <SectionHeading number="1" title="Data Controller and Role" />
      <Prose>
        The Company operates primarily as a data intermediary and processor
        facilitating insurance transactions between Users and insurers. Insurers
        act as independent data controllers for underwriting and claims.
      </Prose>

      <SectionHeading number="2" title="Data Collected" />
      <Prose>We may collect:</Prose>
      <div className="mt-2">
        <BulletList
          items={[
            "Identification and contact data",
            "Policy and risk-related information",
            "Health or medical data (where applicable and lawful)",
            "Vehicle, marine, or asset information",
            "Transaction and payment metadata",
            "Technical and usage data",
          ]}
        />
      </div>

      <SectionHeading number="3" title="Purpose of Processing" />
      <Prose>Personal data is processed to:</Prose>
      <div className="mt-2">
        <BulletList
          items={[
            "Facilitate quotations, policy issuance, and certificates",
            "Enable insurer underwriting and claims handling",
            "Meet legal and regulatory obligations",
            "Prevent fraud and security incidents",
            "Improve platform performance",
          ]}
        />
      </div>

      <SectionHeading number="4" title="Legal Basis" />
      <Prose>
        Processing is based on consent, contractual necessity, legal obligation,
        and legitimate interests, as applicable.
      </Prose>

      <SectionHeading number="5" title="Data Sharing" />
      <Prose>We may share data with:</Prose>
      <div className="mt-2 mb-3">
        <BulletList
          items={[
            "Insurers and reinsurers",
            "Payment providers",
            "Regulatory authorities",
            "IT and communication vendors",
          ]}
        />
      </div>
      <Prose>
        The Company is not responsible for third-party privacy practices.
      </Prose>

      <SectionHeading number="6" title="Data Retention" />
      <Prose>
        Data is retained only as long as necessary or as required by law and
        insurer obligations.
      </Prose>

      <SectionHeading number="7" title="Data Subject Rights" />
      <Prose>
        Users may request access, correction, deletion, or restriction of their
        data, subject to legal limitations.
      </Prose>

      <SectionHeading number="8" title="Security" />
      <Prose>
        We implement reasonable technical and organizational safeguards but
        cannot guarantee absolute security.
      </Prose>

      <SectionHeading number="9" title="International Transfers" />
      <Prose>
        Data may be processed across jurisdictions subject to appropriate
        safeguards.
      </Prose>

      <SectionHeading number="10" title="Contact" />
      <div className="mt-2 p-4 bg-primary/5 rounded-xl border border-[#d7e8ee]">
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
      <LastUpdated date="2026-03-07" />

      <Prose>
        The information and services provided by MedGen Insurance Agency,
        trading as MedGen, are offered strictly on an informational and
        facilitative basis.
      </Prose>

      <SectionHeading number="1" title="No Insurance or Medical Advice" />
      <Prose>
        Nothing on the platform constitutes insurance, legal, financial, or
        medical advice. Users must rely on licensed insurers and qualified
        professionals.
      </Prose>

      <SectionHeading number="2" title="No Liability for Insurance Outcomes" />
      <Prose>
        We do not guarantee coverage, claim approval, settlement amounts, or
        insurer solvency.
      </Prose>

      <SectionHeading number="3" title="Third-Party Dependence" />
      <Prose>
        The platform relies on third-party data and services. We disclaim
        liability for their acts or omissions.
      </Prose>

      <SectionHeading number="4" title="Use at Your Own Risk" />
      <Prose>
        Use of the platform is at your sole risk. To the maximum extent
        permitted by law, all liability is excluded.
      </Prose>

      <SectionHeading number="5" title="Regulatory Notice" />
      <Prose>
        Insurance products are subject to regulatory approval and insurer terms.
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
      <LastUpdated date="2026-03-08" />

      <Prose>
        This Cookies Policy explains how MedGen (&ldquo;Company&rdquo;) uses
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
