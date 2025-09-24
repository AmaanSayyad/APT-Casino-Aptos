'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GradientBorderButton from "./GradientBorderButton";
import { FaGlobe, FaChevronDown, FaChevronUp, FaMobileAlt, FaLock, FaShieldAlt, FaCoins } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  
  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com", icon: "/icons/twitter.svg" },
    { name: "Discord", url: "https://discord.com", icon: "/icons/discord.svg" },
    { name: "Telegram", url: "https://telegram.org", icon: "/icons/telegram.svg" },
    { name: "GitHub", url: "https://github.com", icon: "/icons/github.svg" },
  ];
  
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "jp", name: "日本語" },
  ];
  
  const paymentMethods = [
    { name: "APT", icon: "/icons/apt.svg" },
    { name: "APTC", icon: "/icons/apt.svg" },
  ];
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      // In a real app, you would send this to your API
      console.log("Subscribing email:", email);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer id="footer" className="bg-sharp-black text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-red-magic/10 blur-[100px] animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-blue-magic/10 blur-[100px] animate-pulse" style={{animationDelay: "1.5s"}}></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-600/10 blur-[80px] animate-pulse" style={{animationDelay: "0.7s"}}></div>
      
      {/* Top Divider with animated gradient */}
      <div className="w-full h-0.5 bg-gradient-to-r from-red-magic via-blue-magic to-red-magic bg-[length:200%_auto] animate-gradient mb-12"></div>

      {/* Footer Content */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 px-6">
        {/* Logo and Description */}
        <div className="md:col-span-4">
          <a href="/" className="logo block mb-6 transition-transform hover:scale-105">
            <Image src="/PowerPlay.png" alt="PowerPlay logo" width={172} height={15} />
          </a>
          <div className="p-[1px] bg-gradient-to-r from-red-magic/40 to-blue-magic/40 rounded-lg mb-6 hover:from-red-magic hover:to-blue-magic transition-all duration-300">
            <div className="bg-[#120010] rounded-lg p-4">
              <p className="text-white/80 text-sm leading-relaxed">
                APT-Casino is your ultimate destination for Aptos gaming. Experience transparency, fairness,
                and excitement powered by Aptos blockchain technology.
              </p>
            </div>
          </div>
          
          {/* Social Media Links in a gradient border */}
          <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-lg hover:shadow-lg hover:shadow-red-magic/20 transition-all duration-300">
            <div className="bg-[#120010] rounded-lg p-4 flex justify-between">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.name}
                  className="group transition-transform hover:scale-110"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#250020] rounded-full group-hover:bg-gradient-to-r group-hover:from-red-magic group-hover:to-blue-magic transition-all duration-300">
                    <Image 
                      src={social.icon} 
                      alt={social.name} 
                      width={20} 
                      height={20} 
                      className="filter invert"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="mt-6 relative">
            <button 
              className="flex items-center gap-2 text-white/70 hover:text-white p-2 rounded-md bg-[#250020] hover:bg-[#350030] w-full transition-colors"
              onClick={() => setShowLanguage(!showLanguage)}
            >
              <FaGlobe className="text-blue-magic" />
              <span>Select Language</span>
              {showLanguage ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
            </button>
            
            {showLanguage && (
              <div className="absolute z-10 mt-1 w-full bg-[#250020] border border-white/10 rounded-md shadow-xl p-1 animate-fadeIn">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-md w-full text-left transition-colors"
                    onClick={() => setShowLanguage(false)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="md:col-span-2 md:ml-8">
          <div className="mb-3 flex items-center">
            <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
            <h3 className="font-display text-lg">Navigation</h3>
          </div>
          <ul className="space-y-3 mt-4">
            {["Home", "Game", "Bank", "About Us", "FAQs"].map((item) => (
              <li key={item}>
                <Link 
                  href={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`} 
                  className="text-white/70 hover:text-white flex items-center transition-all group"
                >
                  <span className="w-0 h-[1px] magic-gradient mr-0 group-hover:w-2 group-hover:mr-2 transition-all"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          
         
        </div>

        {/* Support Links */}
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center">
            <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
            <h3 className="font-display text-lg">Support</h3>
          </div>
          <ul className="space-y-3 mt-4">
            {[
              "Contact Us", 
              "Privacy Policy", 
              "Terms of Service", 
              "Responsible Gaming"
            ].map((item) => (
              <li key={item}>
                <Link 
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} 
                  className="text-white/70 hover:text-white flex items-center transition-all group"
                >
                  <span className="w-0 h-[1px] magic-gradient mr-0 group-hover:w-2 group-hover:mr-2 transition-all"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Security Badges */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium mb-3 text-white/90 flex items-center">
              <FaShieldAlt className="mr-2 text-green-500" /> Security & Trust
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-[#250020] p-1.5 rounded-md flex items-center gap-1.5 text-xs text-white/80">
                <FaLock className="text-green-500" /> SSL Secured
              </div>
              <div className="bg-[#250020] p-1.5 rounded-md flex items-center gap-1.5 text-xs text-white/80">
                <FaShieldAlt className="text-blue-magic" /> Provably Fair
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter and CTA */}
        <div className="md:col-span-4">
          <div className="mb-3 flex items-center">
            <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
            <h3 className="font-display text-lg">Stay Updated</h3>
          </div>
          
          <div className="mt-4 p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-lg shadow-lg transition-all hover:shadow-red-magic/30">
            <div className="bg-[#120010] rounded-lg p-4">
              <p className="text-white/70 text-sm mb-3">
                Subscribe to receive updates about new games, features, and promotions.
              </p>
              
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex gap-2 mb-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#250020] border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-magic transition-colors"
                    required
                  />
                  <GradientBorderButton type="submit">
                    Subscribe
                  </GradientBorderButton>
                </div>
                
                {isSubscribed && (
                  <div className="text-green-500 text-xs animate-fadeIn absolute">
                    Thank you for subscribing!
                  </div>
                )}
              </form>
              
              <div className="flex justify-center mt-6">
                <Link href="/game" className="w-full">
                  <button className="w-full magic-gradient hover:opacity-90 transition-all text-white font-display py-3 px-6 rounded-md hover:shadow-lg hover:shadow-red-magic/30">
                    Launch Game
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
          
        </div>
      </div>

      {/* Bottom Divider and Legal */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mt-12 mb-6 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} APT-Casino. All rights reserved.
          </div>
          
          <div className="text-xs text-white/40 flex gap-4">
            <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
            <span>|</span>
            <a href="/cookies" className="hover:text-white/60 transition-colors">Cookies</a>
            <span>|</span>
            <a href="/responsible-gaming" className="hover:text-white/60 transition-colors">Play Responsibly</a>
          </div>
        </div>
        
        {/* Compliance Statement */}
        <div className="text-xs text-white/30 text-center mt-6">
          APT-Casino encourages responsible gaming. Please play responsibly and only with funds you can afford to lose.
          Gambling can be addictive. If you need help or advice, please visit <a href="/responsible-gaming" className="underline hover:text-white/50 transition-colors">Responsible Gaming</a>.
        </div>
      </div>
    </footer>
  );
}
