/**
 * DataTable – reusable sortable data table.
 *
 * columns: [{ key, label, render?, sortable? }]
 * rows: array of objects
 */
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { SI } from '../../utils/constants'

const DataTable = ({ columns, rows, emptyMessage }) => {
  const [sort, setSort] = useState({ key: null, dir: 'asc' })

  const handleSort = (key) => {
    setSort(prev =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )
  }

  const sorted = sort.key
    ? [...rows].sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key]
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'si')
        return sort.dir === 'asc' ? cmp : -cmp
      })
    : rows

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`table-header ${col.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-gray-300">
                        {sort.key === col.key
                          ? sort.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                          : <ChevronDown size={13} className="opacity-30" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-400 text-sm">
                  {emptyMessage || SI.noData}
                </td>
              </tr>
            ) : (
              sorted.map((row, rowIdx) => (
                <tr key={row._id || rowIdx} className="hover:bg-gray-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="table-cell">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
