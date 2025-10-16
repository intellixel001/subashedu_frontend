import {
  FaEnvelope,
  FaFacebook,
  FaMapMarkerAlt,
  FaPhone,
  FaYoutube,
} from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-34 lg:pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#F9FAFB] opacity-10 blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#F9FAFB] opacity-10 blur-xl animate-float-slow"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#343434] sm:text-5xl lg:text-6xl">
            যোগাযোগ করুন <span className="text-[#5e4103]">Suvash Edu তে</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            আমাদের সাথে যোগাযোগ করতে নিচের তথ্য ব্যবহার করুন।
          </p>
        </div>

        <div className="bg-[#0C2945] backdrop-blur-md border border-border rounded-xl overflow-hidden shadow-lg">
          <div className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Phone */}
              <div className="flex items-start p-4 bg-[#343434] rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex-shrink-0 bg-white rounded-lg p-3">
                  <FaPhone className="h-6 w-6 text-[#F4A700]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-foreground">
                    আমাদের ফোন নাম্বার
                  </h3>
                  <a
                    href="tel:01724304107"
                    className="mt-1 text-lg text-muted-foreground hover:text-[#926503] transition-colors"
                  >
                    +880 1320582841
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start p-4 bg-[#343434] rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex-shrink-0 bg-white rounded-lg p-3">
                  <FaEnvelope className="h-6 w-6 text-[#F4A700]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-foreground">
                    Email
                  </h3>
                  <a
                    href="mailto:suvasheducation@gmail.com"
                    className="mt-1 text-lg text-muted-foreground hover:text-[#825a03] transition-colors"
                  >
                    suvasheducation@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start p-4 bg-[#343434] rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex-shrink-0 bg-white rounded-lg p-3">
                  <FaMapMarkerAlt className="h-6 w-6 text-[#F4A700]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-foreground">
                    Location
                  </h3>
                  <p className="mt-1 text-lg text-muted-foreground  hover:text-[#825a03] transition-colors">
                    House :93-94, Road 6 Block E, Section 11, Mirpur 11, Dhaka,
                    Bangladesh
                  </p>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-start p-4 bg-[#343434] rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex-shrink-0 bg-white rounded-lg p-3">
                  <FaFacebook className="h-6 w-6 text-[#F4A700]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Facebook</h3>
                  <a
                    href="https://www.facebook.com/Suvash.Edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-lg text-muted-foreground hover:text-[#966805] transition-colors"
                  >
                    Suvash Edu facebook Page
                  </a>
                </div>
              </div>

              {/* YouTube */}
              <div className="flex items-start p-4 bg-[#343434] rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex-shrink-0 bg-white rounded-lg p-3">
                  <FaYoutube className="h-6 w-6 text-[#F4A700]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">YouTube</h3>
                  <a
                    href="https://www.youtube.com/@SuvashEdu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-lg text-muted-foreground hover:text-[#8f6303] transition-colors"
                  >
                    Suvash Edu youtube Channel
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-primary-foreground">
                আমাদের সুভাস এডুকেশন সম্পর্কে
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {`"Your journey to knowledge and success starts here." Suvash Education is dedicated to 
                providing quality educational resources and support to students in Mirpur, Bangladesh.`}
              </p>
            </div>

            <div className="mt-10 flex justify-center space-x-8">
              <a
                href="https://www.facebook.com/Suvash.Edu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8f6303] transition-colors transform hover:scale-110"
              >
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-8 w-8" />
              </a>
              <a
                href="https://www.youtube.com/@SuvashEdu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8f6303] transition-colors transform hover:scale-110"
              >
                <span className="sr-only">YouTube</span>
                <FaYoutube className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
