export interface UserProfile {
  orgName: string;
  orgType: "nonprofit" | "student_group" | "community" | "individual";
  location: string;
  annualBudget: number;
  projectDescription: string;
  targetPopulation: string;
  requestedAmount: number;
  hasPreviousGrants: boolean;
}

export interface ResearchOutput {
  funderName: string;
  grantName: string;
  summary: string;
  fundingAmountRange: string;
  matchingFundsRequired: string;
  deadlineDate: string;
  keyDatesStr: string;
  eligibilityMandates: string[];
  focusAreas: string[];
}

export interface EligibilityOutput {
  alignmentScore: number; // 0 to 100
  eligibilityStatus: "Fully Eligible" | "Partially Eligible" | "Ineligible" | "Uncertain";
  pros: string[];
  cons: string[];
  mitigations: string[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  assignee: string;
  dueDateRelative: string;
  completed: boolean;
}

export interface ChecklistOutput {
  milestones: { title: string; desc: string; daysBeforeDeadline: number }[];
  requiredDocuments: { name: string; required: boolean; hint: string }[];
}

export interface ProposalSectionDraft {
  id: string;
  sectionTitle: string;
  objective: string;
  guidelines: string;
  tailoredDraft: string;
}

export interface DraftingOutput {
  sections: ProposalSectionDraft[];
}

export interface ReviewOutput {
  missingInfoFlags: { item: string; priority: "high" | "medium" | "low"; explanation: string }[];
  fundingRisks: string[];
  complianceChecks: string[];
  recommendedStrategy: string;
}

export interface AgentLog {
  id: string;
  agentName: "Coordinator" | "Research Agent" | "Eligibility Agent" | "Checklist Agent" | "Drafting Agent" | "Review Agent";
  message: string;
  timestamp: string;
  status: "idle" | "running" | "success" | "error";
}

export interface MultiAgentAnalysisResponse {
  research: ResearchOutput;
  eligibility: EligibilityOutput;
  checklist: ChecklistOutput;
  drafting: DraftingOutput;
  review: ReviewOutput;
  agentLogs: AgentLog[];
}
