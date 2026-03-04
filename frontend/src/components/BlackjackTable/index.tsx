import { Card } from "@/components/Card";
import type { PlayState } from "@/types/api";
import { HAND_STATUS_LABELS, TABLE_TEXT } from "./constants";

import {
  BetItem,
  BetSummary,
  Cards,
  HandRow,
  Header,
  Label,
  Seat,
  SeatHeader,
  Seats,
  StatusPill,
  TableWrap,
} from "./styles";

type BlackjackTableProps = {
  state: PlayState | null;
  chips: number;
  timerMs: number;
  totalGainLoss: number;
  skin: string;
};

const BlackjackTable = ({
  state,
  chips,
  timerMs,
  totalGainLoss,
  skin,
}: BlackjackTableProps) => {
  const activeRound = state?.active_round;
  const userHandCount = activeRound?.user_hands?.length ?? 0;
  const statusKind = (status: string) =>
    status === "bust" || status === "loss" ? "bad" : status === "twenty_one" || status === "blackjack" || status === "win" ? "good" : "neutral";

  return (
    <TableWrap $skin={skin}>
      <Header>
        <strong>{TABLE_TEXT.timer(timerMs)}</strong>
        <strong>{TABLE_TEXT.chips(chips)}</strong>
      </Header>

      <HandRow>
        <Label>{TABLE_TEXT.DEALER}</Label>
        <Cards>
          {(activeRound?.dealer_hand ?? []).map((card, idx) => (
            <Card key={`${card}-${idx}`} code={card} />
          ))}
        </Cards>
        {activeRound?.resolved &&
        HAND_STATUS_LABELS[activeRound.dealer_status] ? (
          <StatusPill $kind={statusKind(activeRound.dealer_status)}>
            {HAND_STATUS_LABELS[activeRound.dealer_status]}
          </StatusPill>
        ) : null}
      </HandRow>

      <HandRow>
        <Label $isPrimary>{TABLE_TEXT.YOUR_HAND}</Label>
        <Seats>
          {(activeRound?.user_hands ?? []).map((hand, handIndex) => (
            <Seat key={`you-${handIndex}`} $isPrimary>
              <SeatHeader>
                {`${TABLE_TEXT.YOU_ACTIVE}${userHandCount > 1 ? ` #${handIndex + 1}` : ""}`}
              </SeatHeader>
              <Cards>
                {(hand.cards ?? []).map((card, idx) => (
                  <Card key={`${card}-${idx}`} code={card} />
                ))}
              </Cards>
              {activeRound?.resolved && HAND_STATUS_LABELS[hand.status] ? (
                <StatusPill $kind={statusKind(hand.status)}>
                  {HAND_STATUS_LABELS[hand.status]}
                </StatusPill>
              ) : null}
            </Seat>
          ))}
        </Seats>
      </HandRow>

      <HandRow>
        <Label>{TABLE_TEXT.TABLE_SEATS}</Label>
        <Seats>
          {(activeRound?.other_hands ?? []).map((seat, seatIndex) => (
            <Seat key={`seat-${seatIndex}`}>
              <SeatHeader>{TABLE_TEXT.computerSeat(seatIndex)}</SeatHeader>
              {seat.hands.map((hand, handIndex) => (
                <div key={`${seatIndex}-hand-${handIndex}`}>
                  <Cards>
                    {hand.cards.map((card, idx) => (
                      <Card key={`${card}-${idx}`} code={card} />
                    ))}
                  </Cards>
                  {activeRound?.resolved && HAND_STATUS_LABELS[hand.status] ? (
                    <StatusPill $kind={statusKind(hand.status)}>
                      {HAND_STATUS_LABELS[hand.status]}
                    </StatusPill>
                  ) : null}
                </div>
              ))}
            </Seat>
          ))}
        </Seats>
      </HandRow>

      <HandRow>
        <Label>{TABLE_TEXT.TABLE_BET}</Label>
        <BetSummary>
          <BetItem>{TABLE_TEXT.yourBet(state?.current_bet ?? 0)}</BetItem>
          <BetItem>{TABLE_TEXT.yourGainLoss(totalGainLoss)}</BetItem>
        </BetSummary>
      </HandRow>
    </TableWrap>
  );
};

export { BlackjackTable };
