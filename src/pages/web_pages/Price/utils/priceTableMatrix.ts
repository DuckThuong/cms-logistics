import type { PriceTableCell } from "@/common/types/price";

export type AnchorSlot = {
  role: "anchor";
  text: string;
  colspan: number;
  rowspan: number;
};

export type CoveredSlot = {
  role: "covered";
};

export type MatrixSlot = AnchorSlot | CoveredSlot;

export type TableMatrix = {
  headers: string[];
  rows: MatrixSlot[][];
};

const anchor = (text = ""): AnchorSlot => ({
  role: "anchor",
  text,
  colspan: 1,
  rowspan: 1,
});

const emptyRow = (colCount: number): MatrixSlot[] =>
  Array.from({ length: colCount }, () => anchor());

export const createEmptyMatrix = (colCount = 2, rowCount = 1): TableMatrix => ({
  headers: Array.from({ length: colCount }, (_, i) => `Cột ${i + 1}`),
  rows: Array.from({ length: rowCount }, () => emptyRow(colCount)),
});

/** Giải mã cellRows (format API/FE) → ma trận chỉnh sửa */
export const decodePriceTable = (
  headers: string[] | null,
  cellRows: PriceTableCell[][] | null,
): TableMatrix => {
  const hdrs =
    headers && headers.length > 0 ? [...headers] : ["Cột 1", "Cột 2"];
  const colCount = hdrs.length;
  const rowCount = Math.max(cellRows?.length ?? 0, 1);

  const rows: MatrixSlot[][] = Array.from({ length: rowCount }, () => emptyRow(colCount));

  (cellRows ?? []).forEach((rowCells, rowIndex) => {
    if (!rows[rowIndex]) {
      rows[rowIndex] = emptyRow(colCount);
    }

    let col = 0;
    rowCells.forEach((cell) => {
      while (col < colCount && rows[rowIndex][col]?.role === "covered") {
        col += 1;
      }
      if (col >= colCount) {
        return;
      }

      const colspan = Math.max(1, cell.colspan ?? 1);
      const rowspan = Math.max(1, cell.rowspan ?? 1);

      rows[rowIndex][col] = {
        role: "anchor",
        text: cell.text ?? "",
        colspan,
        rowspan,
      };

      for (let dr = 0; dr < rowspan; dr += 1) {
        for (let dc = 0; dc < colspan; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          const targetRow = rowIndex + dr;
          if (!rows[targetRow]) {
            rows[targetRow] = emptyRow(colCount);
          }
          rows[targetRow][col + dc] = { role: "covered" };
        }
      }

      col += colspan;
    });
  });

  return { headers: hdrs, rows };
};

/** Mã hóa ma trận → cellRows cho API/FE */
export const encodePriceTable = (matrix: TableMatrix): PriceTableCell[][] =>
  matrix.rows.map((row, rowIndex) => {
    const cells: PriceTableCell[] = [];
    row.forEach((slot) => {
      if (slot.role !== "anchor") {
        return;
      }
      cells.push({
        text: slot.text,
        colspan: slot.colspan > 1 ? slot.colspan : null,
        rowspan: slot.rowspan > 1 ? slot.rowspan : null,
        startRow: rowIndex,
      });
    });
    return cells;
  });

export const canMergeRight = (
  rows: MatrixSlot[][],
  rowIndex: number,
  colIndex: number,
): boolean => {
  const left = rows[rowIndex]?.[colIndex];
  if (!left || left.role !== "anchor") {
    return false;
  }
  const nextCol = colIndex + left.colspan;
  const right = rows[rowIndex]?.[nextCol];
  return (
    nextCol < (rows[rowIndex]?.length ?? 0) &&
    right?.role === "anchor" &&
    right.rowspan === left.rowspan
  );
};

export const canMergeDown = (
  rows: MatrixSlot[][],
  rowIndex: number,
  colIndex: number,
): boolean => {
  const top = rows[rowIndex]?.[colIndex];
  if (!top || top.role !== "anchor") {
    return false;
  }
  const nextRow = rowIndex + top.rowspan;
  const bottom = rows[nextRow]?.[colIndex];
  return (
    nextRow < rows.length &&
    bottom?.role === "anchor" &&
    bottom.colspan === top.colspan
  );
};

