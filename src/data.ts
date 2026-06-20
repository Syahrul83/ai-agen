import { UserProfile } from "./types";

export interface GrantTemplate {
  id: string;
  title: string;
  funder: string;
  amountRange: string;
  deadline: string;
  guidelines: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  orgName: "SocioCode Initiative",
  orgType: "student_group",
  location: "Chicago, IL, USA",
  annualBudget: 15000,
  projectDescription: "We are organizing 'CodeCamp Chicago', a series of weekend coding workshops, mentor matching, and computer access hubs supporting low-income high school students. Funding will be utilized to secure laptops, deliver snacks, and secure a physical training venue.",
  targetPopulation: "Historically under-represented youth & public school students",
  requestedAmount: 18000,
  hasPreviousGrants: false
};

export const PRELOADED_GRANTS: GrantTemplate[] = [
  {
    id: "tech_good",
    title: "Youth Digital Literacy & Coding Catalyst Grant",
    funder: "TechForGood Alliance",
    amountRange: "$5,000 - $30,000",
    deadline: "September 30, 2026",
    guidelines: `The TechForGood Alliance seeks and funds community groups, schools, non-profits, student clubs, and grassroots associations dedicated to demystifying modern technology and coding for youth.

Primary Focus Fields:
1. Interactive Software Workshops: Hands-on code instruction using web-dev, scratch, Python, or robotics.
2. Device & Connectivity Access: Equipping regional training clinics or local public schools with functional portable computing units.
3. Industry Pathways & Mentorship: Partnering senior industry professionals with youth from underrepresented postal codes to foster engineering interest.

Rules & Compliance:
1. Registered 501c3 status is preferred, but community collectives or student organizations with a specified financial sponsor can easily apply.
2. Direct funding cannot support capital building ownership. Handheld electronic purchase must not compromise more than 40% of the total request.
  `
  },
  {
    id: "green_tech",
    title: "GreenTech Community Sustainability Incubator Fund",
    funder: "EcoEarth Foundation",
    amountRange: "$25,000 - $100,000",
    deadline: "October 15, 2026",
    guidelines: `EcoEarth Foundation seeds regional actions centered on applying sustainable physical and green technologies. This community incubator fund focuses on regional carbon emission minimization, waste reduction, and smart circular economic hubs.

Primary Focus Fields:
1. Electronic Waste Recycling & Tech Adaptation: Interactive community restoration clinics repairing local tech for distribution or recycling hazardous battery systems.
2. Sustainable Neighborhood Microstructures: Building composting containers, community garden moisture monitoring arrays, or regional micro-solar charging hubs.
3. Under-resourced Environmental Stewardship: Training neighborhood residents in energy auditing or localized green solutions.

Rules & Compliance:
1. Open to schools, regional non-profits, and registered cooperative entities with annual operational expenditures under $1,000,000.
2. Requires a demonstrated 10% in-kind matching support (such as volunteer logistics labor or pre-owned hardware contributions).
  `
  },
  {
    id: "arts_equity",
    title: "Arts Outreach & Storytelling Equity Grant",
    funder: "Arts Council for All",
    amountRange: "$5,000 - $20,000",
    deadline: "November 1, 2026",
    guidelines: `Arts Council for All funds storytelling endeavors, multi-media publications, independent podcasts, or local community murals celebrating regional histories and promoting social equity.

Primary Focus Fields:
1. Underrepresented Cultural Storytelling: Archiving oral histories from elder citizens or recording regional community podcasts.
2. Intergenerational Creative Partnerships: Creating mentoring structures where younger students learn visual painting, layout, digital design, or sound engineering.
3. Inclusive Open Access Murals: Delivering free public displays, public performance plays, or accessible digital visual arts libraries.

Rules & Compliance:
1. Individual artists, unincorporated artist guilds, and community nonprofits are welcome to apply.
2. No matching funds required.
3. The project outcomes must culminate in a public-facing exhibition, performance, or digital launch free of charge.
  `
}
];
