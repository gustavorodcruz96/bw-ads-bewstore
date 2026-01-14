import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/bew-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="B&W Store" className="h-12 mb-6" />
            <p className="text-gray-400 mb-6 max-w-md">
              Especialistas em troca de vidro e substituição de tela para iPhone, iPad e Apple Watch. 
              Qualidade, agilidade e garantia em todos os serviços.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/bwstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/bwstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Centro, Belo Horizonte - MG
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href="tel:+5531999999999" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  (31) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Seg - Sex: 9h às 18h<br />
                  Sáb: 9h às 14h
                </span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Serviços</h4>
            <ul className="space-y-3">
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Troca de Tela iPhone
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Troca de Vidro
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Tela para iPad
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Vidro Apple Watch
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Manutenção Geral
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} B&W Store. Todos os direitos reservados.
            </p>
            <p className="text-gray-600 text-xs text-center md:text-right max-w-lg">
              Prestadora de serviços independente. Não possuímos vínculo com a Apple Inc. 
              Todas as marcas mencionadas são propriedade de seus respectivos detentores.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
