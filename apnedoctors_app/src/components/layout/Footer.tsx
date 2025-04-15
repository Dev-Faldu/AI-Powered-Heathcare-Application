
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-8 h-8 bg-gradient-to-br from-medical-400 to-teal-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
                <span className="relative z-10">A</span>
                <div className="absolute inset-0 bg-white opacity-20 rounded-md blur-sm"></div>
              </div>
              <span className="font-medium text-xl">
                <span className="text-medical-700 dark:text-medical-400">Apne</span>
                <span className="text-teal-600 dark:text-teal-400">Doctors</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Revolutionizing healthcare with AI-powered diagnostics and seamless doctor-patient communication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-medical-500 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-medical-500 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-medical-500 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-medical-500 transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-4">Features</h5>
            <ul className="space-y-3">
              <li><Link to="/diagnosis" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">AI Diagnosis</Link></li>
              <li><Link to="/doctors" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Find Doctors</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Health Dashboard</Link></li>
              <li><Link to="/records" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Medical Records</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-4">Company</h5>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Press</Link></li>
              <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-4">Contact</h5>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={16} className="text-gray-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">aryanpawar.apnedoctors@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={16} className="text-gray-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">+91 6353685893</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-gray-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Manipal University, Jaipur</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} ApneDoctors. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">Terms of Service</Link>
              <Link to="/hipaa" className="text-gray-600 dark:text-gray-400 hover:text-medical-500 dark:hover:text-medical-400 text-sm">HIPAA Compliance</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
