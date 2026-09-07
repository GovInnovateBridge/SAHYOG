import { Link } from 'react-router-dom';
import GovtEmblem from '../components/shared/GovtEmblem';
import { Scale, IndianRupee, ShieldCheck, FileText, Users } from 'lucide-react';

export default function Guidelines() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* Navbar */}
      <nav className="bg-white border-b-4 border-[var(--color-saffron)] shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center space-x-4">
          <GovtEmblem width={40} height={50} />
          <div>
            <h1 className="text-2xl font-black text-[var(--color-primary)]">SAHYOG</h1>
            <p className="text-xs font-semibold text-[var(--color-india-green)] uppercase tracking-wide">← Back to Home</p>
          </div>
        </Link>
        <span className="hidden sm:block text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded">
          Government of Maharashtra · GFR 2017 Compliant
        </span>
      </nav>

      {/* Hero */}
      <div className="bg-[var(--color-primary)] text-white py-10 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-saffron)] mb-2">
          Regulatory & Compliance Framework
        </p>
        <h1 className="text-3xl font-bold mb-2">Platform Guidelines & GFR Compliance</h1>
        <p className="text-white/70 text-sm max-w-xl mx-auto">
          Sahyog is a self-contained innovation procurement portal. Every feature maps directly to a statutory rule — with no dependency on external marketplaces.
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* 1. GFR Rules */}
        <section id="legal">
          <SectionHeader icon={<Scale size={18} />} iconBg="bg-blue-50 text-[var(--color-primary)]"
            title="Legal Framework — GFR 2017"
            subtitle="Key rules that Sahyog operationalises." />
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-28">Rule</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-48">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">How Sahyog Implements It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { rule: '163', title: 'Procurement Planning', impl: 'Officers must post AI-validated challenge statements before any startup discovery begins — need is established before outreach.' },
                  { rule: '173 (i)', title: 'Startup & MSME Promotion', impl: 'Challenges exclusively route to DPIIT-verified startups. Prior turnover requirement is explicitly waived.' },
                  { rule: '175', title: 'Limited Tender Enquiry', impl: 'Top 3 startups by ML cosine similarity score (>80%) are invited — acting as an automatic LTE filter with parallel evaluation.' },
                  { rule: '194', title: 'QCBS — Fair Competition', impl: 'Anti-bias ML filter auto-rejects challenge drafts with brand-specific or exclusionary clauses. Blind jury evaluation ensures impartiality.' },
                  { rule: '200', title: 'Performance Security', impl: 'Trial budget locked in escrow per startup at contract signing. Released only after independent KPI validation at each milestone.' },
                ].map((r) => (
                  <tr key={r.rule} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded">
                        Rule {r.rule}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.title}</td>
                    <td className="px-4 py-3 text-gray-600">{r.impl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Eligibility */}
        <section id="eligibility">
          <SectionHeader icon={<Users size={18} />} iconBg="bg-green-50 text-[var(--color-india-green)]"
            title="Startup Eligibility"
            subtitle="Based on DPIIT Startup India Recognition guidelines." />
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm grid sm:grid-cols-2 gap-4">
            {[
              { label: 'DPIIT Recognition', value: 'Valid DPIIT certificate required at registration.', tag: 'Required', color: 'bg-blue-50 text-blue-700' },
              { label: 'Incorporation Age', value: 'Less than 10 years from date of incorporation.', tag: 'Required', color: 'bg-blue-50 text-blue-700' },
              { label: 'Annual Turnover', value: 'Must not exceed ₹100 crore in any financial year.', tag: 'Required', color: 'bg-blue-50 text-blue-700' },
              { label: 'Minimum TRL', value: 'TRL 3+ to apply; higher TRL unlocks higher-value challenges.', tag: 'Recommended', color: 'bg-orange-50 text-orange-700' },
              { label: 'Prior Turnover', value: 'Conventional prior-turnover requirement is explicitly waived on Sahyog.', tag: 'Waived', color: 'bg-green-50 text-green-700' },
              { label: 'Innovation Criterion', value: 'Must be working on innovation in products, processes, or services.', tag: 'Required', color: 'bg-blue-50 text-blue-700' },
            ].map((e) => (
              <div key={e.label} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{e.label}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.color}`}>{e.tag}</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">{e.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Innovation Trial Pathway */}
        <section id="pathway">
          <SectionHeader icon={<Scale size={18} />} iconBg="bg-orange-50 text-orange-600"
            title="Innovation Trial Pathway"
            subtitle="Sahyog runs a Parallel Sandbox model — top 3 matched startups trial simultaneously. Every stage is auditable within the platform." />

          {/* Parallel Sandboxing callout */}
          <div className="mb-6 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg px-5 py-4 flex gap-3 items-start">
            <span className="text-[var(--color-primary)] text-lg mt-0.5">⚡</span>
            <div>
              <p className="font-bold text-[var(--color-primary)] text-sm">Parallel Sandboxing — Our Core Innovation</p>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                Unlike conventional procurement that picks one vendor upfront, Sahyog selects the <strong>top 3 matched startups</strong> and runs all of them through the 3-month trial simultaneously. Each startup gets an independent trial budget in escrow. The government benefits from seeing multiple real-world solutions in action — and <strong>every startup that completes all milestones</strong> earns a Sahyog Verified badge. More winners means more innovation, less risk of betting on a single solution.
              </p>
            </div>
          </div>

          {/* BULLETPROOF FLEX TIMELINE */}
          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Challenge Identification',
                desc: 'Nodal Officer posts a problem statement. AI structures it into measurable KPIs + trial budget. Anti-bias filter validates before publishing (GFR 163, 194).',
              },
              {
                step: '02',
                title: 'Startup Matching & TRL Screening',
                desc: 'ML engine ranks DPIIT-verified startups by cosine similarity. Top 3 scoring above 80% are shortlisted. Zero-Trust TRL engine verifies each startup\'s technology readiness — no self-declaration accepted.',
              },
              {
                step: '03',
                title: 'Blind Evaluation & Trial Contracts',
                desc: 'Independent jury evaluates all 3 shortlisted proposals anonymously (QCBS, GFR 194). All 3 sign independent milestone-based trial contracts. Only the trial budget — not the full contract value — is committed at this stage.',
              },
              {
                step: '04',
                title: '3-Month Parallel Sandbox Pilot',
                desc: 'All 3 startups run controlled pilots simultaneously across 3 milestones (Sandbox → Field Test → Stress Test, 30 days each). Each startup\'s trial budget is held in a separate escrow and disbursed on independent KPI validation. Startups do not see each other\'s progress.',
              },
              {
                step: '05',
                title: 'Sahyog Verified Badge & Contract Decision',
                desc: 'Every startup that completes all milestones receives a "Sahyog Verified" badge — there is no cap on how many can earn it. The government then decides, at their discretion, which verified startup(s) to award a full contract. No automatic award, no forced single-winner model.',
              },
            ].map((item, index, array) => (
              <div key={item.step} className="flex gap-4 items-stretch">
                {/* Badge + Self-Contained Connector Line */}
                <div className="flex flex-col items-center flex-shrink-0 w-10">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0">
                    {item.step}
                  </div>
                  {index !== array.length - 1 && (
                    <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                  )}
                </div>

                {/* Content Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex-1 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Verified badge callout */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg px-5 py-4 flex gap-3 items-start">
            <span className="text-green-600 text-lg mt-0.5">✦</span>
            <div>
              <p className="font-bold text-green-800 text-sm">What "Sahyog Verified" means</p>
              <p className="text-green-700 text-xs mt-1 leading-relaxed">
                A Sahyog Verified startup has independently demonstrated that their solution works in a real government environment, met all defined KPIs, and passed third-party validation — entirely within this platform. Multiple startups can earn this badge from a single challenge. The badge is visible to all Nodal Officers across departments, increasing the startup's chances of future contracts.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Escrow + Data + Grievance */}
        <section id="policies">
          <SectionHeader icon={<IndianRupee size={18} />} iconBg="bg-purple-50 text-purple-600"
            title="Escrow, Data & Grievance Policies"
            subtitle="Financial, legal, and redressal framework in brief." />
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100">
            {[
              {
                icon: <IndianRupee size={16} className="text-purple-500" />,
                label: 'Trial Budget & Escrow',
                value: 'Each of the 3 parallel startups gets an independent trial budget locked in escrow at contract signing — not the full contract value. Disbursed across 3 milestones via e-RUPI. 7-day deemed approval clause: if the officer does not act on a validated milestone within 7 working days, payment auto-releases.',
              },
              {
                icon: <ShieldCheck size={16} className="text-red-500" />,
                label: 'Data & IP',
                value: 'Each startup retains full IP ownership of their own solution. Government receives a non-exclusive usage license for the pilot scope only. All pilot data is governed by DPDP Act 2023 — no cross-startup data sharing and no use of government data for model training. Data stored on India-based servers (IT Act 2000, S.43A).',
              },
              {
                icon: <FileText size={16} className="text-gray-500" />,
                label: 'Grievance & Audit',
                value: 'Every action is timestamped and immutably logged (CAG-auditable). Startups can raise payment or rejection disputes within 14 days. Unresolved grievances escalate to the designated Grievance Officer; if still unresolved in 30 days, escalated to DPIIT.',
              },
            ].map((p) => (
              <div key={p.label} className="flex gap-4 px-5 py-4">
                <div className="flex-shrink-0 mt-0.5">{p.icon}</div>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{p.label} — </span>
                  <span className="text-gray-600 text-sm">{p.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          Sahyog is an isolated, self-contained portal · SIH 2026 · GFR 2017 as amended ·{' '}
          <span className="text-[var(--color-primary)]">support@sahyog.gov.in</span>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ icon, iconBg, title, subtitle }: {
  icon: React.ReactNode; iconBg: string; title: string; subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`p-2 rounded-lg ${iconBg} flex-shrink-0`}>{icon}</div>
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}