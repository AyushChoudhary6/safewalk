export interface Incident {
  id: string;
  type: 'THEFT' | 'HARASSMENT' | 'POOR_LIGHTING' | 'ASSAULT' | 'SUSPICIOUS_ACTIVITY';
  latitude: number;
  longitude: number;
  severity: number;
  description: string;
}

export const mockIncidents: Incident[] = [
  {
    id: "1",
    type: "THEFT",
    latitude: 28.614018,
    longitude: 77.079051,
    severity: 3,
    description: "Recent phone snatching reported"
  },
  {
    id: "2",
    type: "ASSAULT",
    latitude: 28.60934,
    longitude: 77.100419,
    severity: 5,
    description: "Physical altercation reported late night"
  },
  {
    id: "3",
    type: "HARASSMENT",
    latitude: 28.62858,
    longitude: 77.122552,
    severity: 4,
    description: "Group harassing passersby"
  },
  {
    id: "4",
    type: "POOR_LIGHTING",
    latitude: 28.645128,
    longitude: 77.138916,
    severity: 2,
    description: "Street lights completely off"
  },
  {
    id: "5",
    type: "SUSPICIOUS_ACTIVITY",
    latitude: 28.663665,
    longitude: 77.155744,
    severity: 3,
    description: "Suspicious individuals spotted"
  },
  {
    id: "6",
    type: "THEFT",
    latitude: 28.672541,
    longitude: 77.171311,
    severity: 4,
    description: "Armed robbery reported"
  },
  {
    id: "7",
    type: "ASSAULT",
    latitude: 28.665997,
    longitude: 77.201646,
    severity: 5,
    description: "Aggravated assault in alleyway"
  },
  {
    id: "8",
    type: "HARASSMENT",
    latitude: 28.667422,
    longitude: 77.214422,
    severity: 3,
    description: "Verbal harassment incident"
  },
  {
    id: "9",
    type: "SUSPICIOUS_ACTIVITY",
    latitude: 28.674399,
    longitude: 77.245128,
    severity: 2,
    description: "Unidentified vehicle circling"
  },
  {
    id: "10",
    type: "THEFT",
    latitude: 28.67859,
    longitude: 77.261611,
    severity: 3,
    description: "Stolen bicycle"
  }
];

