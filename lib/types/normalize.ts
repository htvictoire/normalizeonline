export type StageKey = "confirmed" | "profiling" | "normalizing" | "complete";

export type StageColor = {
  done: string;
  activeBorder: string;
  activeBg: string;
  activePulse: string;
};

export type GroupingStyle = "western" | "indian";
export type HeaderMode = "present" | "absent";
export type TraceMode = "full" | "sparse";
export type FileFormat = "csv" | "excel" | "json";

export type StageTimings = {
  readonly suggest_started_at: string | null;
  readonly suggest_ended_at: string | null;
  readonly profile_started_at: string | null;
  readonly profile_ended_at: string | null;
  readonly convert_started_at: string | null;
  readonly convert_ended_at: string | null;
  readonly estimated_pipeline_seconds: number | null;
};

export type InstanceStatus =
  | "PENDING"
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PROFILING"
  | "PROFILED"
  | "NORMALIZING"
  | "READY"
  | "READY_WITH_WARNINGS"
  | "BLOCKED"
  | "FAILED";

export type StringColumnConfig = {
  type: "string";
};

export type BooleanColumnConfig = {
  type: "boolean";
  true_tokens: string[];
  false_tokens: string[];
};

export type IntegerColumnConfig = {
  type: "integer";
  thousand_separator: string;
  grouping_style: GroupingStyle;
};

export type DecimalColumnConfig = {
  type: "decimal";
  thousand_separator: string;
  grouping_style: GroupingStyle;
  decimal_separator: string;
  allow_leading_decimal_point: boolean;
};

export type CurrencyColumnConfig = {
  type: "currency";
  thousand_separator: string;
  grouping_style: GroupingStyle;
  decimal_separator: string;
  allow_leading_decimal_point: boolean;
};

export type PercentageColumnConfig = {
  type: "percentage";
  thousand_separator: string;
  grouping_style: GroupingStyle;
  decimal_separator: string;
  allow_leading_decimal_point: boolean;
};

export type SignedColumnConfig = {
  type: "signed";
  thousand_separator: string;
  grouping_style: GroupingStyle;
  decimal_separator: string;
  allow_leading_decimal_point: boolean;
  positive_markers: string[];
  negative_markers: string[];
  parentheses_as_negative: boolean;
};

export type AccountingColumnConfig = {
  type: "accounting";
  thousand_separator: string;
  grouping_style: GroupingStyle;
  decimal_separator: string;
  allow_leading_decimal_point: boolean;
  positive_markers: string[];
  negative_markers: string[];
  parentheses_as_negative: boolean;
};

export type DateColumnConfig = {
  type: "date";
  date_format: string;
};

export type ColumnConfig =
  | StringColumnConfig
  | BooleanColumnConfig
  | IntegerColumnConfig
  | DecimalColumnConfig
  | CurrencyColumnConfig
  | PercentageColumnConfig
  | SignedColumnConfig
  | AccountingColumnConfig
  | DateColumnConfig;

export type CsvSourceFormat = {
  format_type: "csv";
  encoding: string;
  delimiter: string;
  header_mode: HeaderMode;
  header_row_index: number | null;
};

export type ExcelSourceFormat = {
  format_type: "excel";
  sheet_name: string | null;
  header_mode: HeaderMode;
  header_row_index: number | null;
};

export type JsonSourceFormat = {
  format_type: "json";
};

export type SourceFormat = CsvSourceFormat | ExcelSourceFormat | JsonSourceFormat;

export type DecisionThresholds = {
  ready: number;
  warning: number;
};

export type OperationConfig = {
  null_tokens: string[];
  assign_indices: boolean;
  drop_empty_rows: boolean;
  emit_raw_row: boolean;
  full_raw_row: boolean;
  emit_parse_issues: boolean;
  include_unique_ratio: boolean;
  include_per_column_parse_error_counts: boolean;
  approximate_unique: boolean;
  trace_mode: TraceMode;
  decision_thresholds: DecisionThresholds;
};

export type InstanceConfig = {
  column_config: Record<string, ColumnConfig>;
  source_format: SourceFormat;
  operation_config: OperationConfig;
};

export type ColumnCounts = {
  null_count: number;
  nullish_count: number;
  non_null_count: number;
  non_nullish_count: number;
};

// ─── Profiling profiles ───────────────────────────────────────────────────────

export type StringColumnProfile = {
  readonly profile_type: "string";
  readonly distinct_count: number;
  readonly distinct_ratio: number;
  readonly min_length: number;
  readonly max_length: number;
};

export type BooleanColumnProfile = {
  readonly profile_type: "boolean";
  readonly true_token_count: number;
  readonly false_token_count: number;
  readonly unrecognized_count: number;
  readonly recognized_ratio: number;
};

export type IntegerColumnProfile = {
  readonly profile_type: "integer";
  readonly parse_match_count: number;
  readonly parse_match_ratio: number;
};

export type DateColumnProfile = {
  readonly profile_type: "date";
  readonly format_match_count: number;
  readonly format_match_ratio: number;
};

export type DecimalColumnProfile = {
  readonly profile_type: "decimal";
  readonly parse_match_count: number;
  readonly parse_match_ratio: number;
  readonly swapped_match_count: number;
  readonly swapped_match_ratio: number;
  readonly separator_mismatch_detected: boolean;
};

