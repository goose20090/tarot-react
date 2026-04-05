import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CardThumb } from "#/components/CardThumb";
import { PageHeader } from "#/components/PageHeader";
import { getTree } from "#/lib/tarot.functions";
import { cn } from "#/utils/cn";

export const Route = createFileRoute("/tree")({
  loader: () => getTree(),
  component: TreePage,
});

const sephiraPositions: Record<number, [number, number]> = {
  1: [170, 50],
  2: [250, 140],
  3: [90, 140],
  4: [250, 230],
  5: [90, 230],
  6: [170, 310],
  7: [250, 390],
  8: [90, 390],
  9: [170, 450],
  10: [170, 510],
};

function TreePage() {
  const { sephiroth, paths } = Route.useLoaderData();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const selectedSephira = activePanel?.startsWith("sephira-")
    ? sephiroth.find(
        (node) => node.id === Number(activePanel.replace("sephira-", "")),
      )
    : null;
  const selectedPath = activePanel?.startsWith("path-")
    ? paths.find((path) => path.id === Number(activePanel.replace("path-", "")))
    : null;

  return (
    <div className="space-y-8">
      <PageHeader title="Tree of Life" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_380px]">
        <section className="surface-panel-strong rounded-[2rem] p-4 md:p-6">
          <svg
            viewBox="0 0 340 560"
            className="mx-auto w-full max-w-[720px]"
            role="img"
            aria-label="Interactive Tree of Life"
          >
            {paths.map((path) => {
              const [sx, sy] = sephiraPositions[path.startSephira!.number];
              const [ex, ey] = sephiraPositions[path.endSephira!.number];
              const isActive = activePanel === `path-${path.id}`;

              return (
                <g
                  key={path.id}
                  tabIndex={0}
                  role="button"
                  onClick={() =>
                    setActivePanel(isActive ? null : `path-${path.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActivePanel(isActive ? null : `path-${path.id}`);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke="transparent"
                    strokeWidth="18"
                  />
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={
                      isActive
                        ? "var(--accent-strong)"
                        : "rgba(242,234,220,0.34)"
                    }
                    strokeWidth={isActive ? "3" : "2"}
                  />
                </g>
              );
            })}

            {sephiroth.map((node) => {
              const [x, y] = sephiraPositions[node.number];
              const isActive = activePanel === `sephira-${node.id}`;

              return (
                <g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  onClick={() =>
                    setActivePanel(isActive ? null : `sephira-${node.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActivePanel(isActive ? null : `sephira-${node.id}`);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="27"
                    fill={
                      isActive
                        ? "rgba(212,169,90,0.22)"
                        : "rgba(242,234,220,0.06)"
                    }
                    stroke={
                      isActive
                        ? "var(--accent-strong)"
                        : "rgba(242,234,220,0.34)"
                    }
                  />
                  <text
                    x={x}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="14"
                    fill="var(--text)"
                  >
                    {node.number}
                  </text>
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--text-soft)"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        <aside className="surface-panel-strong rounded-[2rem] p-5 md:p-6">
          {!selectedSephira && !selectedPath ? (
            <div className="flex h-full min-h-[360px] items-center justify-center text-center">
              <div>
                <p className="kicker m-0">Select a Node or Path</p>
                <h2 className="display-font m-0 pt-2 text-4xl text-[var(--text)]">
                  Explore the correspondences
                </h2>
              </div>
            </div>
          ) : null}

          {selectedSephira ? (
            <div className="space-y-4">
              <div>
                <p className="kicker m-0">Sephira {selectedSephira.number}</p>
                <h2 className="display-font m-0 pt-2 text-4xl text-[var(--text)]">
                  {selectedSephira.name}
                </h2>
                <p className="m-0 pt-2 text-sm text-[var(--text-soft)]">
                  {selectedSephira.meaning}
                </p>
              </div>

              <div
                className={cn(
                  selectedSephira.cards.length
                    ? "grid gap-4"
                    : "text-sm text-[var(--text-soft)]",
                )}
              >
                {selectedSephira.cards.length > 0 ? (
                  selectedSephira.cards.map((card) => (
                    <CardThumb key={card.id} card={card} />
                  ))
                ) : (
                  <p>No cards assigned.</p>
                )}
              </div>
            </div>
          ) : null}

          {selectedPath ? (
            <div className="space-y-4">
              <div>
                <p className="kicker m-0">Path {selectedPath.number}</p>
                <h2 className="display-font m-0 pt-2 text-4xl text-[var(--text)]">
                  {selectedPath.startSephira?.name} →{" "}
                  {selectedPath.endSephira?.name}
                </h2>
                {selectedPath.hebrewLetter ? (
                  <p className="m-0 pt-2 text-sm text-[var(--text-soft)]">
                    {selectedPath.hebrewLetter.letter}{" "}
                    {selectedPath.hebrewLetter.name} ·{" "}
                    {selectedPath.hebrewLetter.meaning}
                  </p>
                ) : null}
              </div>

              {selectedPath.card ? (
                <CardThumb card={selectedPath.card} />
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