export const mergeRight = (
  rows: MatrixSlot[][],
  rowIndex: number,
  colIndex: number,
): MatrixSlot[][] => {
  if (!canMergeRight(rows, rowIndex, colIndex)) {
    return rows;
  }

  const next = rows.map((row) => [...row]);
  const left = next[rowIndex][colIndex] as AnchorSlot;
  const nextCol = colIndex + left.colspan;
  const right = next[rowIndex][nextCol] as AnchorSlot;
  const addCols = right.colspan;
  const rs = left.rowspan;

  for (let dr = 0; dr < rs; dr += 1) {
    for (let dc = 0; dc < addCols; dc += 1) {
      next[rowIndex + dr][nextCol + dc] = { role: "covered" };
    }
  }

  next[rowIndex][colIndex] = {
    ...left,
    colspan: left.colspan + addCols,
  };

  return next;
};

export const mergeDown = (
  rows: MatrixSlot[][],
  rowIndex: number,
  colIndex: number,
): MatrixSlot[][] => {
  if (!canMergeDown(rows, rowIndex, colIndex)) {
    return rows;
  }

  const next = rows.map((row) => [...row]);
  const top = next[rowIndex][colIndex] as AnchorSlot;
  const nextRow = rowIndex + top.rowspan;
  const bottom = next[nextRow][colIndex] as AnchorSlot;
  const addRows = bottom.rowspan;
  const cs = top.colspan;

  for (let dr = 0; dr < addRows; dr += 1) {
    for (let dc = 0; dc < cs; dc += 1) {
      next[nextRow + dr][colIndex + dc] = { role: "covered" };
    }
  }

  next[rowIndex][colIndex] = {
    ...top,
    rowspan: top.rowspan + addRows,
  };

  return next;
};

export const splitCell = (
  rows: MatrixSlot[][],
  rowIndex: number,
  colIndex: number,
): MatrixSlot[][] => {
  const slot = rows[rowIndex]?.[colIndex];
  if (!slot || slot.role !== "anchor") {
    return rows;
  }
  if (slot.colspan === 1 && slot.rowspan === 1) {
    return rows;
  }

  const next = rows.map((row) => [...row]);
  const { colspan: cs, rowspan: rs, text } = slot;

  for (let dr = 0; dr < rs; dr += 1) {
    for (let dc = 0; dc < cs; dc += 1) {
      if (dr === 0 && dc === 0) {
        next[rowIndex][colIndex] = { role: "anchor", text, colspan: 1, rowspan: 1 };
      } else {
        next[rowIndex + dr][colIndex + dc] = anchor("");
      }
    }
  }

  return next;
};

export const addMatrixColumn = (matrix: TableMatrix): TableMatrix => ({
  headers: [...matrix.headers, `Cột ${matrix.headers.length + 1}`],
  rows: matrix.rows.map((row) => [...row, anchor()]),
});

export const removeMatrixColumnAt = (
  matrix: TableMatrix,
  colIndex: number,
): TableMatrix => {
  if (matrix.headers.length <= 1) {
    return matrix;
  }

  let rows = matrix.rows;
  for (let r = 0; r < rows.length; r += 1) {
    for (let c = 0; c < rows[r].length; c += 1) {
      const s = rows[r][c];
      if (s.role !== "anchor") continue;
      if (c <= colIndex && c + s.colspan > colIndex) {
        rows = splitCell(rows, r, c);
        break;
      }
    }
  }

  return {
    headers: matrix.headers.filter((_, i) => i !== colIndex),
    rows: rows.map((row) => row.filter((_, i) => i !== colIndex)),
  };
};

export const addMatrixRow = (matrix: TableMatrix): TableMatrix => ({
  ...matrix,
  rows: [...matrix.rows, emptyRow(matrix.headers.length)],
});

export const removeMatrixRowAt = (matrix: TableMatrix, rowIndex: number): TableMatrix => {
  if (matrix.rows.length <= 1) {
    return matrix;
  }

  let rows = matrix.rows;
  for (let c = 0; c < rows[rowIndex].length; c += 1) {
    const s = rows[rowIndex][c];
    if (s.role === "anchor" && (s.colspan > 1 || s.rowspan > 1)) {
      rows = splitCell(rows, rowIndex, c);
      break;
    }
  }

  return {
    ...matrix,
    rows: rows.filter((_, i) => i !== rowIndex),
  };
};

export const updateAnchorText = (
  matrix: TableMatrix,
  rowIndex: number,
  colIndex: number,
  text: string,
): TableMatrix => {
  const rows = matrix.rows.map((row) => [...row]);
  const slot = rows[rowIndex][colIndex];
  if (slot?.role !== "anchor") {
    return matrix;
  }
  rows[rowIndex][colIndex] = { ...slot, text };
  return { ...matrix, rows };
};

export const updateHeaderAt = (
  matrix: TableMatrix,
  colIndex: number,
  value: string,
): TableMatrix => {
  const headers = [...matrix.headers];
  headers[colIndex] = value;
  return { ...matrix, headers };
};
