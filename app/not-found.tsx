import Link from 'next/link'
import { FaBookOpen, FaGraduationCap, FaHome, FaChalkboardTeacher } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] animate-gradientBG">
      {/* Main content container - now full screen */}
      <div className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-7xl bg-[var(--card)] rounded-[var(--radius-lg)] shadow-xl overflow-hidden animate-fade-in flex flex-col min-h-[80vh] border border-[var(--border)]">
          {/* Header with Suvash Edu branding */}
          <div className="bg-[var(--myred)] p-6 text-[var(--primary-foreground)]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <FaBookOpen className="text-2xl" />
                <h1 className="text-xl md:text-2xl font-bold text-shine">Suvash Edu - 404</h1>
              </div>
              <span className="bg-[var(--myred-secondary)]/20 px-3 py-1 rounded-full text-sm">
                Knowledge Portal
              </span>
            </div>
          </div>

          {/* Flex container for responsive layout */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left side - Illustration (now full height) */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 bg-[var(--myred)]/5">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-[var(--myred)]/10 rounded-full opacity-20"></div>
                <div className="absolute inset-8 bg-[var(--myred)]/20 rounded-full opacity-30"></div>
                <div className="absolute inset-16 bg-[var(--myred)]/30 rounded-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <FaGraduationCap className="text-[var(--myred)] text-4xl md:text-6xl mx-auto mb-4 animate-pulse" />
                    <span className="text-4xl md:text-5xl font-bold text-[var(--myred)]">404</span>
                    <p className="text-[var(--myred)] mt-2 text-sm md:text-base">Page Not Found</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content (now full height) */}
            <div className="lg:w-1/2 flex items-center p-6 md:p-10">
              <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">Oops! Learning Path Not Found</h2>
                <p className="text-base md:text-lg text-[var(--muted-foreground)] mb-6 md:mb-8">
                  {`The educational resource you're seeking isn't available in our knowledge base. 
                  Let's guide you back to productive learning.`}
                </p>

                <div className="grid grid-cols-1 gap-4 mb-6 md:mb-8">
                  <Link 
                    href="/" 
                    className="group bg-[var(--card)] border border-[var(--myred)]/20 rounded-[var(--radius-md)] p-4 md:p-6 hover:bg-[var(--myred)]/5 transition-all duration-200 shadow-sm hover:shadow-md hover:glow flex items-start"
                  >
                    <div className="bg-[var(--myred)]/10 p-2 md:p-3 rounded-[var(--radius-sm)] text-[var(--myred)] group-hover:bg-[var(--myred)]/20 transition-all mr-4 flex-shrink-0">
                      <FaHome className="text-lg md:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)] mb-1 md:mb-2">Return to Home Page</h3>
                      <p className="text-[var(--muted-foreground)] text-xs md:text-sm">
                        Back to your learning dashboard and continue your education journey.
                      </p>
                    </div>
                  </Link>

                  <Link 
                    href="/courses" 
                    className="group bg-[var(--card)] border border-[var(--myred)]/20 rounded-[var(--radius-md)] p-4 md:p-6 hover:bg-[var(--myred)]/5 transition-all duration-200 shadow-sm hover:shadow-md hover:glow flex items-start"
                  >
                    <div className="bg-[var(--myred)]/10 p-2 md:p-3 rounded-[var(--radius-sm)] text-[var(--myred)] group-hover:bg-[var(--myred)]/20 transition-all mr-4 flex-shrink-0">
                      <FaChalkboardTeacher className="text-lg md:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)] mb-1 md:mb-2">Browse Courses</h3>
                      <p className="text-[var(--muted-foreground)] text-xs md:text-sm">
                        Explore our comprehensive course catalog for new learning opportunities.
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="bg-[var(--myred)]/5 rounded-[var(--radius-md)] p-4 md:p-6 border border-[var(--myred)]/10">
                  <h3 className="font-medium text-[var(--foreground)] mb-2 md:mb-3 flex items-center">
                    <span className="bg-[var(--myred)]/10 p-2 rounded-[var(--radius-sm)] text-[var(--myred)] mr-3">
                      <FaBookOpen />
                    </span>
                    Need Academic Support?
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-xs md:text-sm mb-3 md:mb-4">
                    Our education consultants are available to help you navigate our learning platform.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-[var(--myred)] hover:text-[var(--myred-secondary)] font-medium text-xs md:text-sm transition-colors"
                  >
                    Contact Academic Support <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-4 text-center text-[var(--muted-foreground)] text-xs md:text-sm bg-[var(--card)]/50">
        © {new Date().getFullYear()} Suvash Edu - Empowering Education Through Technology
      </div>
    </div>
  )
}