import type { Diagram } from "../models/instructions";

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function normalizeDeg(deg: number) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export default function TulipDiagram({
  diagram,
  size = 54,
}: {
  diagram: Diagram;
  size?: number;
}) {
  const half = size / 2;
  const cx = half;
  const cy = half;

  const armLen = size * 0.38;

  // Rotate so incoming is vertical (arrive from bottom to center)
  const sceneRotationDeg = -diagram.incomingBearingDeg;

  const forcedOutgoingId = diagram.renderOverrides?.forceOutgoingArmId;
  const forcedIncomingId = diagram.renderOverrides?.forceIncomingArmId;
  const hideArmIds = new Set(diagram.renderOverrides?.hideArmIds ?? []);

  const incomingArmId =
    forcedIncomingId ?? diagram.arms.find((a) => a.isIncoming)?.id ?? null;

  const outgoingArmId =
    forcedOutgoingId ?? diagram.arms.find((a) => a.isRouteOutgoing)?.id ?? null;

  const manualRot = diagram.renderOverrides?.rotationOverrideDeg ?? 0;

  function armWorldToRelativeDeg(worldBearingDeg: number) {
    return normalizeDeg(worldBearingDeg + sceneRotationDeg + manualRot);
  }

  // 0° = up, 90° = right, 180° = down, 270° = left
  function pointForAngleDeg(angleDeg: number, len: number) {
    const a = degToRad(angleDeg);
    return {
      x: cx + Math.sin(a) * len,
      y: cy - Math.cos(a) * len,
    };
  }

  // Incoming dot position (driver)
  const incomingArm = incomingArmId
    ? diagram.arms.find((a) => a.id === incomingArmId) ?? null
    : null;

  const incomingRelDeg = incomingArm
    ? armWorldToRelativeDeg(incomingArm.bearingDeg)
    : null;

  const dotPos =
    incomingRelDeg !== null
      ? pointForAngleDeg(incomingRelDeg, armLen * 0.92)
      : null;

  // Arrow tuning (based on your image #3)
  const arrowLineGap = 4; // shorten the outgoing arm by this many px
  const arrowFloat = 6; // arrow head is drawn further out from the line end
  const arrowStrokeWidth = 2; // smaller than main outgoing stroke

  // Arrow marker unique id
  const markerId = `arrow-${Math.round(Math.random() * 1_000_000)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <defs>
        {/* Smaller arrow head */}
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5.2"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#000" />
        </marker>
      </defs>

      <rect x="0" y="0" width={size} height={size} fill="white" />

      {diagram.arms
        .filter((a) => !hideArmIds.has(a.id))
        .map((arm) => {
          const rel = armWorldToRelativeDeg(arm.bearingDeg);

          const isIncoming = incomingArmId === arm.id;
          const isOutgoing = outgoingArmId === arm.id;

          const opacity = arm.isExcludedByFilter ? 0.25 : 1;

          // Base styling
          const stroke = isOutgoing ? "#000" : "#888";
          const strokeWidth = isOutgoing ? 3 : isIncoming ? 2.5 : 2;

          // For outgoing: draw the main line slightly shorter (so arrow can "float")
          const endMain = pointForAngleDeg(
            rel,
            isOutgoing ? Math.max(0, armLen - arrowLineGap) : armLen,
          );

          // Separate arrow segment: starts a bit after main line and ends a bit further out
          const arrowStart = isOutgoing
            ? pointForAngleDeg(rel, Math.max(0, armLen - arrowLineGap + 1))
            : null;
          const arrowEnd = isOutgoing
            ? pointForAngleDeg(rel, armLen + arrowFloat)
            : null;

          return (
            <g key={arm.id} opacity={opacity}>
              <line
                x1={cx}
                y1={cy}
                x2={endMain.x}
                y2={endMain.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {isOutgoing && arrowStart && arrowEnd && (
                <line
                  x1={arrowStart.x}
                  y1={arrowStart.y}
                  x2={arrowEnd.x}
                  y2={arrowEnd.y}
                  stroke="#000"
                  strokeWidth={arrowStrokeWidth}
                  strokeLinecap="round"
                  markerEnd={`url(#${markerId})`}
                />
              )}
            </g>
          );
        })}

      {/* Driver dot on incoming arm */}
      {dotPos && <circle cx={dotPos.x} cy={dotPos.y} r={4.2} fill="#000" />}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2.2} fill="#000" />
    </svg>
  );
}