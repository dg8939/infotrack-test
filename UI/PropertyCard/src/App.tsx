import React from "react";
import "./App.css";
import "./PropertyCard.css";
import { PropertyCard } from "./PropertyCard";
import type { InternalProperty } from "./types";

const mockProperty: InternalProperty = {
  fullAddress: "10 Example St, Carlton VIC 3053",
  lotPlan: { lot: "12", plan: "PS123456" },
  volumeFolio: { volume: "1234", folio: "567" },
  status: "KnownVolFol",
  sourceTrace: {
    provider: "VIC-DDP",
    requestId: "REQ-12345",
    receivedAt: "2026-02-01T03:12:45Z",
  },
};

function App() {
  return (
    <div className="app-root">
      <h1>Property Card Demo</h1>
      <PropertyCard
        property={mockProperty}
        onChange={(next) => {
          console.log("Property updated from App:", next);
        }}
      />
    </div>
  );
}

export default App;
