import { ROUND_RESOLVED_TEXT } from "./constants";
import { Backdrop, Button, Card, Subtitle, Title } from "./styles";

type RoundResolvedOverlayProps = {
  onContinue: () => void;
};

const RoundResolvedOverlay = ({ onContinue }: RoundResolvedOverlayProps) => {
  return (
    <Backdrop>
      <Card>
        <Title>{ROUND_RESOLVED_TEXT.TITLE}</Title>
        <Subtitle>{ROUND_RESOLVED_TEXT.SUBTITLE}</Subtitle>
        <Button onClick={onContinue}>{ROUND_RESOLVED_TEXT.CONTINUE_TO_COUNT}</Button>
      </Card>
    </Backdrop>
  );
};

export { RoundResolvedOverlay };
