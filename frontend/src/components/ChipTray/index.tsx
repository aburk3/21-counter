import { Chip, Tray } from "./styles";

type ChipTrayProps = {
  onBet: (amount: number) => void;
  chips: number;
  locked?: boolean;
};

const CHIPS = [
  { amount: 25, color: "#c93737" },
  { amount: 100, color: "#33a062" },
  { amount: 500, color: "#212121" },
] as const;

const ChipTray = ({ onBet, chips, locked = false }: ChipTrayProps) => {
  return (
    <Tray>
      {CHIPS.map((chip) => (
        <Chip
          key={chip.amount}
          $bg={chip.color}
          onClick={() => onBet(chip.amount)}
          disabled={locked || chip.amount > chips}
        >
          ${chip.amount}
        </Chip>
      ))}
    </Tray>
  );
};

export { ChipTray };
