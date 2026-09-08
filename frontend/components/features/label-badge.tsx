interface Label {
  name: string;
  color: string;
}

export function LabelBadge({ label }: { label: Label }) {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${label.color}20`, color: label.color }}
    >
      {label.name}
    </span>
  );
}