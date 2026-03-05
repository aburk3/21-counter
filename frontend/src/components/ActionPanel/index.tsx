import { GlassButton } from "@/components/ui/GlassButton";
import { ACTION_LABELS } from "./constants";

import { Wrap } from "./styles";

type ActionPanelProps = {
  actions: Array<"hit" | "stand" | "split" | "double">;
  onAction: (action: "hit" | "stand" | "split" | "double") => void;
};

const ActionPanel = ({ actions, onAction }: ActionPanelProps) => {
  return (
    <Wrap>
      {actions.map((action) => (
        <GlassButton key={action} $variant="secondary" onClick={() => onAction(action)}>
          {ACTION_LABELS[action]}
        </GlassButton>
      ))}
    </Wrap>
  );
};

export { ActionPanel };