export type PercentageColumnProfile = {
  readonly profile_type: "percentage";
  readonly parse_match_count: number;
  readonly parse_match_ratio: number;
  readonly swapped_match_count: number;
  readonly swapped_match_ratio: number;
  readonly separator_mismatch_detected: boolean;
};

export type SignedColumnProfile = {
  readonly profile_type: "signed";
  readonly parse_match_count: number;
  readonly parse_match_ratio: number;
  readonly swapped_match_count: number;
  readonly swapped_match_ratio: number;
  readonly separator_mismatch_detected: boolean;
};

export type CurrencyColumnProfile = {
  readonly profile_type: "currency";
  readonly symbol_distribution: Record<string, number>;
  readonly symbol_detected_count: number;
  readonly symbol_detected_ratio: number;
  readonly missing_symbol_count: number;
  readonly missing_symbol_ratio: number;
  readonly dominant_symbol: string | null;
  readonly dominant_symbol_ratio: number;
  readonly has_mixed_symbols: boolean;
  readonly parse_match_count: number;
  readonly parse_match_ratio: number;
  readonly swapped_match_count: number;
  readonly swapped_match_ratio: number;
  readonly separator_mismatch_detected: boolean;
  readonly symbol_position_distribution: Record<string, number>;
  readonly dominant_symbol_position: string | null;
  readonly dominant_symbol_position_ratio: number;
  readonly has_mixed_symbol_positions: boolean;
  readonly currency_token_form_distribution: Record<string, number>;
  readonly dominant_currency_token_form: string | null;
  readonly dominant_currency_token_form_ratio: number;
  readonly has_mixed_currency_token_forms: boolean;
};

export type AccountingColumnProfile = {
  readonly profile_type: "accounting";
  readonly sign_notation_distribution: Record<string, number>;
  readonly dominant_sign_notation: string | null;
  readonly dominant_sign_notation_ratio: number;
  readonly has_mixed_sign_notations: boolean;
  readonly negative_marker_distribution: Record<string, number>;
  readonly positive_marker_distribution: Record<string, number>;
  readonly parentheses_negative_count: number;
  readonly leading_sign_count: number;
  readonly trailing_sign_count: number;
  readonly explicit_sign_count: number;
  readonly unsigned_non_nullish_count: number;
  readonly symbol_distribution: Record<string, number>;
  readonly symbol_detected_count: number;
  readonly symbol_detected_ratio: number;
  readonly missing_symbol_count: number;
  readonly missing_symbol_ratio: number;
  readonly dominant_symbol: string | null;
  readonly dominant_symbol_ratio: number;
  readonly has_mixed_symbols: boolean;
  readonly parse_match_count: number;
  readonly parse_match_ratio: number;
  readonly swapped_match_count: number;
  readonly swapped_match_ratio: number;
  readonly separator_mismatch_detected: boolean;
};

export type ColumnProfile =
  | StringColumnProfile
  | BooleanColumnProfile
  | IntegerColumnProfile
  | DateColumnProfile
  | DecimalColumnProfile
  | PercentageColumnProfile
  | SignedColumnProfile
  | CurrencyColumnProfile
  | AccountingColumnProfile;

export type ColumnType =
  | "string" | "boolean" | "integer" | "decimal"
  | "currency" | "percentage" | "signed" | "accounting" | "date";

export type ColumnProfileStats = {
  readonly label: string;
  readonly column_type: ColumnType;
  readonly counts: ColumnCounts;
  readonly null_ratio: number;
  readonly nullish_ratio: number;
  readonly type_profile: ColumnProfile;
};

export type IssueSeverity = "ERROR" | "WARNING" | "INFO";

export type NormalizationIssue = {
  readonly code: string;
  readonly severity: IssueSeverity;
  readonly message: string;
  readonly location: string | null;
  readonly evidence: Record<string, unknown> | null;
  readonly pattern_context: Record<string, unknown> | null;
};

export type ProfilingOutput = {
  readonly source_checksum: string;
  readonly row_count: number;
  readonly empty_row_count: number;
  readonly column_count: number;
  readonly pattern_consistency_ratio: number;
  readonly completeness_ratio: number;
  readonly column_stats: Record<string, ColumnProfileStats>;
  readonly issues: NormalizationIssue[];
};

export type QualityOutput = {
  readonly row_count: number;
  readonly total_cells: number;
  readonly total_nullish_cells: number;
  readonly total_parse_error_cells: number;
  readonly parse_success_ratio: number;
  readonly completeness_ratio: number;
  readonly quality_score: string;
  readonly column_null_counts: Record<string, number>;
};

export type ArtifactPaths = {
  readonly normalized_parquet: string;
  readonly manifest_json: string;
  readonly trace_parquet: string;
};

export type NormalizationOutput = {
  readonly quality_output: QualityOutput;
  readonly artifacts: ArtifactPaths;
};

export type SuggestedColumnDisplay = {
  label: string;
  counts: ColumnCounts;
  sample_values: string[];
};

export type SuggestionDisplay = {
  row_count: number;
  columns: Record<string, SuggestedColumnDisplay>;
  sample_rows: string[][];
};
