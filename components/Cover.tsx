import type { Cover as CoverData } from "@/data/profile";

// Renders a code line where **word** is highlighted in the card colour.
function CodeLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>))}
    </>
  );
}

export default function GeneratedCover({ cover, tag }: { cover: Extract<CoverData, { kind: "gen" }>; tag: string }) {
  return (
    <>
      <span className="cat">{tag}</span>
      <div className="big">{cover.big}</div>
      <div className="code">
        <CodeLine text={cover.code[0]} />
        <br />
        <CodeLine text={cover.code[1]} />
      </div>
    </>
  );
}
