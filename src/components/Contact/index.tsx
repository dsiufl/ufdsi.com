import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, MessageCircle, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <Card className="mb-12 shadow-lg transition-all duration-300 hover:shadow-xl lg:mb-5">
              <CardHeader className="px-8 py-6 sm:px-14 sm:py-8 lg:px-8 xl:px-14">
                <CardTitle className="text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 sm:px-14 sm:pb-14 lg:px-8 xl:px-14 xl:pb-14">
              <h2 className="mb-6 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl">
                Get in Touch
              </h2>
              <p className="mb-8 text-lg font-medium leading-relaxed text-body-color">
                Questions about data science, our events, or getting involved? We&apos;d love to connect—reach out anytime!
              </p>

              <div className="flex flex-col space-y-6 items-start">
                {/* Email Contact */}
                <div className="flex items-center space-x-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:dsiufl@gmail.com"
                    className="text-lg font-medium text-primary transition-colors duration-300 hover:text-primary/80 hover:underline"
                  >
                    dsiufl@gmail.com
                  </a>
                </div>

                {/* Social Media Links */}
                <div className="flex space-x-4 items-start -ml-1">
                  <a
                    href="https://instagram.com/uf_dsi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 transition-colors duration-300 hover:text-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      className="fill-current">
                      <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path>
                    </svg>
                  </a>

                  <a
                    href="https://discord.gg/GUEAwEhRQw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 transition-colors duration-300 hover:text-primary"
                  >
                    <svg
                      x="0px"
                      y="0px"
                      width="35"
                      height="35"
                      viewBox="0 0 32 32"
                      className="fill-current">
                      <path d="M25.12,6.946c-2.424-1.948-6.257-2.278-6.419-2.292c-0.256-0.022-0.499,0.123-0.604,0.357 c-0.004,0.008-0.218,0.629-0.425,1.228c2.817,0.493,4.731,1.587,4.833,1.647c0.478,0.278,0.638,0.891,0.359,1.368 C22.679,9.572,22.344,9.75,22,9.75c-0.171,0-0.343-0.043-0.501-0.135C21.471,9.598,18.663,8,15.002,8 C11.34,8,8.531,9.599,8.503,9.615C8.026,9.892,7.414,9.729,7.137,9.251C6.86,8.775,7.021,8.164,7.497,7.886 c0.102-0.06,2.023-1.158,4.848-1.65c-0.218-0.606-0.438-1.217-0.442-1.225c-0.105-0.235-0.348-0.383-0.604-0.357 c-0.162,0.013-3.995,0.343-6.451,2.318C3.564,8.158,1,15.092,1,21.087c0,0.106,0.027,0.209,0.08,0.301 c1.771,3.11,6.599,3.924,7.699,3.959c0.007,0.001,0.013,0.001,0.019,0.001c0.194,0,0.377-0.093,0.492-0.25l1.19-1.612 c-2.61-0.629-3.99-1.618-4.073-1.679c-0.444-0.327-0.54-0.953-0.213-1.398c0.326-0.443,0.95-0.541,1.394-0.216 C7.625,20.217,10.172,22,15,22c4.847,0,7.387-1.79,7.412-1.808c0.444-0.322,1.07-0.225,1.395,0.221 c0.324,0.444,0.23,1.066-0.212,1.392c-0.083,0.061-1.456,1.048-4.06,1.677l1.175,1.615c0.115,0.158,0.298,0.25,0.492,0.25 c0.007,0,0.013,0,0.019-0.001c1.101-0.035,5.929-0.849,7.699-3.959c0.053-0.092,0.08-0.195,0.08-0.301 C29,15.092,26.436,8.158,25.12,6.946z M11,19c-1.105,0-2-1.119-2-2.5S9.895,14,11,14s2,1.119,2,2.5S12.105,19,11,19z M19,19 c-1.105,0-2-1.119-2-2.5s0.895-2.5,2-2.5s2,1.119,2,2.5S20.105,19,19,19z"></path>
                    </svg>
                  </a>

                  <a
                    href="https://www.linkedin.com/company/dsiufl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 transition-colors duration-300 hover:text-primary"
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48a1.56,1.56,0,1,1,1.56-1.56A1.56,1.56,0,0,1,6.59,8.48ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
