import { createFileRoute } from "@tanstack/react-router";
import { PlotApp } from "@/components/plot-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PlotApp />;
}
