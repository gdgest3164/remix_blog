// import { ClientOnly } from "remix-utils/client-only";
// import { BarGraph } from "~/components/Comment/bar-graph.client";
import { BarGraph } from "~/components/Comment/bar-graph";

export default function Graph() {
  return (
    <div style={{ border: "3px solid red" }}>
      <h1>그래프</h1>
      {/* <ClientOnly fallback={<></>}>{() => <BarGraph />}</ClientOnly> */}
      <BarGraph />
    </div>
  );
}
