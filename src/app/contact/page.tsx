import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import ContactForm from './ContactForm';

const contactInfo = [
  { icon: Phone, title: 'Phone', details: ['+92 300 1234567', '+92 42 12345678'] },
  { icon: Mail, title: 'Email', details: ['support@pakistanmarket.pk', 'business@pakistanmarket.pk'] },
  { icon: MapPin, title: 'Address', details: ['123 Main Boulevard', 'Gulberg III, Lahore', 'Pakistan'] },
  { icon: Clock, title: 'Working Hours', details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'] },
];

export const metadata = {
  title: 'Contact Us | Pakistan Market',
  description: 'Get in touch with Pakistan Market support team. We are here to help.',
};

export default function ContactPage() {
  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="Have a question or need help? We're here to assist you."
      badge="Get In Touch"
    >
      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <div key={info.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pm/10 rounded-full flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-pm" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactForm />
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Support</h3>
                <p className="text-gray-600 mb-4">Need immediate assistance? Try these options:</p>
                <div className="space-y-3">
                  <a href="tel:+923001234567" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Call Us</p>
                      <p className="text-sm text-gray-500">+92 300 1234567</p>
                    </div>
                  </a>
                  <a href="mailto:support@pakistanmarket.pk" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-500">support@pakistanmarket.pk</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Live Chat</p>
                      <p className="text-sm text-gray-500">Available 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pm to-pm-light rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">FAQs</h3>
                <p className="text-white/80 mb-4">Find answers to commonly asked questions in our Help Center.</p>
                <a href="/help-center" className="inline-flex items-center gap-2 text-pm-accent hover:underline font-medium">
                  Visit Help Center →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
