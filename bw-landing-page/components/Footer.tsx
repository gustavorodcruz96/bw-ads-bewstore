import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import logo from "@/assets/bew-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Brand */}
          <div className="md:basis-[36%] lg:basis-[38%] md:min-w-[260px] lg:min-w-[280px]">
            <img src={logo} alt="B&W Store" className="h-12 mb-6" />
            <p className="text-gray-400 mb-6 max-w-md">
              Especialistas em substituição de bateria para iPhone, iPad e Apple Watch. 
              Qualidade, agilidade e garantia de autonomia.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/bewstoreoficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="md:flex-1">
            <h4 className="font-semibold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Rua Alagoas, 1050 – Savassi<br />
                  Belo Horizonte – MG
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href="tel:+553138890437" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Fixo: (31) 3889-0437
                </a>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="h-5 w-5 text-gray-400" />
                <a href="https://wa.me/5531990742171?text=Ol%C3%A1%2C%20vi%20o%20an%C3%BAncio%20e%20quero%20um%20or%C3%A7amento%20de%20troca%20da%20bateria%20do%20meu%20aparelho%20Apple%21%20%23BT25B" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  WhatsApp: (31) 99074-2171
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:contato@bewstore.com.br"
                  className="text-gray-400 hover:text-primary-foreground transition-colors"
                >
                  contato@bewstore.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:flex-1">
            <h4 className="font-semibold text-lg mb-6">Serviços</h4>
            <ul className="space-y-3">
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Substituição de Bateria iPhone
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Bateria para iPad
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Bateria Apple Watch
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-gray-400 hover:text-primary-foreground transition-colors">
                  Diagnóstico de Bateria
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
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-sm text-center">
              © {new Date().getFullYear()} B&W Store. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
