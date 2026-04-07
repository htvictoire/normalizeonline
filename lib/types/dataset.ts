export type UploadUrl = {
  readonly url: string;
  readonly s3_key: string;
};

export type FileType = "CSV" | "XLSX" | "JSON";

export type Dataset = {
  readonly id: string;
  readonly owner: string;
  readonly name: string;
  readonly original_name: string;
  readonly file_type: FileType;
  readonly size_mb: number;
  readonly instance_id: string | null;
  readonly status: string | null;
  readonly tenant_id: string | null;
  readonly source_file_name: string | null;
  readonly source_file_format: string | null;
  readonly source_file_url: string | null;
  readonly source_checksum: string | null;
  readonly suggested_config: unknown | null;
  readonly confirmed_config: unknown | null;
  readonly profiling_output: unknown | null;
  readonly normalization_output: unknown | null;
};
