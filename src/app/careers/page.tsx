import { Briefcase, MapPin, Clock, DollarSign, CheckCircle, Heart, Zap, Users, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoPageLayout from '@/components/layout/InfoPageLayout';

export const metadata = {
  title: 'Careers | Pakistan Market',
  description: 'Join the Pakistan Market team and help build the future of buying and selling in Pakistan.',
};

const benefits = [
  { icon: DollarSign, title: 'Competitive Salary', description: 'We offer market-competitive salaries and regular reviews' },
  { icon: Heart, title: 'Health Insurance', description: 'Comprehensive health coverage for you and your family' },
  { icon: Zap, title: 'Growth Opportunities', description: 'Clear career paths and professional development support' },
  { icon: Users, title: 'Great Culture', description: 'Work with talented people in a supportive environment' },
  { icon: Clock, title: 'Flexible Hours', description: 'Work-life balance with flexible scheduling options' },
  { icon: GraduationCap, title: 'Learning Budget', description: 'Annual budget for courses, conferences, and books' },
];

const openings = [
  { id: '1', title: 'Senior Full Stack Developer', department: 'Engineering', location: 'Lahore', type: 'Full-time', salary: 'Rs. 200,000 - 400,000', description: "We're looking for an experienced Full Stack Developer to join our engineering team.", requirements: ['5+ years of experience in web development', 'Strong proficiency in React, Node.js, and TypeScript', 'Experience with databases and cloud services', 'Excellent problem-solving skills'] },
  { id: '2', title: 'Product Manager', department: 'Product', location: 'Lahore', type: 'Full-time', salary: 'Rs. 150,000 - 300,000', description: 'Lead product development and drive innovation on our platform.', requirements: ['3+ years of product management experience', 'Strong analytical and communication skills', 'Experience with agile methodologies', 'Background in marketplace or e-commerce preferred'] },
  { id: '3', title: 'Customer Support Specialist', department: 'Support', location: 'Karachi', type: 'Full-time', salary: 'Rs. 50,000 - 80,000', description: 'Help our users have the best experience on our platform.', requirements: ['Excellent communication skills in English and Urdu', 'Customer service experience', 'Problem-solving abilities', 'Ability to work in shifts'] },
  { id: '4', title: 'Digital Marketing Manager', department: 'Marketing', location: 'Lahore', type: 'Full-time', salary: 'Rs. 100,000 - 200,000', description: 'Drive our digital marketing strategy and grow our user base.', requirements: ['4+ years of digital marketing experience', 'Strong knowledge of SEO, SEM, and social media', 'Experience with analytics tools', 'Creative thinking and data-driven approach'] },
];

export default function CareersPage() {
  return (
    <InfoPageLayout title="Join Our Team" subtitle="Be part of Pakistan's fastest-growing marketplace and help millions of people buy and sell." badge="Careers">
      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Join Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer a supportive environment where you can grow and make an impact</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="w-16 h-16 bg-pm/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-8 h-8 text-pm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find your perfect role and start your journey with us</p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {openings.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Requirements:</p>
                      <ul className="space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <a href="mailto:careers@pakistanmarket.pk">
                      <Button className="bg-pm hover:bg-pm-light">Apply Now</Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pm to-pm-light rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Don&apos;t See the Right Role?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future opportunities.</p>
            <a href="mailto:careers@pakistanmarket.pk">
              <Button size="lg" className="bg-pm-yellow text-pm hover:bg-pm-yellow/90 font-semibold">Send Your Resume</Button>
            </a>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
