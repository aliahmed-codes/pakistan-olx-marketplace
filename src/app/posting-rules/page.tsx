import Link from 'next/link';
import { FileText, CheckCircle, XCircle, AlertTriangle, Camera, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoPageLayout from '@/components/layout/InfoPageLayout';

export const metadata = {
  title: 'Posting Rules | Pakistan Market',
  description: 'Follow these guidelines to create successful ads and keep our community safe.',
};

const generalRules = [
  'Post ads only for items you legally own or have the right to sell',
  'Provide accurate and truthful information about your items',
  'Use clear, original photos that accurately represent the item',
  'Set realistic prices based on market value',
  'Respond to inquiries in a timely manner',
  'Keep your contact information up to date',
  'One ad per item — do not post duplicate ads',
  'Update or remove ads once the item is sold',
];

const prohibitedItems = [
  'Illegal drugs, weapons, or explosives', 'Counterfeit or pirated goods', 'Stolen property',
  'Hazardous materials or chemicals', 'Live animals (with some exceptions)', 'Human remains or body parts',
  'Services that are illegal or harmful', 'Items that promote hate speech or discrimination',
  'Adult content or pornography', 'Gambling-related items or services',
];

const photoGuidelines = [
  'Use clear, well-lit photos', 'Include multiple angles of the item', 'Show any defects or damage honestly',
  'Use original photos, not stock images', 'Ensure the item is clean and presentable',
  'Avoid watermarks from other websites', 'Do not include personal information in photos',
];

const descriptionTips = [
  'Write a clear, descriptive title', 'Include all relevant details (brand, model, condition)',
  "Be honest about the item's condition", 'Mention any defects or issues',
  'Include dimensions or specifications if relevant', 'Specify your preferred contact method',
  'Mention if the price is negotiable',
];

export default function PostingRulesPage() {
  return (
    <InfoPageLayout title="Posting Rules" subtitle="Follow these guidelines to create successful ads and keep our community safe." badge="Guidelines">
      {/* Quick Summary */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Quick Summary</h3>
              <p className="text-green-700">Be honest, be clear, and be respectful. Post only items you own, use original photos, and provide accurate descriptions. Violations may result in ad removal or account suspension.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* General Rules */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pm/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-pm" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">General Rules</h2>
              </div>
              <ul className="space-y-3">
                {generalRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prohibited Items */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-800">Prohibited Items</h2>
              </div>
              <p className="text-red-700 mb-4">The following items are strictly prohibited:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {prohibitedItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-red-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Guidelines */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Photo Guidelines</h2>
              </div>
              <ul className="space-y-3">
                {photoGuidelines.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description Tips */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Writing Great Descriptions</h2>
              </div>
              <ul className="space-y-3">
                {descriptionTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Consequences */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-amber-800">Violation Consequences</h2>
              </div>
              <ul className="space-y-2 text-amber-700">
                {['Ad removal without notice', 'Temporary account suspension', 'Permanent account ban for repeated violations', 'Reporting to authorities for illegal activities'].map((c, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="font-bold">•</span><span>{c}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Post Your Ad?</h2>
          <p className="text-gray-600 mb-6">Follow these rules and start selling today!</p>
          <Link href="/post-ad">
            <Button size="lg" className="bg-pm hover:bg-pm-light">Post Free Ad</Button>
          </Link>
        </div>
      </section>
    </InfoPageLayout>
  );
}
