import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import logo from "@/assets/bew-logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const atTop = currentY <= 20;

      setIsScrolled(!atTop);

      if (atTop) {
        setIsVisible(true);
      } else {
        if (currentY > lastScrollY.current + 2) {
          setIsVisible(false);
        } else if (currentY < lastScrollY.current - 2) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappLink =
    "https://wa.me/5531990742171?text=Olá! Gostaria de um orçamento para substituição de tela.";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-200 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        isScrolled
          ? "bg-background/75 backdrop-blur-lg shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="B&W Store" 
            className={`h-10 transition-all duration-300 ${isScrolled ? 'invert' : ''}`} 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#servicos"
            className={`text-sm font-medium transition-colors hover:text-gray-500 ${
              isScrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            Serviços
          </a>
          <a
            href="#beneficios"
            className={`text-sm font-medium transition-colors hover:text-gray-500 ${
              isScrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            Por que escolher
          </a>
          <a
            href="#depoimentos"
            className={`text-sm font-medium transition-colors hover:text-gray-500 ${
              isScrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            Depoimentos
          </a>
          <Button
            asChild
            className="gap-2"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" />
              Orçamento
            </a>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-lg animate-fade-in">
          <nav className="container py-6 flex flex-col gap-4">
            <a
              href="#servicos"
              className="text-foreground font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="#beneficios"
              className="text-foreground font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Por que escolher
            </a>
            <a
              href="#depoimentos"
              className="text-foreground font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Depoimentos
            </a>
            <Button asChild className="w-full gap-2 mt-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                <WhatsAppIcon className="h-4 w-4" />
                Solicitar Orçamento
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
