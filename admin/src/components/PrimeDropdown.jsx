import { Dropdown } from "primereact/dropdown";

function PrimeDropdown({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = "",
  invalid = false,
}) {
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
