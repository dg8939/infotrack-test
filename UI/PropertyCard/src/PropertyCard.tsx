import React, { useState } from "react";
import type { InternalProperty } from "./types";
import "./PropertyCard.css";
import Modal from "./Modal";

// what parameters the property card accepts
type PropertyCardProps = {
  property: InternalProperty;
  onChange?: (next: InternalProperty) => void;
};

// Function component is PropertyCardProps
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onChange,
}) => {
  const [current, setCurrent] = useState<InternalProperty>(property);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModalWithoutChange = () => setIsModalOpen(false);

  const handleConfirm = (next: {
    volume: string | null;
    folio: string | null;
  }) => {
    const updated: InternalProperty = {
      ...current, // copy everything from current into new object
      volumeFolio: {
        volume: next.volume,
        folio: next.folio,
      },
      status:
        (next.volume && next.volume.length > 0) ||
        (next.folio && next.folio.length > 0)
          ? "KnownVolFol"
          : "UnknownVolFol",
    };

    setCurrent(updated);
    onChange?.(updated);
    setIsModalOpen(false);
  };

  const displayVolume = current.volumeFolio.volume ?? "-";
  const displayFolio = current.volumeFolio.folio ?? "-";

  return (
    <>
      <article className="property-card" aria-label="Property details">
        <header className="property-card-header">
          <h2 className="property-card-title">{current.fullAddress}</h2>
          <button
            type="button"
            className="property-card-edit-button"
            onClick={openModal}
          >
            Edit volume/folio
          </button>
        </header>

        {current.lotPlan && (
          <p>
            <strong>Lot/Plan:</strong> {current.lotPlan.lot ?? "–"}/
            {current.lotPlan.plan ?? "–"}
          </p>
        )}

        <p>
          <strong>Volume:</strong> {displayVolume}
        </p>

        <p>
          <strong>Folio:</strong> {displayFolio}
        </p>

        <p>
          <strong>Status:</strong> {current.status}
        </p>
      </article>

      {/* Calling the modal component and passing the required props */}
      <Modal
        isOpen={isModalOpen}
        initialVolume={current.volumeFolio.volume ?? ""}
        initialFolio={current.volumeFolio.folio ?? ""}
        onClose={closeModalWithoutChange}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default PropertyCard;
