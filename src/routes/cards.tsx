import * as Tabs from "@radix-ui/react-tabs";
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { CardThumb } from "#/components/CardThumb";
import { PageHeader } from "#/components/PageHeader";
import { getCards } from "#/lib/tarot.functions";

type CardsSearch = {
  arcana?: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "disks";
};

export const Route = createFileRoute("/cards")({
  validateSearch: (search: Record<string, unknown>): CardsSearch => ({
    arcana:
      search.arcana === "major" || search.arcana === "minor"
        ? search.arcana
        : undefined,
    suit:
      search.suit === "wands" ||
      search.suit === "cups" ||
      search.suit === "swords" ||
      search.suit === "disks"
        ? search.suit
        : undefined,
  }),
  loader: () => getCards({ data: {} }),
  component: CardsRouteComponent,
});

const tabSearch: Record<string, CardsSearch> = {
  all: {},
  major: { arcana: "major" },
  wands: { arcana: "minor", suit: "wands" },
  cups: { arcana: "minor", suit: "cups" },
  swords: { arcana: "minor", suit: "swords" },
  disks: { arcana: "minor", suit: "disks" },
};

function CardsRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === "/cards",
  });

  if (!isIndex) {
    return <Outlet />;
  }

  return <CardsPage />;
}

function CardsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const data = Route.useLoaderData();

  const activeTab =
    search.suit ?? (search.arcana === "major" ? "major" : "all");
  const filteredCards = data.cards.filter((card) => {
    if (search.arcana && card.arcana !== search.arcana) {
      return false;
    }

    if (search.suit && card.suit !== search.suit) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Cards" />

      <section className="surface-panel rounded-2xl p-4">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) =>
            navigate({
              to: "/cards",
              search: tabSearch[value] ?? {},
            })
          }
        >
          <Tabs.List className="flex flex-wrap gap-1">
            {[
              ["all", "All"],
              ["major", "✨ Atu"],
              ["wands", "🔥 Wands"],
              ["cups", "🌊 Cups"],
              ["swords", "⚔️ Swords"],
              ["disks", "🪙 Disks"],
            ].map(([value, label]) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="focus-ring rounded-md border border-transparent px-3 py-1.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-soft)] data-[state=active]:border-[var(--line)] data-[state=active]:bg-[var(--panel-strong)] data-[state=active]:text-[var(--accent)]"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </section>

      <div className="grid gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {filteredCards.map((card) => (
          <CardThumb key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
