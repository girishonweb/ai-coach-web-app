// These keys must exactly match what the n8n coach-generate workflow expects.
// The workflow normalises aliases but canonical snake_case is always safest.
export const LAYER_KEYS_IN_ORDER = [
  'problem_understanding',
  'validation_analysis',
  'manual_workflow',
  'need_extraction',
  'system_design',
  'architecture',
  'implementation_plan',
  'verification_plan',
] as const

export type LayerKey = (typeof LAYER_KEYS_IN_ORDER)[number]

export const LayerTitles: Record<LayerKey, string> = {
  problem_understanding: 'Problem Understanding',
  validation_analysis:   'Validation Analysis',
  manual_workflow:       'Manual Workflow',
  need_extraction:       'Need Extraction',
  system_design:         'System Design',
  architecture:          'Architecture',
  implementation_plan:   'Implementation Plan',
  verification_plan:     'Verification Plan',
}

export const LayerDescriptions: Record<LayerKey, string> = {
  problem_understanding:
    'Deeply understand the problem before thinking about solutions. Identify who suffers, when they suffer, and what they currently do about it.',
  validation_analysis:
    'Prove the problem is real before building. Define what evidence would confirm or deny your hypothesis, and what the smallest testable experiment looks like.',
  manual_workflow:
    'Map every step done by hand today before writing a single line of code. Each manual step becomes a need; each need becomes a deliberate tool choice.',
  need_extraction:
    'Derive what the system must do before naming any tool. Map each need to: remember, react, generate, or touch. Derive ONLY from the first three approved layers.',
  system_design:
    'Design how the system works end-to-end before touching any tool. One user action, one data flow. Derive only from approved layers.',
  architecture:
    'Map every need to the exact tool that answers it. Every component must trace back to a need from the Need Extraction layer.',
  implementation_plan:
    'Sequence the build so each step is testable before the next. Database before UI. Skeleton before polish.',
  verification_plan:
    'A response from the tool is not verification. A real person doing something because of the tool is verification. Write the test before running it.',
}
