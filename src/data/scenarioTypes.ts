export type OptionQuality = 'best' | 'partly_right' | 'tempting_mistake';

export interface ScenarioData {
  scenario: string;
  options: string[];          // 3 or 4 written options (the wow-me choice is added at play time)
  correct_option: string;     // label: A, B, C, or D
  worst_option: string;       // label of the most harmful choice
  practice_phrase?: string;   // optional override for auto-generated practice phrase
  option_labels?: OptionQuality[];  // hidden coaching labels, same order as options
  why?: string;               // parent-facing explanation override
  talk_about?: string;        // single parent conversation prompt override
}
