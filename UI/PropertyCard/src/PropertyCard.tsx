import React, { useEffect, useRef, useState } from "react";
import type { InternalProperty } from "./types";
import "./PropertyCard.css";

type PropertyCardProps = {
  property: InternalProperty;

  onChange?: (next: InternalProperty) => void;
};

type FieldErrors = {
  volume?: string;
  folio?: string;
};

const volumeRegex = /^\d{1,6}$/;
const folioRegex = /^\d{1,5}$/;

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onChange,
}) => {
  const [current, setCurrent] = useState<InternalProperty>(property);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [volumeInput, setVolumeInput] = useState(
    property.volumeFolio.volume ?? "",
  );

  const [folioInput, setFolioInput] = useState(
    property.volumeFolio.folio ?? "",
  );

  const [errors, setErrors] = useState<FieldErrors>({});

  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    lastFocusRef.current = document.activeElement as HTMLElement | null;

    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModalWithoutChange();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
          ),
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const openModal = () => {
    setVolumeInput(current.volumeFolio.volume ?? "");
    setFolioInput(current.volumeFolio.folio ?? "");

    setErrors({});
    setIsModalOpen(true);
  };

  const closeModalWithoutChange = () => {
    setIsModalOpen(false);
    setErrors({});

    if (lastFocusRef.current) {
      lastFocusRef.current.focus();
    }
  };

  const handleConfirm = () => {
    const nextErrors: FieldErrors = {};

    if (volumeInput && !volumeRegex.test(volumeInput)) {
      nextErrors.volume = "Volume must be 1-6 digits.";
    }

    if (folioInput && !folioRegex.test(folioInput)) {
      nextErrors.folio = "Folio must be 1-5 digits.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const updated: InternalProperty = {
      ...current,
      volumeFolio: {
        volume: volumeInput || null,
        folio: folioInput || null,
      },
      status:
        volumeInput.length > 0 || folioInput.length > 0
          ? "KnownVolFol"
          : "UnknownVolFol",
    };

    setCurrent(updated);
    onChange?.(updated);
    setIsModalOpen(false);

    if (lastFocusRef.current) {
      lastFocusRef.current.focus();
    }
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

      {isModalOpen && (
        <div className="property-card-modal-overlay">
          <div
            ref={modalRef}
            className="property-card-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-volume-folio-title"
          >
            <section aria-label="Edit volume and folio">
              <h3 id="edit-volume-folio-title">Edit volume/folio</h3>

              <div>
                <label>
                  Volume
                  <input
                    ref={firstInputRef}
                    type="text"
                    value={volumeInput}
                    onChange={(e) => setVolumeInput(e.target.value)}
                  />
                </label>
                {errors.volume && (
                  <p className="property-card-error">{errors.volume}</p>
                )}
              </div>

              <div>
                <label>
                  Folio
                  <input
                    type="text"
                    value={folioInput}
                    onChange={(e) => setFolioInput(e.target.value)}
                  />
                </label>
                {errors.folio && (
                  <p className="property-card-error">{errors.folio}</p>
                )}
              </div>

              <div className="property-card-modal-actions">
                <button type="button" onClick={closeModalWithoutChange}>
                  Close
                </button>
                <button type="button" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;
