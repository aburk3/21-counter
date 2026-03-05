import { Chip, ChipControls, ChipGroup, ChipValue, ControlButton, Tray } from "./styles";

type ChipTrayProps = {
  onChangeBet: (nextBet: number) => void;
  currentBet: number;
  maxBet: number;
  minBet?: number;
  locked?: boolean;
};

const CHIPS = [
  { amount: 25, color: "#c93737" },
  { amount: 100, color: "#33a062" },
  { amount: 500, color: "#212121" },
] as const;

const ChipTray = ({
  onChangeBet,
  currentBet,
  maxBet,
  minBet = 25,
  locked = false,
}: ChipTrayProps) => {
  const safeCurrentBet =
    Number.isFinite(currentBet) && currentBet >= minBet ? currentBet : minBet;

  const canIncrease = (amount: number) => !locked && safeCurrentBet + amount <= maxBet;
  const canDecrease = (amount: number) =>
    !locked && safeCurrentBet > minBet && safeCurrentBet - amount >= minBet;

  const applyDelta = (delta: number) => {
    const next = safeCurrentBet + delta;
    if (next < minBet || next > maxBet || locked) {
      return;
    }
    onChangeBet(next);
  };

  return (
    <Tray>
      {CHIPS.map((chip) => {
        return (
          <ChipGroup key={chip.amount}>
            <Chip $bg={chip.color} aria-hidden>
              <ChipValue>${chip.amount}</ChipValue>
            </Chip>
            <ChipControls>
              <ControlButton
                onClick={() => applyDelta(-chip.amount)}
                disabled={!canDecrease(chip.amount)}
                aria-label={`Decrease bet by $${chip.amount}`}
              >
                −
              </ControlButton>
              <ControlButton
                onClick={() => applyDelta(chip.amount)}
                disabled={!canIncrease(chip.amount)}
                aria-label={`Increase bet by $${chip.amount}`}
              >
                +
              </ControlButton>
            </ChipControls>
          </ChipGroup>
        );
      })}
    </Tray>
  );
};

export { ChipTray };
