const steps = [
  {
    title: "Upload",
    desc: "Bring a CSV, Excel, or JSON file into Normalize.",
    tone: "red",
    art: UploadArt,
  },
  {
    title: "Confirm structure",
    desc: "Normalize detects column types, tokens, and formats. You adjust how the data should be understood.",
    tone: "green",
    art: SuggestionArt,
  },
  {
    title: "Output settings",
    desc: "Choose how the normalized data should be produced: format, date styles, tokens, and other rules.",
    tone: "red",
    art: ConfirmArt,
  },
  {
    title: "Download",
    desc: "Export the normalized dataset as CSV, Excel, JSON, or Parquet.",
    tone: "green",
    art: DownloadArt,
  }
];

const sources = [
  { label: "CSV", tone: "red", icon: CsvGlyph },
  { label: "Excel", tone: "green", icon: ExcelGlyph },
  { label: "JSON", tone: "red", icon: JsonGlyph }
];

const outputs = ["CSV", "Excel", "JSON", "Parquet"];

function UploadArt({ className = "w-full h-auto" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Cloud */}
      <path
        fill="#16a34a"
        d="M0 16v-1.984q0-3.328 2.336-5.664t5.664-2.336q1.024 0 2.176 0.352 0.576-2.752 2.784-4.544t5.056-1.824q3.296 0 5.632 2.368t2.368 5.632q0 0.896-0.32 2.048 0.224-0.032 0.32-0.032 2.464 0 4.224 1.76t1.76 4.224v2.016q0 2.496-1.76 4.224t-4.224 1.76h-0.384q0.288-0.8 0.352-1.44 0.096-1.312-0.32-2.56t-1.408-2.208l-4-4q-1.76-1.792-4.256-1.792t-4.224 1.76l-4 4q-0.96 0.96-1.408 2.24t-0.32 2.592q0.032 0.576 0.256 1.248-2.72-0.608-4.512-2.784t-1.792-5.056z"
      />

      {/* Arrow */}
      <path
        fill="#dc2626"
        d="M10.016 22.208q-0.096-0.96 0.576-1.6l4-4q0.608-0.608 1.408-0.608 0.832 0 1.408 0.608l4 4q0.672 0.64 0.608 1.6-0.032 0.288-0.16 0.576-0.224 0.544-0.736 0.896t-1.12 0.32h-1.984v6.016q0 0.832-0.608 1.408t-1.408 0.576-1.408-0.576-0.576-1.408v-6.016h-2.016q-0.608 0-1.088-0.32t-0.768-0.896q-0.096-0.288-0.128-0.576z"
      />
    </svg>
  );
}

