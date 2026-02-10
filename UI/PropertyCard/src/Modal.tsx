import React, { useEffect, useRef, useState } from "react";
import "./PropertyCard.css";

// Error object
type FieldErrors = {
  volume?: string;
  folio?: string;
};

// criteria for valid volume and folio inputs
const volumeRegex = /^\d{1,6}$/;
const folioRegex = /^\d{1,5}$/;

// what paramaters the modal accepts
export type ModalProps = {
  isOpen: boolean;
  initialVolume: string;
  initialFolio: string;
  onClose: () => void;
  onConfirm: (next: { volume: string | null; folio: string | null }) => void;
};

// Accepts values like the modalprops
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  initialVolume,
  initialFolio,
  onClose,
  onConfirm,
}) => {
  const [volumeInput, setVolumeInput] = useState(initialVolume);
  const [folioInput, setFolioInput] = useState(initialFolio);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Focus on modal
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Focus on the first input when modal opens
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Store the last focus element before modal opens. E.g edit button
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // sync input values when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setVolumeInput(initialVolume);
    setFolioInput(initialFolio);
    setErrors({});
  }, [isOpen, initialVolume, initialFolio]);

  // Keyboard handling + focus trap
  useEffect(() => {
    if (!isOpen) return;

    // storing ref of the edit button
    lastFocusRef.current = document.activeElement as HTMLElement | null;

    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            "button, input, textarea",
          ),
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        // preventDefault to stay inside modal
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    // Call handleKeyDown when a key is pressed
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;

    if (lastFocusRef.current) {
      lastFocusRef.current.focus();
    }
  }, [isOpen]);

  // After hitting confirm button
  const handleConfirm = () => {
    const nextErrors: FieldErrors = {};

    if (volumeInput && !volumeRegex.test(volumeInput)) {
      nextErrors.volume = "Volume must be 1-6 digits.";
    }

    if (folioInput && !folioRegex.test(folioInput)) {
      nextErrors.folio = "Folio must be 1-5 digits.";
    }

    setErrors(nextErrors);

    // Error even if one key in the array
    if (Object.keys(nextErrors).length > 0) return;

    onConfirm({
      volume: volumeInput || null,
      folio: folioInput || null,
    });
  };

  if (!isOpen) return null;

  return (
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
            <button type="button" onClick={onClose}>
              Close
            </button>
            <button type="button" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Modal;
