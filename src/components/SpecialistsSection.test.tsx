import { render, screen } from "@testing-library/react";
import SpecialistsSection from "./SpecialistsSection";

const isBefore = (a: HTMLElement, b: HTMLElement) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("SpecialistsSection", () => {
  it("segue a sequência conteúdo-imagem-conteúdo-imagem no DOM", () => {
    render(<SpecialistsSection />);

    const content1 = screen.getByTestId("specialists-content-1");
    const image1 = screen.getByTestId("specialists-image-1");
    const content2 = screen.getByTestId("specialists-content-2");
    const image2 = screen.getByTestId("specialists-image-2");

    expect(isBefore(content1, image1)).toBe(true);
    expect(isBefore(image1, content2)).toBe(true);
    expect(isBefore(content2, image2)).toBe(true);
  });

  it("mantém espaçamento mínimo entre blocos através de gap utilities", () => {
    render(<SpecialistsSection />);

    const firstGrid = screen.getByTestId("specialists-content-1").parentElement;
    const secondGrid = screen.getByTestId("specialists-content-2").parentElement;

    expect(firstGrid?.className).toContain("gap-8");
    expect(secondGrid?.className).toContain("gap-8");
  });

  it("renderiza exatamente duas imagens com proporções responsivas e sem sobreposição estrutural", () => {
    render(<SpecialistsSection />);

    const mainImage = screen.getByAltText(
      "Técnico especialista B&W realizando diagnóstico em dispositivo",
    ) as HTMLImageElement;
    const secondaryImage = screen.getByAltText(
      "Técnico B&W em atendimento especializado ao cliente",
    ) as HTMLImageElement;

    expect(mainImage).toBeInTheDocument();
    expect(secondaryImage).toBeInTheDocument();
    expect(mainImage.className).toContain("object-cover");
    expect(secondaryImage.className).toContain("object-cover");
  });

  it("otimiza performance com carregamento preguiçoso das imagens principais", () => {
    render(<SpecialistsSection />);

    const mainImage = screen.getByAltText(
      "Técnico especialista B&W realizando diagnóstico em dispositivo",
    ) as HTMLImageElement;
    const secondaryImage = screen.getByAltText(
      "Técnico B&W em atendimento especializado ao cliente",
    ) as HTMLImageElement;

    expect(mainImage.getAttribute("loading")).toBe("lazy");
    expect(secondaryImage.getAttribute("loading")).toBe("lazy");
  });
});
