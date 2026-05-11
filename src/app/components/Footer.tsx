import { Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#0f0f17] border-t border-purple-500/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">ECO-н тухай</h3>
            <p className="text-gray-400 leading-relaxed">
              ECO нь Улаанбаатарын шилдэг компьютер тоглоомын төвүүдээс тоглох цагаа захиалах тэргүүлэх платформ юм. 
              Төгс тохиргоог олж, үнийг харьцуулж, тоглох цагаа шууд захиална уу.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Холбоо барих</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <Phone className="size-5" />
                <span>+976 7777-0000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <Mail className="size-5" />
                <span>info@eco-gaming.mn</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <MapPin className="size-5" />
                <span>Улаанбаатар, Монгол Улс</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Холбоосууд</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Нүүр хуудас
              </Link>
              <Link to="/guidelines" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Заавар ба тусламж
              </Link>
              <Link to="/login" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Нэвтрэх
              </Link>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Facebook className="size-5" />
                <span>Facebook хуудас</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-purple-500/20 text-center text-gray-500">
          <p>&copy; 2026 ECO Gaming. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}