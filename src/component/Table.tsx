import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void; // 👈 ADD THIS
};

const Table = <T,>({ columns, data, onRowClick }: Props<T>) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl max-w-full">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="text-left px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)} // 👈 CLICK HANDLER
              className="border-t border-gray-300 hover:bg-[#f2f0fa] transition cursor-pointer"
            >
              {columns.map((col, j) => (
                <td key={j} className="px-4 py-3 min-w-40">
                  {col.render
                    ? col.render(row)
                    : (row as any)[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;