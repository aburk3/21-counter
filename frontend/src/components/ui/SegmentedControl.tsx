import { GlassButton } from "@/components/ui/GlassButton";
import { SegWrap } from "./styles";

type Option = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<Option>;
  ariaLabel: string;
};

const SegmentedControl = ({
  value,
  onChange,
  options,
  ariaLabel,
}: SegmentedControlProps) => {
  return (
    <SegWrap role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <GlassButton
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          $variant={value === option.value ? "primary" : "ghost"}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </GlassButton>
      ))}
    </SegWrap>
  );
};

export { SegmentedControl };
