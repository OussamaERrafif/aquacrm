import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterValue = {
  q: string;
  from: string | null;
  to: string | null;
  category: string | null;
  // new fields
  sortBy?: 'name' | 'date' | null;
  sortOrder?: 'asc' | 'desc' | null;
  status?: string | null;
};

export type TableFiltersProps = {
  categories?: string[];
  value?: Partial<FilterValue>;
  onChange?: (v: FilterValue) => void;
};

export const TableFilters: React.FC<TableFiltersProps> = ({ categories = [], value, onChange }) => {
  const initial: FilterValue = {
    q: "",
    from: null,
    to: null,
    category: null,
  sortBy: null,
  sortOrder: null,
  status: null,
    ...value,
  };

  const [state, setState] = React.useState<FilterValue>(initial);

  React.useEffect(() => {
    if (value) setState((s) => ({ ...s, ...value } as FilterValue));
  }, [value]);

  const update = (patch: Partial<FilterValue>) => {
    const next: FilterValue = { ...state, ...patch } as FilterValue;
    setState(next);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
  <Input
    placeholder="ابحث..."
  value={state.q}
    onChange={(e) => update({ q: e.target.value })}
    className="min-w-[200px]"
  />

      {/* Sort controls */}
      <div className="flex gap-2 items-center">
        <Select
          onValueChange={(v: string) => update({ sortBy: v === 'NONE' ? null : (v as 'name' | 'date') })}
          value={state.sortBy ?? 'NONE'}
        >
          <SelectTrigger className="min-w-[120px]">
            <SelectValue placeholder="فرز حسب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">بلا</SelectItem>
            <SelectItem value="name">الاسم</SelectItem>
            <SelectItem value="date">التاريخ</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v: string) => update({ sortOrder: v === 'NONE' ? null : (v as 'asc' | 'desc') })}
          value={state.sortOrder ?? 'NONE'}
        >
          <SelectTrigger className="min-w-[100px]">
            <SelectValue placeholder="الترتيب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">افتراضي</SelectItem>
            <SelectItem value="asc">تصاعدي</SelectItem>
            <SelectItem value="desc">تنازلي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status filter */}
      <Select
        onValueChange={(v: string) => update({ status: v === 'ALL' ? null : v })}
        value={state.status ?? 'ALL'}
      >
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">جميع الحالات</SelectItem>
          <SelectItem value="Paid">مدفوعة</SelectItem>
          <SelectItem value="Unpaid">غير مدفوعة</SelectItem>
          <SelectItem value="Overdue">متأخرة</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Input
          type="date"
          value={state.from ?? ""}
          onChange={(e) => update({ from: e.target.value || null })}
          className="w-auto"
        />
        <Input
          type="date"
          value={state.to ?? ""}
          onChange={(e) => update({ to: e.target.value || null })}
          className="w-auto"
        />
      </div>

      <Select
        onValueChange={(v: string) => update({ category: v === 'ALL' ? null : v })}
        value={state.category ?? 'ALL'}
      >
        <SelectTrigger className="min-w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TableFilters;
