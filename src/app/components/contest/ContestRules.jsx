// src/app/components/contest/ContestRules.jsx
"use client";

export default function ContestRules() {
  return (
    <section className="px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Important Notes</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            To provide a better contest and ensure fairness, we listened to participants'
            feedback and updated the contest rules. Please read them carefully.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Penalty time of <strong>5 minutes</strong> for each wrong submission.</li>
            <li>Some test cases are hidden during contest to ensure fairness.</li>
            <li>Final rating updates within <strong>5 working days</strong> after the contest.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6">Violations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Submitting using multiple accounts.</li>
            <li>Submitting similar code from multiple accounts.</li>
            <li>Creating disturbances that interrupt other participants.</li>
            <li>Disclosing contest content publicly before it ends.</li>
            <li>Using code generation tools or external assistance.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6">Penalties</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>First violation:</strong> Score reset to zero, 1-month ban from contest/discuss.</li>
            <li><strong>Second violation:</strong> Permanent account deactivation.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6">Reporting</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>First 10 valid violation reports per violator earn <strong>20 coins</strong> each (up to 100 coins/user).</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
