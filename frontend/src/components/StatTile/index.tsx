import { Label, Tile, Value } from "./styles";

type StatTileProps = {
  label: string;
  value: string | number;
};

const StatTile = ({ label, value }: StatTileProps) => {
  return (
    <Tile>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Tile>
  );
};

export { StatTile };