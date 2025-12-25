import { Instagram, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content w-full py-10 mt-auto border-t border-base-content/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Brand Section */}
        <div>
          <h3 className="text-xl font-sans font-bold mb-2">🌊odeIU</h3>
          <p className="opacity-70 text-sm leading-relaxed">
            Your gateway to the future of web development.<br />
            Building tomorrow's applications with cutting-edge technology.
          </p>
          
          <div className="flex mt-6 space-x-5">
            {/* Using link-hover for a professional feel */}
            <a href="#" className="hover:text-primary transition-all hover:-translate-y-1">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-all hover:-translate-y-1">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-all hover:-translate-y-1">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-all hover:-translate-y-1">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links Sections */}
        {[ 
          { title: "Features", links: ["Home", "Login", "Sign Up"] },
          { title: "Learn more", links: ["Explore", "Problems", "Contests"] }
        ].map((section, idx) => (
          <div key={idx}>
            <h4 className="text-md font-mono font-bold mb-3 uppercase tracking-wider">{section.title}</h4>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link}>
                  <a 
                    href={`/${link.toLowerCase().replace(" ", "")}`} 
                    className="opacity-70 hover:opacity-100 hover:text-primary transition-all link link-hover"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Info */}
        <div>
          <h4 className="text-md font-mono font-bold mb-3 uppercase tracking-wider">Support</h4>
          <div className="text-sm opacity-70 space-y-2">
            <div className="hover:text-primary cursor-pointer transition-colors">support@codeiu.com</div>
            <div className="hover:text-primary cursor-pointer transition-colors">+1 (555) 999-NEURAL</div>
          </div>
        </div>

      </div>
    </footer>
  );
}