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

      <section className="surface-panel rounded-xj p-4">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) =>
            navigate({
              to: "/cards",
              search: tabSearch[value] ?? {},
            })
          }
        >
          <Tabs.List className="flex flex-wrap gap-2">
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
                className="focus-ring rounded-xl border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-soft)] transition data-[state=active]:border-[var(--line-strong)] data-[state=active]:bg-[var(--panel-muted)] data-[state=active]:text-[var(--text)]"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </section>

      <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {filteredCards.map((card) => (
          <CardThumb key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
