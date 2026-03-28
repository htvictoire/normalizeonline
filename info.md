normalize is not just “file conversion.” It is an end-to-end normalization workflow that takes a raw source file, learns its structure, lets that structure be
  confirmed, validates it on the full dataset, and then emits a deterministic normalized output with traceability.
  The lifecycle is orchestrated in src/app/bootstrap/orchestrator.py. In practical terms, it does this:
  1. Suggest
     src/suggestion/pipeline.py
     It reads the source, infers the source format, samples rows, infers likely null tokens, and proposes a per-column config.
     That config can classify columns as:
     string, boolean, date, integer, decimal, currency, percentage, signed, or accounting
     Supported config types are defined in src/shared/models/column/__init__.py.
  2. Confirm
     src/shared/models/confirmation.py
     The suggested config becomes an explicit confirmed contract:
     source format, column config, and operation flags.
     This is the point where the system stops guessing.
  3. Profile
     src/profiling/pipeline.py
     It runs against the full dataset, not just a sample.
     It canonicalizes headers, computes exact counts, checks parse success and completeness, and emits issues.
     Profiling is the gate before conversion: if there are blocking errors, normalize does not run.
  4. Convert
     src/app/bootstrap/conversion/execution.py
     This is the actual normalization phase.
  What it normalizes:
  - Source shape
    Raw CSV/Excel/JSON is ingested into one consistent table shape before downstream work.
  - Headers
    Headers are canonicalized into stable normalized column names before profiling/conversion.
    That happens before the final typed rewrite.
  - Rows
    src/conversion/stages/row_normalization.py
    It can drop fully empty rows and add stable _row_index and _global_row_index audit columns.
  - Cells
    src/conversion/stages/cell_normalization/stage.py
    This is the core normalization work:
    empty cells, whitespace-only cells, and configured null tokens become SQL NULL
    each column is rewritten to its confirmed semantic type
    boolean tokens are normalized from configured true/false token sets
    date strings are parsed using the confirmed date format
    numeric values are normalized using the confirmed decimal separator, thousand separator, grouping style, sign markers, accounting notation, currency notation, and
    percentage handling
    parse issues are tracked instead of being silently ignored
  - Quality
    src/conversion/stages/quality_metrics/stage.py
    After normalization, it computes post-transform quality metrics:
    row count, null counts, parse-error counts, completeness ratio, parse-success ratio, and an overall quality score.
  - Artifacts
    src/conversion/stages/artifact_materialization/stage.py
    Normalize produces:
    a normalized Parquet dataset
    a trace Parquet dataset
    a manifest JSON
    plus a deterministic fingerprint tying the output to source checksum, config, rules version, and DuckDB version.
  So the achievement is:
  normalize turns messy raw tabular input into a typed, validated, reproducible analytical dataset with auditability.
  Not just:
  - “read CSV”
  - “infer schema”
  - “convert to parquet”
  But:
  - infer
  - confirm
  - full-dataset validate
  - normalize rows and cells
  - measure output quality
  - emit production artifacts with trace and replay metadatd