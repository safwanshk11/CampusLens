// Entirely fictional fixtures. Never present these as verified college facts.
export const demoColleges = [
  ["Aurora Institute of Technology", "Bengaluru", "Karnataka"],
  ["Cedar Valley University", "Pune", "Maharashtra"],
  ["Meridian School of Engineering", "Chennai", "Tamil Nadu"],
  ["Northstar College", "Delhi", "Delhi"],
  ["Riverstone Institute", "Hyderabad", "Telangana"],
  ["Saffron Coast University", "Kochi", "Kerala"],
  ["Silverleaf Technical College", "Jaipur", "Rajasthan"],
  ["Bluehaven University", "Ahmedabad", "Gujarat"],
  ["Evergreen Institute of Science", "Kolkata", "West Bengal"],
  ["Suncrest College", "Lucknow", "Uttar Pradesh"],
  ["Maplebridge University", "Bengaluru", "Karnataka"],
  ["Horizon Fields Institute", "Pune", "Maharashtra"],
] as const;

export const courseTemplates = [
  { slug: "btech-computer-science", name: "B.Tech Computer Science", discipline: "Engineering", degreeLevel: "UNDERGRADUATE", durationMonths: 48 },
  { slug: "bba", name: "Bachelor of Business Administration", discipline: "Management", degreeLevel: "UNDERGRADUATE", durationMonths: 36 },
  { slug: "msc-data-science", name: "M.Sc Data Science", discipline: "Science", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
] as const;

export const demoSlug = (name: string) => `demo-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
