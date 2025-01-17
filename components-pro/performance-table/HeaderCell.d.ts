import * as React from 'react';
import { CellProps } from './Cell.d';

export interface HeaderCellProps extends CellProps {
  index?: number;
  minWidth?: number;
  sortColumn?: string;
  sortType?: 'desc' | 'asc';
  sortable?: boolean;
  style?: React.CSSProperties;
  resizable?: boolean;
  onColumnResizeStart?: (columnWidth?: number, left?: number, fixed?: boolean) => void;
  onColumnResizeEnd?: (
    columnWidth?: number,
    cursorDelta?: number,
    dataKey?: any,
    index?: number
  ) => void;
  onResize?: (columnWidth?: number, dataKey?: string) => void;
  onColumnResizeMove?: (columnWidth?: number, columnLeft?: number, columnFixed?: boolean) => void;
  onSortColumn?: (dataKey?: string) => void;
  flexGrow?: number;
  fixed?: boolean | 'left' | 'right';
  dataIndex?: string;
}

declare const HeaderCell: React.ComponentType<HeaderCellProps>;

export default HeaderCell;
