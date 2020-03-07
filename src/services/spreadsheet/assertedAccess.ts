import { NoColumnError, EmptySheetError } from "./errors";

export function assertIndex(columns: string[], column: string) {
  const i = columns.indexOf(column);
  if (i < 0) {
    throw new NoColumnError(`No column "${column}" in this sheet`);
  }
  return i;
}

export function assertColumns(values: string[][]): string[] {
  const columns = values.shift();
  if (!columns) {
    throw new EmptySheetError("No columns in this sheet");
  }
  return columns;
}
