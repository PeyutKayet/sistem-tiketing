/**
 * Composable logger performa (dinonaktifkan untuk mode production agar console bersih)
 */
export const usePerfLogger = (_pageName?: string) => {
  return {
    mark: (_milestoneName?: string, _extra?: any) => {},
    finish: (_extraDetails?: Record<string, any>) => {}
  }
}
