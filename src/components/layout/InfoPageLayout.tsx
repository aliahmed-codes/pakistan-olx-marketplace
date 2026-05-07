import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface InfoPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function InfoPageLayout({
  children,
  title,
  subtitle,
  badge,
}: InfoPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Consistent dark hero header */}
        <section className="bg-gradient-to-br from-pm to-pm-light text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              {badge && (
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-white/20">
                  <span className="text-pm-accent text-sm font-medium">{badge}</span>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Page content */}
        {children}
      </main>
      <Footer />
    </>
  );
}
