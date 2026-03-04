import { useState } from "react";

import { SETUP_DIALOG_TEXT } from "./constants";
import { Backdrop, ContinueButton, Dialog, Field } from "./styles";

type SetupDialogProps = {
  defaults: {
    decks_per_shoe: number;
    hands_dealt: number;
  };
  onContinue: (value: {
    decks_per_shoe: number;
    hands_dealt: number;
  }) => void;
};

const range = (max: number) => Array.from({ length: max }, (_, idx) => idx + 1);

const SetupDialog = ({ defaults, onContinue }: SetupDialogProps) => {
  const [decks, setDecks] = useState(defaults.decks_per_shoe);
  const [hands, setHands] = useState(defaults.hands_dealt);

  return (
    <Backdrop>
      <Dialog>
        <h2>{SETUP_DIALOG_TEXT.TITLE}</h2>
        <Field>
          {SETUP_DIALOG_TEXT.DECKS_PER_SHOE}
          <select value={decks} onChange={(event) => setDecks(Number(event.target.value))}>
            {range(8).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          {SETUP_DIALOG_TEXT.HANDS_DEALT}
          <select value={hands} onChange={(event) => setHands(Number(event.target.value))}>
            {range(7).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <ContinueButton
          onClick={() =>
            onContinue({
              decks_per_shoe: decks,
              hands_dealt: hands,
            })
          }
        >
          {SETUP_DIALOG_TEXT.CONTINUE}
        </ContinueButton>
      </Dialog>
    </Backdrop>
  );
};

export { SetupDialog };
