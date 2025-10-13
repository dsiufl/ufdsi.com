"use client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="relative z-10 bg-primary pt-12 pb-6 text-white">
        <div className="container">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
            {/* Left Side - Branding and Description */}
            <div className="flex-1 max-w-md">
              {/* Logo */}
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center mr-2">
                  <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <div className="text-xl font-bold">
                  <div>uf dsi</div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-white/90 mb-4 leading-relaxed text-sm">
                A student-run organization at the University of Florida that provides opportunities for students to explore data science, artificial intelligence, and machine learning through workshops, networking events, and research symposiums.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex gap-2">
                <a
                  href="https://www.instagram.com/uf_dsi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/dsiufl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://discord.gg/GUEAwEhRQw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Discord"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@ufdsi.com"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Side - Navigation Links */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* General */}
              <div>
                <h3 className="font-bold text-base mb-3">General</h3>
                <ul className="space-y-1.5">
                  <li><Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm">About</Link></li>
                  <li><Link href="/team" className="text-white/80 hover:text-white transition-colors text-sm">Team</Link></li>
                  <li><Link href="/workshops-list" className="text-white/80 hover:text-white transition-colors text-sm">Workshops</Link></li>
                  <li><Link href="/symposium" className="text-white/80 hover:text-white transition-colors text-sm">Symposium</Link></li>
                </ul>
              </div>

              {/* Students */}
              <div>
                <h3 className="font-bold text-base mb-3">Students</h3>
                <ul className="space-y-1.5">
                  <li><Link href="/newsletter" className="text-white/80 hover:text-white transition-colors text-sm">Newsletter</Link></li>
                  <li><Link href="/calendar" className="text-white/80 hover:text-white transition-colors text-sm">Calendar</Link></li>
                  <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                  <li><a href="https://discord.gg/GUEAwEhRQw" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors text-sm">Join Discord</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-bold text-base mb-3">Resources</h3>
                <ul className="space-y-1.5">
                  <li><Link href="/newsletter" className="text-white/80 hover:text-white transition-colors text-sm">Past Events</Link></li>
                  <li><Link href="/workshops-list" className="text-white/80 hover:text-white transition-colors text-sm">Workshop Materials</Link></li>
                  <li><Link href="/symposium" className="text-white/80 hover:text-white transition-colors text-sm">Research Papers</Link></li>
                  <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">Get Involved</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Separator */}
          <Separator className="bg-white/20 mb-6" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Left Side - Hosting Information */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                  <span>Hosted by UF</span>
                </div>
              </Badge>
              <p className="text-xs text-white/70 text-center md:text-left">
                We are a student organization at the University of Florida. We take full responsibility for our organization and this website.
              </p>
            </div>

            {/* Right Side - Copyright */}
            <div className="text-xs text-white/70">
              © 2025 UF DSI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
