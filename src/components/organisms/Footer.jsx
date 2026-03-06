import { Instagram, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  // We define the links explicitly to handle the special case for "Home" -> "/"
  const footerSections = [
    {
      title: "Platform", // Better than "Features" for general navigation
      links: [
        { name: "Home", href: "/" }, // Explicitly points to root
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/signup" },
      ],
    },
    {
      title: "Arena", // Better than "Learn more" for a coding site
      links: [
        { name: "Explore", href: "/explore" },
        { name: "Problems", href: "/problems" },
        { name: "Contests", href: "/contest" },
      ],
    },
  ];

  return (
    <footer className="bg-neutral text-neutral-content w-full py-10 mt-auto border-t border-base-content/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8">

        {/* Brand Section */}
        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-2">
            🌊ode<span className="font-bold text-base-content">IU</span>
          </h3>
          <p className="opacity-70 text-sm leading-relaxed">
            Your gateway to the future of web development.<br />
            Building tomorrow's applications with cutting-edge technology.
          </p>

          <div className="flex mt-6 space-x-5">
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

        {/* Dynamic Links Sections */}
        {footerSections.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-md font-mono font-bold mb-3 uppercase tracking-wider">
              {section.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="opacity-70 hover:opacity-100 hover:text-primary transition-all link link-hover"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Info */}
        <div>
          <h4 className="text-md font-mono font-bold mb-3 uppercase tracking-wider">
            Connect
          </h4>
          <div className="text-sm opacity-70 space-y-2">
            <div className="hover:text-primary cursor-pointer transition-colors">
              codeiu8@gmail.com
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}