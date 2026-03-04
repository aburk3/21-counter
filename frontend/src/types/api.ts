type AuthSuccessResponse = {
  user: { id: number; email: string };
  access: string;
  refresh: string;
};

type RegisterPendingResponse = {
  user: { id: number; email: string };
  verification_required: true;
  detail: string;
};

type AuthResponse = AuthSuccessResponse | RegisterPendingResponse;

type Settings = {
  default_decks_per_shoe: number;
  default_hands_dealt: number;
  table_speed: string;
  selected_deck_skin: string;
};

type Profile = {
  chips_balance: number;
  rank: string;
  xp: number;
  current_streak: number;
  best_streak: number;
};

type MeResponse = {
  id: number;
  email: string;
  profile: Profile;
  settings: Settings;
};

type DashboardResponse = {
  correct_count_games: number;
  total_games: number;
  accuracy_pct: number;
  strategy_correct_pct: number;
  avg_decision_ms: number;
  current_rank: string;
  xp: number;
  chips: number;
  current_streak: number;
  best_streak: number;
  strategy_correct_count: number;
  correct_count_submissions: number;
  total_rounds: number;
  xp_to_next_rank: number;
  next_rank: string | null;
  rank_progress_pct: number;
  available_skins: string[];
  selected_skin: string;
};

type HandStatus =
  | "in_play"
  | "stood"
  | "bust"
  | "twenty_one"
  | "blackjack"
  | "win"
  | "loss"
  | "push";

type RoundPhase = "user_turn" | "other_turns" | "dealer_turn" | "resolved";

type PlayState = {
  running_count: number;
  round_number: number;
  current_bet: number;
  round_ready_for_submission: boolean;
  active_round: {
    user_hands: Array<{
      cards: string[];
      bet: number;
      total: number;
      status: HandStatus;
      result: string;
    }>;
    dealer_hand: string[];
    dealer_total: number;
    dealer_status: HandStatus;
    other_hands: Array<{
      hands: Array<{
        cards: string[];
        bet: number;
        total: number;
        status: HandStatus;
        result: string;
      }>;
      actions: string[];
      total_bet: number;
      result: string;
      chips_delta: number;
    }>;
    active_hand_index: number;
    phase: RoundPhase;
    resolved: boolean;
    result: string;
    chips_delta: number;
    started_at_ms: number;
    ended_at_ms?: number;
    legal_actions: Array<"hit" | "stand" | "split" | "double">;
  } | null;
};

export type {
  AuthResponse,
  AuthSuccessResponse,
  RegisterPendingResponse,
  Settings,
  Profile,
  MeResponse,
  DashboardResponse,
  PlayState,
};
