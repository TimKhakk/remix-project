export const CheckBox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex cursor-pointer items-center gap-2 rounded px-2 hover:bg-gray-400">
    <input
      className="hidden appearance-none"
      type="checkbox"
      defaultChecked={false}
      checked={checked}
      onChange={onChange}
    />
    {!checked ? (
      <i className="ri-checkbox-blank-circle-line"></i>
    ) : (
      <i className="ri-checkbox-circle-fill"></i>
    )}
    <span>{label}</span>
  </label>
);
