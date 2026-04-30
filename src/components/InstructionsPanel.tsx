import { useMemo, useState } from "react";
import type { Instruction } from "../models/instructions";
import InstructionEditor from "./InstructorEditor";
import TulipDiagram from "./TulipDiagram";
import "./instructionsSheet.css";

type Tab = "list" | "sheet" | "file";

export default function InstructionsPanel({
  instructions,
  onChangeInstructions,
}: {
  instructions: Instruction[];
  onChangeInstructions: (next: Instruction[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("sheet");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = instructions.find((x) => x.id === selectedId) ?? null;

  const header = useMemo(() => {
    const totalM = instructions.length
      ? instructions[instructions.length - 1].distanceFromStart
      : 0;
    return { totalM };
  }, [instructions]);

  function updateOne(nextInstr: Instruction) {
    const next = instructions.map((x) => (x.id === nextInstr.id ? nextInstr : x));
    onChangeInstructions(next);
  }

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Route Instructions</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTab("list")} disabled={tab === "list"}>
            List
          </button>
          <button onClick={() => setTab("sheet")} disabled={tab === "sheet"}>
            Sheet
          </button>
          <button onClick={() => setTab("file")} disabled={tab === "file"}>
            File
          </button>
        </div>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: "#444" }}>
        Total distance (mock): {(header.totalM / 1000).toFixed(2)} km
      </div>

      <div style={{ marginTop: 12 }}>
        {tab === "list" && <InstructionList instructions={instructions} />}

        {tab === "sheet" && (
          <>
            <InstructionSheet
              instructions={instructions}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            {selected && (
                <InstructionEditor
                    instruction={selected}
                    onChange={updateOne}
                    onClose={() => setSelectedId(null)}
                />
                )}
          </>
        )}

        {tab === "file" && <div>Export / file settings (later)</div>}
      </div>
    </div>
  );
}

function InstructionList({ instructions }: { instructions: Instruction[] }) {
  return (
    <ol>
      {instructions.map((i) => (
        <li key={i.id}>
          #{i.index} {i.maneuverType} — {(i.distanceFromPrev / 1000).toFixed(2)} km
        </li>
      ))}
    </ol>
  );
}

function metersToKm(m: number) {
  return m / 1000;
}

function fmtKm(m: number) {
  return metersToKm(m).toFixed(2);
}

function InstructionSheet({
  instructions,
  selectedId,
  onSelect,
}: {
  instructions: Instruction[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="sheet">
      <div className="sheetHeader">
        <div>AFSTAND</div>
        <div>#</div>
        <div></div>
        <div>INFORMATIE</div>
        <div>RESTANT</div>
      </div>

      {instructions.map((i) => {
        const ro = i.diagram.renderOverrides;
        const hideDistance = ro?.hideDistance === true;
        const hideRoadNames = ro?.hideRoadNames === true;

        const isSelected = selectedId === i.id;

        return (
          <div
            key={i.id}
            className="sheetRow"
            onClick={() => onSelect(i.id)}
            style={{
              cursor: "pointer",
              background: isSelected ? "#f7f7ff" : undefined,
            }}
          >
            {/* Distance cell */}
            <div className="cell kmCell">
              {hideDistance ? (
                <>
                  <div className="kmBig">&nbsp;</div>
                  <div className="kmSmall">&nbsp;</div>
                </>
              ) : (
                <>
                  <div className="kmBig">{fmtKm(i.distanceFromStart)} km</div>
                  <div className="kmSmall">+ {fmtKm(i.distanceFromPrev)} km</div>
                </>
              )}
            </div>

            {/* Index cell */}
            <div className="cell" style={{ justifyContent: "center" }}>
              <div className="indexBox">{i.index}</div>
            </div>

            {/* Diagram cell */}
            <div className="cell" style={{ justifyContent: "center" }}>
              <TulipDiagram diagram={i.diagram} />
            </div>

            {/* Info cell */}
            <div className="cell infoCell">
              <div className="infoPrimary">
                {i.maneuverType.replaceAll("_", " ")}
              </div>

              {!hideRoadNames ? (
                <div className="infoSecondary">
                  {i.roadFrom ? `${i.roadFrom} → ` : ""}
                  {i.roadTo ?? "(unknown road)"}
                </div>
              ) : (
                <div className="infoSecondary" style={{ fontStyle: "italic" }}>
                  (names hidden)
                </div>
              )}
            </div>

            {/* Remaining cell */}
            <div className="cell kmCell" style={{ alignItems: "flex-end" }}>
              {hideDistance ? (
                <>
                  <div className="kmBig">&nbsp;</div>
                  <div className="kmSmall">&nbsp;</div>
                </>
              ) : (
                <>
                  <div className="kmBig">{fmtKm(i.distanceRemaining)} km</div>
                  <div className="kmSmall">remaining</div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}