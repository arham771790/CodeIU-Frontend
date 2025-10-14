import { Instagram  , Github , Twitter , Facebook , Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black w-full text-white py-10 mt-auto border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-xl font-sans font-bold mb-2 text-gray-100">🌊odeIU</h3>
          <p className="text-gray-400 text-sm">
            Your gateway to the future of web development.<br />
            Building tomorrow's applications with cutting-edge technology.
          </p>
          <div className="flex space-x-3 mt-6 space-x-5">
              <a href="#" className="hover:text-cyan-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-500">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Linkedin className="w-5 h-5 " />
              </a>
            </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="text-md font-mono mb-2 text-white">Features</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</a>
            </li>
            <li>
              <a href="/login" className="text-gray-400 hover:text-purple-400 transition-colors">Login</a>
            </li>
            <li>
              <a href="/signup" className="text-gray-400 hover:text-pink-400 transition-colors">Sign Up</a>
            </li>
          </ul>
        </div>
         <div>
          <h4 className="text-md font-mono mb-2 text-white">Learn more</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</a>
            </li>
            <li>
              <a href="/login" className="text-gray-400 hover:text-purple-400 transition-colors">Login</a>
            </li>
            <li>
              <a href="/signup" className="text-gray-400 hover:text-pink-400 transition-colors">Sign Up</a>
            </li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="text-md font-mono mb-2 text-white">Support</h4>
          <div className="text-sm text-gray-400 space-y-2">
            <div>support@codeiu.com</div>
            <div>+1 (555) 999-NEURAL</div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}