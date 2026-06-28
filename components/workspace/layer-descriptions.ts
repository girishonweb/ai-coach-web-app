export const LAYER_KEYS_IN_ORDER = [
  'foundation',
  'awareness',
  'vision',
  'strategy',
  'alignment',
  'implementation',
  'momentum',
  'mastery',
] as const

export type LayerKey = (typeof LAYER_KEYS_IN_ORDER)[number]

export const LayerTitles: Record<LayerKey, string> = {
  foundation: 'Foundation',
  awareness: 'Awareness',
  vision: 'Vision',
  strategy: 'Strategy',
  alignment: 'Alignment',
  implementation: 'Implementation',
  momentum: 'Momentum',
  mastery: 'Mastery',
}

export const LayerDescriptions: Record<LayerKey, string> = {
  foundation:
    'Establish your foundation by clarifying your core values, beliefs, and what matters most. This layer sets the groundwork for all future progress.',
  awareness:
    'Develop deep self-awareness about your current state, strengths, challenges, and patterns. Understand where you are before charting your course forward.',
  vision:
    'Create a compelling vision of your desired future. Define what success looks like and the person you aim to become through this coaching journey.',
  strategy:
    'Develop a strategic approach to bridge the gap between your current state and your vision. Create actionable strategies tailored to your unique situation.',
  alignment:
    'Ensure all aspects of your life and goals are aligned with your values and vision. Address any conflicts or misalignments that may hold you back.',
  implementation:
    'Take concrete action on your strategy. Build systems, habits, and accountability to turn your plans into sustainable progress.',
  momentum:
    'Build and maintain momentum by celebrating wins, learning from setbacks, and staying focused on your progress. Keep the energy and motivation high.',
  mastery:
    'Integrate your learnings into mastery. Develop expertise in your chosen areas and help others while continuing your own growth journey.',
}
