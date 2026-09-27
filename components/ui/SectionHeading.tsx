import { Icon } from "./Icon";
export function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <header className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{children}</h2>
      <span className="little-flower" aria-hidden="true">
        <Icon name="flower" />
      </span>
    </header>
  );
}
