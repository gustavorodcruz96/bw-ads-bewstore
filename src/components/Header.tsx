import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/bew-logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappLink = "https://wa.me/5531999999999?text=Olá! Gostaria de um orçamento para troca de tela.";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
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
            className={`gap-2 ${
              isScrolled 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-primary-foreground text-primary hover:bg-gray-200'
            }`}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4" />
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
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4" />
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
