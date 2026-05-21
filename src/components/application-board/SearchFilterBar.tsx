import { Search } from 'lucide-react';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  total: number;
  filteredCount: number;
}

export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  total,
  filteredCount,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[var(--border)] shadow-sm">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by company or role name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-[var(--accent)] bg-slate-50/50"
        />
      </div>

      <div className="flex gap-2 items-center">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="p-2.5 pr-7 border border-black/10 rounded-xl bg-slate-50/50 text-xs text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 6px center',
            backgroundSize: '14px',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer Received</option>
          <option value="rejected">Rejected</option>
        </select>

        <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap bg-[var(--bg-page)] px-3 py-2.5 rounded-xl flex items-center">
          {filteredCount} of {total} roles
        </span>
      </div>
    </div>
  );
}
