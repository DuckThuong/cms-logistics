import type { ColumnsType } from "antd/es/table";
import type { PriceTableCell } from "@/common/types/price";

type SpanMeta = { rowSpan?: number; colSpan?: number };

export type AntdTableRecord = {
  key: number;
  [key: `col${number}`]: string | SpanMeta | number;
};

export const buildPriceAntdTable = (
  headers: string[],
  cellRows: PriceTableCell[][],
): { columns: ColumnsType<AntdTableRecord>; dataSource: AntdTableRecord[] } => {
  const colCount = headers.length;
  const grid: Array<Array<PriceTableCell | "occupied" | null>> = [];

  cellRows.forEach((rowCells, rowIndex) => {
    if (!grid[rowIndex]) {
      grid[rowIndex] = Array(colCount).fill(null);
    }

    let col = 0;
    rowCells.forEach((cell) => {
      while (col < colCount && grid[rowIndex][col] === "occupied") {
        col += 1;
      }

      const rowspan = cell.rowspan ?? 1;
      const colspan = cell.colspan ?? 1;
      grid[rowIndex][col] = cell;

      for (let r = 0; r < rowspan; r += 1) {
        for (let c = 0; c < colspan; c += 1) {
          if (r === 0 && c === 0) continue;
          const targetRow = rowIndex + r;
          const targetCol = col + c;
          if (!grid[targetRow]) {
            grid[targetRow] = Array(colCount).fill(null);
          }
          grid[targetRow][targetCol] = "occupied";
        }
      }

      col += colspan;
    });
  });

  const dataSource: AntdTableRecord[] = grid.map((row, rowIndex) => {
    const record: AntdTableRecord = { key: rowIndex };

    row.forEach((cell, colIndex) => {
      if (cell === "occupied") {
        record[`col${colIndex}`] = "";
        record[`span${colIndex}`] = { rowSpan: 0 };
      } else if (cell === null) {
        record[`col${colIndex}`] = "";
        record[`span${colIndex}`] = { rowSpan: 1 };
      } else {
        record[`col${colIndex}`] = cell.text;
        record[`span${colIndex}`] = {
          rowSpan: cell.rowspan ?? 1,
          colSpan: cell.colspan ?? 1,
        };
      }
    });

    return record;
  });

  const columns: ColumnsType<AntdTableRecord> = headers.map((header, colIndex) => ({
    title: header.split("\n").map((line, i, arr) => (
      <span key={`${line}-${i}`}>
        {line}
        {i < arr.length - 1 ? <br /> : null}
      </span>
    )),
    dataIndex: `col${colIndex}`,
    key: `col${colIndex}`,
    align: "center" as const,
    onCell: (record) => (record[`span${colIndex}`] as SpanMeta) ?? { rowSpan: 1 },
    render: (value: string) => (
      <span style={{ whiteSpace: "pre-line" }}>{value}</span>
    ),
  }));

  return { columns, dataSource };
};
