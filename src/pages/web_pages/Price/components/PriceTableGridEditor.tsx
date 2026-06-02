import {
  ColumnWidthOutlined,
  DeleteOutlined,
  PlusOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import { Button, Input, Tag, Tooltip } from "antd";
import { useMemo } from "react";
import type { PriceTableCell } from "@/common/types/price";
import {
  addMatrixColumn,
  addMatrixRow,
  canMergeDown,
  canMergeRight,
  decodePriceTable,
  encodePriceTable,
  mergeDown,
  mergeRight,
  removeMatrixColumnAt,
  removeMatrixRowAt,
  splitCell,
  updateAnchorText,
  updateHeaderAt,
  type AnchorSlot,
  type TableMatrix,
} from "../utils/priceTableMatrix";

type PriceTableGridEditorProps = {
  headers: string[] | null;
  cellRows: PriceTableCell[][] | null;
  onChange: (headers: string[], cellRows: PriceTableCell[][]) => void;
};

export const PriceTableGridEditor = ({
  headers,
  cellRows,
  onChange,
}: PriceTableGridEditorProps) => {
  const matrix = useMemo(
    () => decodePriceTable(headers, cellRows),
    [headers, cellRows],
  );

  const emit = (next: TableMatrix) => {
    onChange(next.headers, encodePriceTable(next));
  };

  const { headers: cols, rows } = matrix;

  return (
    <div className="price-table-editor">
      <div className="price-table-editor__toolbar">
        <Tooltip title="Thêm cột">
          <Button
            type="dashed"
            size="small"
            icon={<ColumnWidthOutlined />}
            onClick={() => emit(addMatrixColumn(matrix))}
          >
            Thêm cột
          </Button>
        </Tooltip>
        <span className="price-table-editor__hint">
          {cols.length} cột × {rows.length} dòng · Chọn ô rồi bấm <strong>Gộp →</strong> để hợp
          nhất cột kề nhau (colspan)
        </span>
      </div>

      <div className="price-table-editor__scroll">
        <table className="price-table-editor__table">
          <thead>
            <tr>
              {cols.map((header, colIndex) => (
                <th key={colIndex}>
                  <div className="price-table-editor__header-cell">
                    <Input
                      size="small"
                      value={header}
                      placeholder={`Cột ${colIndex + 1}`}
                      onChange={(e) =>
                        emit(updateHeaderAt(matrix, colIndex, e.target.value))
                      }
                    />
                    <Tooltip title="Xóa cột">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={cols.length <= 1}
                        aria-label="Xóa cột"
                        onClick={() => emit(removeMatrixColumnAt(matrix, colIndex))}
                      />
                    </Tooltip>
                  </div>
                </th>
              ))}
              <th className="price-table-editor__row-actions-col" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((slot, colIndex) => {
                  if (slot.role === "covered") {
                    return null;
                  }

                  const anchorSlot = slot as AnchorSlot;
                  const showSpan =
                    anchorSlot.colspan > 1 || anchorSlot.rowspan > 1;

                  return (
                    <td
                      key={colIndex}
                      colSpan={anchorSlot.colspan}
                      rowSpan={anchorSlot.rowspan}
                    >
                      <div className="price-table-editor__body-cell">
                        {showSpan ? (
                          <Tag className="price-table-editor__span-tag" color="orange">
                            {anchorSlot.colspan} cột × {anchorSlot.rowspan} dòng
                          </Tag>
                        ) : null}
                        <Input
                          size="small"
                          value={anchorSlot.text}
                          placeholder="Nội dung ô"
                          onChange={(e) =>
                            emit(
                              updateAnchorText(
                                matrix,
                                rowIndex,
                                colIndex,
                                e.target.value,
                              ),
                            )
                          }
                        />
                        <div className="price-table-editor__cell-actions">
                          <Tooltip title="Gộp với ô bên phải (colspan)">
                            <Button
                              size="small"
                              type="link"
                              disabled={!canMergeRight(rows, rowIndex, colIndex)}
                              onClick={() =>
                                emit({
                                  ...matrix,
                                  rows: mergeRight(rows, rowIndex, colIndex),
                                })
                              }
                            >
                              Gộp →
                            </Button>
                          </Tooltip>
                          <Tooltip title="Gộp với ô bên dưới (rowspan)">
                            <Button
                              size="small"
                              type="link"
                              disabled={!canMergeDown(rows, rowIndex, colIndex)}
                              onClick={() =>
                                emit({
                                  ...matrix,
                                  rows: mergeDown(rows, rowIndex, colIndex),
                                })
                              }
                            >
                              Gộp ↓
                            </Button>
                          </Tooltip>
                          {showSpan ? (
                            <Tooltip title="Tách ô về 1×1">
                              <Button
                                size="small"
                                type="link"
                                icon={<SplitCellsOutlined />}
                                onClick={() =>
                                  emit({
                                    ...matrix,
                                    rows: splitCell(rows, rowIndex, colIndex),
                                  })
                                }
                              >
                                Tách
                              </Button>
                            </Tooltip>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="price-table-editor__row-actions-col">
                  <Tooltip title="Xóa dòng">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={rows.length <= 1}
                      aria-label="Xóa dòng"
                      onClick={() => emit(removeMatrixRowAt(matrix, rowIndex))}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        className="price-table-editor__add-row"
        onClick={() => emit(addMatrixRow(matrix))}
      >
        Thêm dòng
      </Button>
    </div>
  );
};
