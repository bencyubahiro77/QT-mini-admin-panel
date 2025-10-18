import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CompactUserFiltersProps,Role, Status } from '@/types';


export function CompactUserFilters({
  queryParams,
  onQueryChange,
}: CompactUserFiltersProps) {
  const [searchValue, setSearchValue] = useState(queryParams.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== queryParams.search) {
        onQueryChange({ search: searchValue, page: 1 });
      }
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setSearchValue(queryParams.search || '');
  }, [queryParams.search]);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative w-48">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <Select
        value={queryParams.filterRole || 'ALL'}
        onValueChange={(value) =>
          onQueryChange({ filterRole: value as Role | 'ALL', page: 1 })
        }
      >
        <SelectTrigger className="w-32 h-9">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="USER">User</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={queryParams.filterStatus || 'ALL'}
        onValueChange={(value) =>
          onQueryChange({ filterStatus: value as Status | 'ALL', page: 1 })
        }
      >
        <SelectTrigger className="w-32 h-9">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={String(queryParams.limit || 10)}
        onValueChange={(value) => 
          onQueryChange({ limit: Number(value), page: 1 })
        }
      >
        <SelectTrigger className="w-24 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
