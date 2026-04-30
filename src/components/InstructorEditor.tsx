import type { DiagramOverrides, Instruction } from "../models/instructions";

export default function InstructionEditor({
  instruction,
  onChange,
  onClose,
}: {
  instruction: Instruction;
  onChange: (next: Instruction) => void;
  onClose: () => void;
}) {
  const ro = instruction.diagram.renderOverrides ?? {};

  function updateOverrides(patch: Partial<DiagramOverrides>) {
    const nextOverrides: DiagramOverrides = { ...ro, ...patch };

    onChange({
      ...instruction,
      diagram: {
        ...instruction.diagram,
        renderOverrides: nextOverrides,
      },
    });
  }

  function resetOverrides() {
    onChange({
      ...instruction,
      diagram: {
        ...instruction.diagram,
        renderOverrides: undefined,
      },
    });
  }

  return (
    <div
      style={{
        position: "relative",
        marginTop: 12,
        padding: 12,
        border: "1px solid #222",
        background: "#fff",
      }}
    >
      {/* Close button (top-right X) */}
      <button
        onClick={onClose}
        aria-label="Close editor"
        title="Close"
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 28,
          height: 28,
          lineHeight: "26px",
          textAlign: "center",
          border: "1px solid #222",
          background: "#fff",
          cursor: "pointer",
          padding: 0,
        }}
      >
        ×
      </button>

      <div style={{ fontWeight: 700, marginBottom: 8, paddingRight: 32 }}>
        Evil mode — instruction #{instruction.index}
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={ro.hideRoadNames === true}
          onChange={(e) => updateOverrides({ hideRoadNames: e.target.checked })}
        />
        Hide road names
      </label>

      <label
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <input
          type="checkbox"
          checked={ro.hideDistance === true}
          onChange={(e) => updateOverrides({ hideDistance: e.target.checked })}
        />
        Hide distance
      </label>

      <label
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        Rotate diagram (deg):
        <input
          type="number"
          value={ro.rotationOverrideDeg ?? 0}
          onChange={(e) =>
            updateOverrides({
              rotationOverrideDeg: Number(e.target.value) || 0,
            })
          }
          style={{ width: 90 }}
        />
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={resetOverrides}>Reset to generated</button>
      </div>
    </div>
  );
}