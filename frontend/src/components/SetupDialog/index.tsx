import { useMemo, useState } from "react";

import { GlassButton } from "@/components/ui/GlassButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SETUP_DIALOG_TEXT } from "./constants";
import {
  Backdrop,
  Dialog,
  Field,
  FieldLabel,
  Footer,
  Stepper,
  StepperRow,
} from "./styles";

type SetupPayload = {
  decks_per_shoe: number;
  hands_dealt: number;
};

type SetupDialogProps = {
  defaults: SetupPayload;
  onContinue: (value: SetupPayload) => void;
  onSaveDefault?: (value: SetupPayload) => void;
  onCancel?: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const SetupDialog = ({ defaults, onContinue, onSaveDefault, onCancel }: SetupDialogProps) => {
  const [decks, setDecks] = useState(defaults.decks_per_shoe);
  const [hands, setHands] = useState(defaults.hands_dealt);

  const payload = useMemo(
    () => ({
      decks_per_shoe: decks,
      hands_dealt: hands,
    }),
    [decks, hands],
  );

  return (
    <Backdrop
      onClick={() => {
        onCancel?.();
      }}
    >
      <Dialog
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2>{SETUP_DIALOG_TEXT.TITLE}</h2>

        <Field>
          <FieldLabel>{SETUP_DIALOG_TEXT.PRESETS}</FieldLabel>
          <SegmentedControl
            value={`${decks}-${hands}`}
            onChange={(value) => {
              const [nextDecks, nextHands] = value.split("-").map(Number);
              setDecks(nextDecks);
              setHands(nextHands);
            }}
            ariaLabel="Session presets"
            options={[
              { value: "4-2", label: "Beginner" },
              { value: "6-3", label: "Standard" },
              { value: "8-5", label: "Pressure" },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETUP_DIALOG_TEXT.DECKS_PER_SHOE}</FieldLabel>
          <StepperRow>
            <GlassButton $variant="ghost" onClick={() => setDecks((value) => clamp(value - 1, 1, 8))}>
              -
            </GlassButton>
            <Stepper>{decks}</Stepper>
            <GlassButton $variant="ghost" onClick={() => setDecks((value) => clamp(value + 1, 1, 8))}>
              +
            </GlassButton>
          </StepperRow>
        </Field>

        <Field>
          <FieldLabel>{SETUP_DIALOG_TEXT.HANDS_DEALT}</FieldLabel>
          <StepperRow>
            <GlassButton $variant="ghost" onClick={() => setHands((value) => clamp(value - 1, 1, 7))}>
              -
            </GlassButton>
            <Stepper>{hands}</Stepper>
            <GlassButton $variant="ghost" onClick={() => setHands((value) => clamp(value + 1, 1, 7))}>
              +
            </GlassButton>
          </StepperRow>
        </Field>

        <Footer>
          <GlassButton $variant="primary" onClick={() => onContinue(payload)}>
            {SETUP_DIALOG_TEXT.CONTINUE}
          </GlassButton>
          <GlassButton
            $variant="secondary"
            onClick={() => {
              onSaveDefault?.(payload);
            }}
          >
            {SETUP_DIALOG_TEXT.SAVE_DEFAULT}
          </GlassButton>
          <GlassButton
            $variant="ghost"
            onClick={() => {
              onCancel?.();
            }}
          >
            {SETUP_DIALOG_TEXT.CANCEL}
          </GlassButton>
        </Footer>
      </Dialog>
    </Backdrop>
  );
};

export { SetupDialog };
