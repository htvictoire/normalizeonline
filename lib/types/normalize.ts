export type GroupingStyle = "western" | "indian";
export type HeaderMode = "present" | "absent";
export type TraceMode = "full" | "sparse";
export type FileFormat = "csv" | "excel" | "json";

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