function SuggestionArt({ className = "w-full h-auto" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        fill="#16a34a"
        d="M4 7.8A3.8 3.8 0 0 1 7.8 4h9.5v4.9a2 2 0 0 0 2 2H24v13.3a3.8 3.8 0 0 1-3.8 3.8H7.8A3.8 3.8 0 0 1 4 24.2z"
      />
      <path fill="#ffffff" d="M19.4 5.2 22.8 8.6h-2.2a1.2 1.2 0 0 1-1.2-1.2z" />
      <rect x="8" y="12" width="8.8" height="1.8" rx="0.9" fill="#ffffff" />
      <rect x="8" y="16" width="7.2" height="1.8" rx="0.9" fill="#ffffff" />
      <rect x="8" y="20" width="5.5" height="1.8" rx="0.9" fill="#ffffff" />
      <circle cx="25.2" cy="22.1" r="4.2" fill="#dc2626" />
      <path
        d="M23.2 22.1 24.6 23.5 27.3 20.7"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConfirmArt({ className = "w-full h-auto" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g transform="translate(-11.5,43.5) scale(0.005,-0.005)" stroke="none">
        <path
          fill="#16a34a"
          d="M3345 8100 c-87 -8 -164 -35 -229 -79 -108 -75 -195 -212 -216 -341 -13 -83 -13 -3581 0 -3728 12 -138 46 -211 144 -307 39 -39 94 -82 122 -97 112 -60 65 -58 1292 -58 l1124 0 -32 36 c-17 20 -43 60 -58 90 -14 30 -31 54 -37 54 -6 0 -33 -7 -59 -16 -76 -26 -185 -15 -266 26 -96 48 -304 258 -351 355 -31 63 -34 77 -33 155 1 51 7 102 17 127 l16 42 -60 32 c-75 40 -141 112 -171 187 -21 53 -23 72 -23 272 0 212 0 216 26 271 36 77 87 130 161 169 35 18 64 34 66 35 1 1 -5 22 -14 46 -9 25 -16 76 -16 119 0 137 55 235 220 392 149 141 272 189 398 153 32 -9 68 -18 79 -21 17 -5 25 5 47 54 34 74 97 138 167 170 100 46 439 49 566 6 60 -21 155 -111 176 -167 7 -20 17 -37 21 -37 4 0 8 173 8 384 l0 384 -432 4 c-412 4 -436 5 -499 26 -178 59 -335 233 -370 412 -7 35 -10 202 -9 451 l1 396 -124 7 c-163 8 -1549 5 -1652 -4z"
        />
        <path
          fill="#ffffff"
          d="M5400 7684 l0 -400 26 -52 c28 -56 85 -107 142 -128 53 -19 812 -20 812 -1 0 10 -848 863 -947 952 l-33 29 0 -400z"
        />
        <path
          fill="#dc2626"
          d="M5827 6002 c-75 -9 -90 -29 -112 -142 -9 -47 -20 -94 -25 -105 -8 -21 -143 -85 -179 -85 -11 0 -55 23 -97 50 -86 56 -111 65 -151 55 -33 -8 -212 -185 -237 -234 -22 -42 -12 -74 55 -176 27 -42 49 -80 49 -85 0 -5 -17 -47 -38 -93 l-39 -83 -84 -18 c-176 -38 -182 -47 -177 -263 l3 -145 31 -27 c21 -19 51 -32 95 -40 140 -27 133 -22 173 -115 20 -47 36 -88 36 -93 0 -5 -20 -38 -45 -73 -24 -35 -52 -82 -61 -105 -15 -40 -15 -45 2 -76 21 -41 179 -205 216 -225 47 -25 80 -17 172 42 98 62 95 62 200 15 74 -34 78 -39 101 -156 8 -43 22 -89 30 -102 24 -35 76 -45 232 -41 180 4 183 6 213 153 11 55 26 105 33 111 14 14 153 74 170 74 6 0 46 -23 89 -51 53 -35 91 -53 121 -56 38 -5 48 -1 92 34 54 43 164 163 185 202 18 35 7 68 -54 166 l-55 87 19 49 c38 95 47 114 61 125 8 6 52 19 99 28 159 33 163 40 158 255 -4 190 -4 191 -157 223 l-104 22 -25 56 c-57 128 -57 117 4 211 60 94 72 134 52 173 -19 37 -185 204 -221 222 -42 22 -83 11 -171 -46 -42 -28 -86 -50 -97 -50 -11 0 -54 15 -95 34 -82 38 -84 41 -104 151 -15 81 -32 120 -60 135 -25 13 -225 21 -303 12z"
        />
        <path
          fill="#ffffff"
          d="M6072 5250 c-257 -40 -421 311 -335 556 49 143 151 240 289 277 75 21 156 19 230 -4 120 -37 205 -112 261 -230 58 -121 48 -289 -24 -402 -93 -145 -258 -223 -421 -197z"
        />
      </g>
    </svg>
  );
}

function DownloadArt({ className = "w-full h-auto" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Cloud */}
      <path
        fill="#16a34a"
        d="M0 16v-1.984q0-3.328 2.336-5.664t5.664-2.336q1.024 0 2.176 0.352 0.576-2.752 2.784-4.544t5.056-1.824q3.296 0 5.632 2.368t2.368 5.632q0 0.896-0.32 2.048 0.224-0.032 0.32-0.032 2.464 0 4.224 1.76t1.76 4.224v2.016q0 2.496-1.76 4.224t-4.224 1.76h-0.384q0.288-0.8 0.352-1.44 0.096-1.312-0.32-2.56t-1.408-2.208l-4-4q-1.76-1.792-4.256-1.792t-4.224 1.76l-4 4q-0.96 0.96-1.408 2.24t-0.32 2.592q0.032 0.576 0.256 1.248-2.72-0.608-4.512-2.784t-1.792-5.056z"
      />

      {/* Arrow */}
      <path
        fill="#dc2626"
        d="M10.016 24.208q-0.096 0.96 0.576 1.6l4 4q0.608 0.608 1.408 0.608 0.832 0 1.408-0.608l4-4q0.672-0.64 0.608-1.6-0.032-0.288-0.16-0.576-0.224-0.544-0.736-0.896t-1.12-0.32h-1.984v-6.016q0-0.832-0.608-1.408t-1.408-0.576-1.408 0.576-0.576 1.408v6.016h-2.016q-0.608 0-1.088 0.32t-0.768 0.896q-0.096 0.288-0.128 0.576z"
      />
    </svg>
  );
}

function CsvGlyph({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 4.5h7l3 3v12H7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 4.5v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ExcelGlyph({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 4.5v15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 9.5h14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 14.5h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function JsonGlyph({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M10 5c-1.5 0-2 1-2 2.5V9c0 1-.4 1.7-1.5 2 .9.2 1.5 1 1.5 2v1.5c0 1.5.5 2.5 2 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 5c1.5 0 2 1 2 2.5V9c0 1 .4 1.7 1.5 2-.9.2-1.5-1-1.5 2v1.5c0 1.5-.5 2.5-2 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function NormalizeToolPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Normalize</h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">
              Turn messy tabular files into a clean, confirmed dataset.
            </p>
          </div>

          </header>

        <section className="mt-10 grid gap-x-10 gap-y-6 xl:grid-cols-4">
          {steps.map((step) => {
            const Art = step.art;
            return (
              <div key={step.title} className="min-w-0 text-center">
                <div className="mx-auto w-28">
                  <Art className="w-full h-auto" />
                </div>
                <div className="mt-4 text-lg font-semibold tracking-tight">
                  {step.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-12 grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="rounded-[28px] border-2 border-dashed border-neutral-300 bg-neutral-50 px-8 py-20 text-center">
              <div className="mx-auto w-36">
                <UploadArt className="w-full h-auto" />
              </div>

              <div className="mt-6 text-xl font-semibold">Drop a file here</div>
              <p className="mt-2 text-sm text-neutral-500">CSV · XLSX · JSON</p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700">
                  Select file
                </button>
                <button className="rounded-xl border border-green-600 px-5 py-3 text-sm font-medium text-green-700 hover:bg-green-50">
                  Example files
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Sources</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sources.map((s) => (
                    <span
                      key={s.label}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                        s.tone === "red"
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      <s.icon className="h-3.5 w-3.5" />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Output</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {outputs.map((o, i) => (
                    <span
                      key={o}
                      className={`rounded-full px-3 py-1 text-xs ${
                        i % 2 === 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Result</div>
                <p className="mt-3 text-sm text-neutral-600">
                  Confirmed schema and normalized dataset ready for analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-neutral-200 p-5">
              <div className="text-sm font-medium">What Normalize does</div>
              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <div>Suggests column structure.</div>
                <div>Lets you confirm the schema.</div>
                <div>Produces a normalized dataset.</div>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 p-5">
              <div className="text-sm font-medium">Exports</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {outputs.map((o, i) => (
                  <div
                    key={o}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      i % 2 === 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"
                    }`}
                  >
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
