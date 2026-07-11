import { Dropdown } from "primereact/dropdown";

interface DropdownOption {
  value: any;
  label: string;
}

interface PrimeDropdownProps {
  value: any;
  onChange: (value: any) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
}

function PrimeDropdown({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = "",
  invalid = false,
}: PrimeDropdownProps) {
  return (
    <Dropdown
      value={value || null}
      onChange={(e) => onChange(e.value || "")}
      options={options}
      optionLabel="label"
      optionValue="value"
      placeholder={placeholder}
      showClear
      disabled={disabled}
      className={`app-prime-dropdown w-full ${invalid ? "app-prime-dropdown-error" : ""} ${className}`}
      panelClassName="app-prime-dropdown-panel"
    />
  );
}

export default PrimeDropdown;
