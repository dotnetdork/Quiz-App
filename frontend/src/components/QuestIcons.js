/**
 * QuestIcons
 *
 * SVG icons per quest type, using the unified League Orange/Navy
 * palette to match the rest of the app.
 */

export function ReflectionJournalIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#1a365d" />
      <path d="M28 22C28 19.7909 29.7909 18 32 18H62L72 28V78C72 80.2091 70.2091 82 68 82H32C29.7909 82 28 80.2091 28 78V22Z" fill="white" fillOpacity="0.9" />
      <path d="M62 18V28H72L62 18Z" fill="#c8d8ea" />
      <line x1="36" y1="42" x2="62" y2="42" stroke="#1a365d" strokeWidth="3" strokeLinecap="round" />
      <line x1="36" y1="52" x2="62" y2="52" stroke="#1a365d" strokeWidth="3" strokeLinecap="round" />
      <line x1="36" y1="62" x2="54" y2="62" stroke="#1a365d" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 66L64 62L74 72L70 76L60 66Z" fill="#ef6c00" />
      <path d="M58 68L60 66L64 70L62 72L58 68Z" fill="#ef6c00" />
    </svg>
  );
}

export function AIChatChallengeIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#ef6c00" />
      <path d="M20 34C20 28.4772 24.4772 24 30 24H70C75.5228 24 80 28.4772 80 34V56C80 61.5228 75.5228 66 70 66H48L34 78V66H30C24.4772 66 20 61.5228 20 56V34Z" fill="white" />
      <circle cx="38" cy="45" r="4" fill="#ef6c00" />
      <circle cx="50" cy="45" r="4" fill="#ef6c00" />
      <circle cx="62" cy="45" r="4" fill="#ef6c00" />
      <path d="M72 14L74.5 20.5L81 23L74.5 25.5L72 32L69.5 25.5L63 23L69.5 20.5L72 14Z" fill="#ffd43b" />
    </svg>
  );
}

export function SpecSprintIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#4caf50" />
      <rect x="22" y="26" width="56" height="48" rx="4" fill="white" />
      <line x1="30" y1="38" x2="70" y2="38" stroke="#4caf50" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="48" x2="58" y2="48" stroke="#4caf50" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="58" x2="64" y2="58" stroke="#4caf50" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="68" x2="46" y2="68" stroke="#4caf50" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="66" r="10" fill="#4caf50" />
      <path d="M68 66L71 69L77 62" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DefaultQuestIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#607d8b" />
      <path d="M50 22L58 42H80L62 55L69 76L50 63L31 76L38 55L20 42H42L50 22Z" fill="white" />
    </svg>
  );
}

export const QUEST_TYPE_ICONS = {
  reflection_journal: ReflectionJournalIcon,
  ai_chat_challenge: AIChatChallengeIcon,
  spec_sprint: SpecSprintIcon,
};

export const QUEST_TYPE_COLORS = {
  reflection_journal: '#1a365d',
  ai_chat_challenge: '#ef6c00',
  spec_sprint: '#4caf50',
};

export function getQuestIcon(type) {
  return QUEST_TYPE_ICONS[type] || DefaultQuestIcon;
}

export function getQuestColor(type) {
  return QUEST_TYPE_COLORS[type] || '#607d8b';
}
