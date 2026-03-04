type IconProps = {
  size?: number;
};

const defaultSize = 16;

const BeginnerIcon = ({ size = defaultSize }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 20c1.6-3.3 4-5 7-5s5.4 1.7 7 5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const SpotterIcon = ({ size = defaultSize }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ProIcon = ({ size = defaultSize }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const AceIcon = ({ size = defaultSize }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.7l6.2-.9L12 3Z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const CrownIcon = ({ size = defaultSize }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 18h16l-1.3-9-4.7 4-2-4-2 4-4.7-4L4 18Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export { BeginnerIcon, SpotterIcon, ProIcon, AceIcon, CrownIcon };