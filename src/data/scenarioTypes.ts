export interface ScenarioData {
  scenario: string;
  options: string[];          // exactly 4 options (A, B, C, D)
  correct_option: string;     // label: A, B, C, or D
  worst_option: string;       // label of the most harmful choice
  practice_phrase?: string;   // optional override for auto-generated practice phrase
}
