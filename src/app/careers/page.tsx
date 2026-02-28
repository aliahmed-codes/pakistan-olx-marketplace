"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  Heart,
  Zap,
  Users,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "We offer market-competitive salaries and regular reviews",
  },
  {
    icon: Heart,
    title: "Health Insurance",
    description: "Comprehensive health coverage for you and your family",
  },
  {
    icon: Zap,
    title: "Growth Opportunities",
    description: "Clear career paths and professional development support",
  },
  {
    icon: Users,
    title: "Great Culture",
    description: "Work with talented people in a supportive environment",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Work-life balance with flexible scheduling options",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "Annual budget for courses, conferences, and books",
  },
];

const openings = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Lahore",
    type: "Full-time",
    salary: "Rs. 200,000 - 400,000",
    description:
      "We're looking for an experienced Full Stack Developer to join our engineering team.",
    requirements: [
      "5+ years of experience in web development",
      "Strong proficiency in React, Node.js, and TypeScript",
      "Experience with databases and cloud services",
      "Excellent problem-solving skills",
    ],
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Lahore",
    type: "Full-time",
    salary: "Rs. 150,000 - 300,000",
    description:
      "Lead product development and drive innovation on our platform.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and communication skills",
      "Experience with agile methodologies",
      "Background in marketplace or e-commerce preferred",
    ],
  },
  {
    id: "3",
    title: "Customer Support Specialist",
    department: "Support",
    location: "Karachi",
    type: "Full-time",
    salary: "Rs. 50,000 - 80,000",
    description:
      "Help our users have the best experience on our platform.",
    requirements: [
      "Excellent communication skills in English and Urdu",
      "Customer service experience",
      "Problem-solving abilities",
      "Ability to work in shifts",
    ],
  },
  {
    id: "4",
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Lahore",
    type: "Full-time",
    salary: "Rs. 100,000 - 200,000",
    description:
      "Drive our digital marketing strategy and grow our user base.",
    requirements: [
      "4+ years of digital marketing experience",
      "Strong knowledge of SEO, SEM, and social media",
      "Experience with analytics tools",
      "Creative thinking and data-driven approach",
    ],
  },
];

export default function CareersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002f34] to-[#005f6b] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <Briefcase className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Careers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Be part of Pakistan&apos;s fastest-growing marketplace and help millions
              of people buy and sell
            </p>
            <Link href="#openings">
              <Button
                size="lg"
                className="bg-white text-[#002f34] hover:bg-gray-100"
              >
                View Openings
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a supportive environment where you can grow and make an
              impact
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#002f34]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#002f34]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your perfect role and start your journey with us
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {openings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Requirements:</p>
                      <ul className="space-y-1">
                        {job.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-600 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <a href="mailto:careers@example.com">
                      <Button className="bg-[#002f34] hover:bg-[#002f34]/90">
                        Apply Now
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#002f34] to-[#005f6b] rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Don&apos;t See the Right Role?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for talented people. Send us your resume and
              we&apos;ll keep you in mind for future opportunities.
            </p>
            <a href="mailto:careers@example.com">
              <Button
                size="lg"
                className="bg-white text-[#002f34] hover:bg-gray-100"
              >
                Send Your Resume
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
