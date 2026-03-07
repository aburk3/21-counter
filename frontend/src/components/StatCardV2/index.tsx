import { GlassSurface } from "@/components/ui/GlassSurface";
import { Label, Trend, Value, Wrap } from "./styles";

type TrendState = "up" | "down" | "neutral";

type StatCardV2Props = {
  label: string;
  value: string | number;
  trend?: TrendState;
  helper?: string;
};

const trendLabel: Record<TrendState, string> = {
  up: "Improving",
  down: "Needs work",
  neutral: "Steady",
};

const StatCardV2 = ({ label, value, trend = "neutral", helper }: StatCardV2Props) => {
  return (
    <GlassSurface as={Wrap} $elevation={1}>
      <Label>{label}</Label>
      <Value>{value}</Value>
      <Trend $trend={trend}>{helper ?? trendLabel[trend]}</Trend>
    </GlassSurface>
  );
};

export { StatCardV2 };
