import { Header } from "@/components/layout/Header";
import { HabitList } from "@/components/habits/HabitList";
import { Heatmap } from "@/components/visualizations/Heatmap";
import { StatsDashboard } from "@/components/visualizations/StatsDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
          <StatsDashboard />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Contribution</h2>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm overflow-hidden">
            <Heatmap />
          </div>
        </section>

        <section>
          <HabitList />
        </section>
      </main>
    </div>
  );
}
