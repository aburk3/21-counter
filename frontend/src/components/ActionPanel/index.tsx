import { ACTION_LABELS } from "./constants";

import { ActionButton, Wrap } from "./styles";

type ActionPanelProps = {
  actions: Array<"hit" | "stand" | "split" | "double">;
  onAction: (action: "hit" | "stand" | "split" | "double") => void;
};

const ActionPanel = ({ actions, onAction }: ActionPanelProps) => {
  return (
    <Wrap>
      {actions.map((action) => (
        <ActionButton key={action} onClick={() => onAction(action)}>
          {ACTION_LABELS[action]}
        </ActionButton>
      ))}
    </Wrap>
  );
};

export { ActionPanel };
