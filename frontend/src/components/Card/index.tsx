import { CardFace, Center } from "./styles";

type CardProps = {
  code: string;
};

const suitToSymbol: Record<string, string> = {
  S: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
};

const Card = ({ code }: CardProps) => {
  const rawRank = code[0] ?? "?";
  const suit = code[1] ?? "S";
  const symbol = suitToSymbol[suit] ?? "♠";
  const rank = rawRank === "T" ? "10" : rawRank;
  const isRed = suit === "H" || suit === "D";
  return (
    <CardFace data-testid="card-face" $red={isRed}>
      <span>{`${rank}${symbol}`}</span>
      <Center>{symbol}</Center>
      <span>{`${rank}${symbol}`}</span>
    </CardFace>
  );
};

export { Card };
