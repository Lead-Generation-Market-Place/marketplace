export function getUSASeason(date: Date = new Date()): 'Winter' | 'Spring' | 'Summer' | 'Fall' {
  const month = date.getMonth();

  if (month >= 2 && month <= 4) return 'Spring';  // Mar–May
  if (month >= 5 && month <= 7) return 'Summer';  // Jun–Aug
  if (month >= 8 && month <= 10) return 'Fall';   // Sep–Nov

  return 'Winter'; // Dec–Feb
}