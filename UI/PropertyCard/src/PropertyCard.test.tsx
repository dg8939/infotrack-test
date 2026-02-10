import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { PropertyCard } from "./PropertyCard";
import type { InternalProperty } from "./types";

const makeProperty = (
  overrides?: Partial<InternalProperty>,
): InternalProperty => ({
  fullAddress: "10 Example St, Carlton VIC 3053",
  lotPlan: { lot: "12", plan: "PS123456" },
  volumeFolio: { volume: null, folio: null },
  status: "UnknownVolFol",
  sourceTrace: {
    provider: "VIC-DDP",
    requestId: "REQ-12345",
    receivedAt: "2026-02-01T03:12:45Z",
  },
  ...overrides,
});

// Group test
describe("<PropertyCard />", () => {
  // Test case 1: Rendering Property Details
  it("renders the basic property details", () => {
    const property = makeProperty({
      volumeFolio: { volume: "1234", folio: "567" },
      status: "KnownVolFol",
    });

    render(<PropertyCard property={property} />);

    expect(
      screen.getByRole("heading", { name: /10 example st, carlton vic 3053/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/lot\s*\/\s*plan:/i)).toBeInTheDocument();

    const lotPlanPara = screen.getByText((content, element) => {
      const text = element?.textContent ?? "";
      return (
        element?.tagName.toLowerCase() === "p" &&
        /Lot\s*\/\s*Plan:/i.test(text) &&
        text.includes("12") &&
        text.includes("PS123456")
      );
    });
    expect(lotPlanPara).toBeInTheDocument();

    expect(screen.getByText(/volume:/i)).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();

    expect(screen.getByText(/folio:/i)).toBeInTheDocument();
    expect(screen.getByText("567")).toBeInTheDocument();

    expect(screen.getByText(/KnownVolFol/)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /edit volume\/folio/i }),
    ).toBeInTheDocument();
  });

  // Test 2: Modal Interaction - Open and pre-fill
  it("opens the modal and pre-fills inputs when Edit is clicked", () => {
    const property = makeProperty({
      volumeFolio: { volume: "1111", folio: "22" },
      status: "KnownVolFol",
    });

    render(<PropertyCard property={property} />);

    const editButton = screen.getByRole("button", {
      name: /edit volume\/folio/i,
    });
    fireEvent.click(editButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const volumeInput = screen.getByRole("textbox", {
      name: /volume/i,
    }) as HTMLInputElement;
    const folioInput = screen.getByRole("textbox", {
      name: /folio/i,
    }) as HTMLInputElement;

    expect(volumeInput.value).toBe("1111");
    expect(folioInput.value).toBe("22");
  });

  // Test 3 - Validation erros
  it("shows validation errors for invalid volume and folio", () => {
    const property = makeProperty();

    render(<PropertyCard property={property} />);

    fireEvent.click(
      screen.getByRole("button", { name: /edit volume\/folio/i }),
    );

    const volumeInput = screen.getByRole("textbox", {
      name: /volume/i,
    }) as HTMLInputElement;
    const folioInput = screen.getByRole("textbox", {
      name: /folio/i,
    }) as HTMLInputElement;

    fireEvent.change(volumeInput, {
      target: { value: "1234567" },
    });
    fireEvent.change(folioInput, {
      target: { value: "abc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(screen.getByText(/volume must be 1.?6 digits/i)).toBeInTheDocument();
    expect(screen.getByText(/folio must be 1.?5 digits/i)).toBeInTheDocument();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // Test 4 - updates display and calls onChange
  it("updates display and calls onChange on successful confirm", () => {
    const property = makeProperty();
    const handleChange = vi.fn();

    render(<PropertyCard property={property} onChange={handleChange} />);

    fireEvent.click(
      screen.getByRole("button", { name: /edit volume\/folio/i }),
    );

    const volumeInput = screen.getByRole("textbox", {
      name: /volume/i,
    }) as HTMLInputElement;
    const folioInput = screen.getByRole("textbox", {
      name: /folio/i,
    }) as HTMLInputElement;

    fireEvent.change(volumeInput, {
      target: { value: "1234" },
    });
    fireEvent.change(folioInput, {
      target: { value: "567" },
    });

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    expect(screen.getByText("1234")).toBeInTheDocument();
    expect(screen.getByText("567")).toBeInTheDocument();
    expect(screen.getByText(/KnownVolFol/)).toBeInTheDocument();

    expect(handleChange).toHaveBeenCalledTimes(1);
    const updatedArg = handleChange.mock.calls[0][0] as InternalProperty;
    expect(updatedArg.volumeFolio.volume).toBe("1234");
    expect(updatedArg.volumeFolio.folio).toBe("567");
    expect(updatedArg.status).toBe("KnownVolFol");
  });

  // Test 5 - closes modal on Close and Escape
  it("closes modal on Close and Escape", () => {
    const property = makeProperty();

    render(<PropertyCard property={property} />);

    const editButton = screen.getByRole("button", {
      name: /edit volume\/folio/i,
    });

    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
