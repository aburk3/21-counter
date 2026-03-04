import { RANK_BADGE_TEXT, RANK_LABELS } from "./constants";

import { Badge } from "./styles";
import { AceIcon, BeginnerIcon, CrownIcon, ProIcon, SpotterIcon } from "./icons";

type RankBadgeProps = {
  rank: string;
};

const RankBadge = ({ rank }: RankBadgeProps) => {
  const normalized = rank.toLowerCase();
  const metadata =
    {
      rookie: { label: RANK_LABELS.rookie, icon: BeginnerIcon },
      spotter: { label: RANK_LABELS.spotter, icon: SpotterIcon },
      pro: { label: RANK_LABELS.pro, icon: ProIcon },
      ace: { label: RANK_LABELS.ace, icon: AceIcon },
      shark: { label: RANK_LABELS.shark, icon: CrownIcon },
    }[normalized] ?? { label: RANK_LABELS.rookie, icon: BeginnerIcon };
  const Icon = metadata.icon;
  return (
    <Badge>
      <Icon size={16} />
      <span>{`${RANK_BADGE_TEXT.PREFIX} ${metadata.label}`}</span>
    </Badge>
  );
};

export { RankBadge };
