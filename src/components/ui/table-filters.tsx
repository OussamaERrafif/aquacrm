import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterValue = {
  q: string;
  from: string | null;
  to: string | null;
  category: string | null;
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
        placeholder="Search..."
  value={state.q}
        onChange={(e) => update({ q: e.target.value })}
        className="min-w-[200px]"
      />

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
