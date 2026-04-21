type Props = { sampleRows: string[][] };

export default function SampleTable({ sampleRows }: Props) {
  if (sampleRows.length < 2) return null;

  const [headers, ...rows] = sampleRows;

  return (
    <div>
      <div
        className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400"
      >
        <table className="w-full min-w-max text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface">
              {headers.map((h, i) => (
                <th
                  key={`${h}-${i}`}
                  className="whitespace-nowrap px-4 py-2.5 font-semibold text-ink"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row[0] ?? ri} className="border-b border-border last:border-0 hover:bg-surface/60">
                {row.map((cell, ci) => (
                  <td
                    key={`${ri}-${ci}`}
                    className="whitespace-nowrap px-4 py-2 font-mono text-ink-muted"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
