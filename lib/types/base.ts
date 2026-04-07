export type IsoDateTime = string;

export type ApiResponse<TData> = {
  readonly success: boolean;
  readonly timestamp: IsoDateTime;
  readonly message: string;
  readonly data: TData;
};
