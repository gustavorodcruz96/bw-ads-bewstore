import { render, screen } from "@testing-library/react";
import IphoneHighlightSection from "./IphoneHighlightSection";

describe("IphoneHighlightSection", () => {
  it("renderiza a imagem com largura mínima de 380px em desktop e alinhada ao fundo do card", () => {
    render(<IphoneHighlightSection />);

    const card = screen.getByTestId("iphone-highlight-card");
    const img = screen.getByAltText("iPhone com bateria nova");

    expect(card.className).toContain("overflow-visible");
    expect(img.className).toContain("md:bottom-0");
    expect(img.className).toContain("md:w-[380px]");
    expect(img.className).toContain("object-cover");
  });
});
