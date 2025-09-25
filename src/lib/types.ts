export type ActionReturnState<TSuccessData = undefined> =
  | { success: true; message: string; data?: TSuccessData }
  | { success: false; message: string; errors?: Record<string, string[] | undefined> };