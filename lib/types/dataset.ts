import type { InstanceConfig, InstanceStatus, SuggestionDisplay, StageTimings, ProfilingOutput, NormalizationOutput, FileFormat } from "./normalize";

export type UploadUrl = {
  readonly url: string;
  readonly s3_key: string;
};

export type Dataset = {
  readonly id: string;
  readonly owner: string;
  readonly name: string;
  readonly original_name: string;
  readonly file_type: FileFormat;
  readonly size_mb: number;
  readonly instance_id: string | null;
  readonly status: InstanceStatus | null;
  readonly tenant_id: string | null;
  readonly source_file_name: string | null;
  readonly source_file_format: string | null;
  readonly source_type: string | null;
  readonly source_file: string | null;
  readonly source_checksum: string | null;
  readonly suggested_config: InstanceConfig | null;
  readonly suggestion_display: SuggestionDisplay | null;
  readonly confirmed_config: InstanceConfig | null;
  readonly profiling_output: ProfilingOutput | null;
  readonly normalization_output: NormalizationOutput | null;
  readonly timings: StageTimings | null;
};
