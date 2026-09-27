"use client";
import { useState } from "react";
import { Shade } from "@/config/wedding";
export function ColorSwatches({ shades }: { shades: Shade[] }) {
  const [selected, setSelected] = useState("");
  return (
    <div className="swatch-group">
      <div className="swatches">
        {shades.map((shade) => (
          <button
            key={shade.name}
            className="swatch"
            style={{ backgroundColor: shade.hex }}
            aria-label={shade.name}
            aria-pressed={selected === shade.name}
            title={shade.name}
            onClick={() => setSelected(shade.name)}
          >
            <span>{shade.name}</span>
          </button>
        ))}
      </div>
      <p className="shade-name" aria-live="polite">
        {selected || "A palette for your own expression"}
      </p>
    </div>
  );
}
