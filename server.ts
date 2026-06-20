import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Check if a real key is set
const isRealApiKey = (key: string | undefined): boolean => {
  return (
    typeof key === "string" &&
    key.trim().length > 15 &&
    !key.includes("MY_GEMINI_API_KEY") &&
    !key.includes("YOUR_")
  );
};

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!isRealApiKey(apiKey)) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Pre-defined fallback generators based on chosen grant type to provide highly realistic offline analysis
function getFallbackAnalysis(profile: any, grantTitle: string, grantText: string): any {
  const title = grantTitle || "Custom Grant Opportunity";
  const orgName = profile.orgName || "Our Local Community Initiative";
  const project = profile.projectDescription || "our training, development, and community impact program";
  const target = profile.targetPopulation || "under-resourced community members";
  const requested = profile.requestedAmount || 25000;
  const budget = profile.annualBudget || 50000;

  // Tailored responses depending on keywords in grantTitle or grantText
  let isGreenTech = title.toLowerCase().includes("green") || title.toLowerCase().includes("climate") || grantText.toLowerCase().includes("env") || grantText.toLowerCase().includes("planet");
  let isDigitalLiteracy = title.toLowerCase().includes("teach") || title.toLowerCase().includes("digital") || title.toLowerCase().includes("literacy") || grantText.toLowerCase().includes("tech") || grantText.toLowerCase().includes("code") || grantText.toLowerCase().includes("stem");
  let isArtsEquity = title.toLowerCase().includes("art") || title.toLowerCase().includes("culture") || grantText.toLowerCase().includes("equity") || grantText.toLowerCase().includes("story");

  let funderName = "The Global Solutions Trust";
  let extractedGrantName = title;
  let summary = "This grant provides resources to empower community groups and non-profits to solve immediate, localized needs with direct action, workshops, and program launches.";
  let fundingAmountRange = "$10,000 to $50,000";
  let matchingRequirement = "No match required; minor in-kind contribution preferred.";
  let deadline = "October 15, 2026";
  let focusAreas = ["Community-driven capability building", "Measurable local outcomes", "Equity in access and distribution"];
  let eligibilityRules = [
    "Must be direct project implementers",
    "Open to registered non-profits, school systems, and community coalitions",
    "Budget must clearly align with programmatic costs rather than direct administrative overhead"
  ];

  if (isGreenTech) {
    funderName = "EcoEarth Foundation";
    extractedGrantName = "GreenTech Community Incubator Fund";
    summary = "A highly targeted initiative to seed community-developed environmental and green technologies. The grant supports micro-grid development, composting tech, local energy workshops, or sustainability prototypes.";
    fundingAmountRange = "$25,000 to $100,000";
    matchingRequirement = "10% matching in-kind support (e.g., volunteer hours, donated equipment).";
    deadline = "October 15, 2026";
    focusAreas = [
      "Reduction of localized carbon or electronic waste",
      "Involvement of youth or underrepresented groups in environmental sciences",
      "Development of open-source or easily reproducible green technology"
    ];
    eligibilityRules = [
      "Must be a registered nonprofit, community-run co-op, or educational agency",
      "Projects must possess a physical implementation footprint",
      "Entities with annual budgets above $1,000,000 are ineligible for the direct community tier"
    ];
  } else if (isDigitalLiteracy) {
    funderName = "TechForGood Alliance";
    extractedGrantName = "Youth Digital Literacy & Coding Catalyst";
    summary = "An accelerator initiative focusing heavily on STEM education, software skills, and technology adoption for youth, coding groups, and schools in historically under-resourced centers.";
    fundingAmountRange = "$5,000 to $30,000";
    matchingRequirement = "No matching funds required; program must provide devices or access.";
    deadline = "September 30, 2026";
    focusAreas = [
      "Hands-on coding curricula and mentor-driven software workshops",
      "Hardware setup and internet accessibility support in remote/low-income centers",
      "Career pathway counseling and digital civic participation"
    ];
    eligibilityRules = [
      "Must represent or partner directly with non-profits, student associations, or tribal councils",
      "Must have a clear plan for student safety and digital privacy compliance",
      "Grant cannot support purchase of personal computing items for individual staff members"
    ];
  } else if (isArtsEquity) {
    funderName = "Arts Council for All";
    extractedGrantName = "Arts Outreach & Storytelling Equity Grant";
    summary = "Funding designed to promote cultural preservation, digital media creation, spoken-word workshops, and creative visual arts that focus on underrepresented identities, historic memory, or localized community storytelling.";
    fundingAmountRange = "$10,000 to $20,000";
    matchingRequirement = "No matching funds required; projects must culminate in a public exhibition, digital showcase, or community festival.";
    deadline = "November 1, 2026";
    focusAreas = [
      "Intergenerational history preservation and multi-media publication",
      "Inclusive public murals, community exhibitions, or digital theater",
      "Creative writing and podcast curation representing underserved groups"
    ];
    eligibilityRules = [
      "Open to individual artist collectives (with a fiscal sponsor), community centers, or registered non-profits",
      "Work must be made free and accessible to the general public",
      "Funding cannot be utilized directly to purchase permanent real-estate structures"
    ];
  }

  // Calculate alignment score based on orgType and request ratios
  let alignmentScore = 88;
  let status: "Fully Eligible" | "Partially Eligible" | "Ineligible" | "Uncertain" = "Fully Eligible";
  const pros = [
    `Strong alignment with focus on ${focusAreas[0]}.`,
    `Requested funding of $${requested.toLocaleString()} sits comfortably within the range of ${fundingAmountRange}.`,
    `Projects targeted towards '${target}' meet the highest tier of community impact criteria.`
  ];
  const cons: string[] = [];
  const mitigations: string[] = [];

  if (profile.orgType === "individual" && !isArtsEquity) {
    alignmentScore -= 20;
    status = "Partially Eligible";
    cons.push("Most grants from this funder prefer registered non-profits rather than individual applicants.");
    mitigations.push("Establish a formal relationship with a local non-profit as a Fiscal Sponsor to submit on your behalf.");
  }

  if (requested > 40000 && isArtsEquity) {
    alignmentScore -= 25;
    status = "Partially Eligible";
    cons.push(`Requested budget of $${requested.toLocaleString()} exceeds the normal upper limit of $20,000 for this storytelling fund.`);
    mitigations.push("Scale down project phases to align request closer to $15,000, or establish secondary co-sponsor options.");
  }

  if (budget < requested) {
    alignmentScore -= 15;
    status = "Partially Eligible";
    cons.push(`Your organization's annual operating budget ($${budget.toLocaleString()}) is smaller than your grant request ($${requested.toLocaleString()}). This raises organizational capacity red flags for risk assessors.`);
    mitigations.push("Revise request budget to represent a smaller, pilot-phase project, or partner with a substantial co-applicant.");
  }

  return {
    research: {
      funderName,
      grantName: extractedGrantName,
      summary,
      fundingAmountRange,
      matchingFundsRequired: matchingRequirement,
      deadlineDate: deadline,
      keyDatesStr: `Application Due: ${deadline}. Peer Jury Review: 30 days post-deadline. Notifications: December 2026. Project Start: Jan-Feb 2027.`,
      eligibilityMandates: eligibilityRules,
      focusAreas
    },
    eligibility: {
      alignmentScore: Math.max(10, Math.min(100, alignmentScore)),
      eligibilityStatus: status,
      pros,
      cons: cons.length > 0 ? cons : ["No severe compliance or location mismatches detected from our initial analysis."],
      mitigations: mitigations.length > 0 ? mitigations : ["Confirm IRS non-profit status is sound and current prior to submitting documentation."]
    },
    checklist: {
      milestones: [
        { title: "Draft Core Executive Summary", desc: `Outline why ${orgName} is uniquely positioned to help ${target} via ${project}`, daysBeforeDeadline: 28 },
         { title: "Review Board Lists & Tax Proof", desc: "Collect up-to-date IRS non-profit letters or student group verification documents required under eligibility regulations.", daysBeforeDeadline: 21 },
        { title: "Formulate Core Line-Item Budget", desc: `Ensure expenditures specifically breakdown the requested $${requested.toLocaleString()} without administrative overruns.`, daysBeforeDeadline: 14 },
        { title: "Secure Reference Letters", desc: "Request letters of recommendation stressing community credibility and direct local impact.", daysBeforeDeadline: 10 },
        { title: "Draft Proposal Modules & Review", desc: "Run draft outlines through the Review Agent's compliance filter one final time.", daysBeforeDeadline: 5 },
        { title: "Submit Application Package", desc: `Submit formal credentials and narrative docs prior to ${deadline}.`, daysBeforeDeadline: 1 }
      ],
      requiredDocuments: [
        { name: "Executive Narrative Plan", required: true, hint: "A detailed 4-to-5 page document explaining your vision, scope, and target residents." },
        { name: "IRS 501(c)(3) Letter / Status Proof", required: true, hint: "Official tax determination paperwork or collegiate sponsor certification letter." },
        { name: "Itemized Project Budget", required: true, hint: "Detailed line-item spreadsheet detailing where every project dollar goes." },
        { name: "Organization Operating Budget", required: false, hint: "Your parent budget supporting overall continuity." },
        { name: "Staff / Leadership Resumes", required: false, hint: "Short biographies highlighting the execution capabilities of your core leaders." },
        { name: "Letters of Local Endorsement", required: true, hint: `At least 2 statements from community stakeholders validating active impact for ${target}.` }
      ]
    },
    drafting: {
      sections: [
        {
          id: "sec_1",
          sectionTitle: "Executive Summary & Community Need Statement",
          objective: "Hook the evaluator with a crisp statement of what you are doing, who you serve, and why it is urgent.",
          guidelines: "Concentrate heavily on localized qualitative observations and verified public metrics from your demographic profile.",
          tailoredDraft: `PROJECT TITLE: Empowering ${orgName} - Direct Action Project\n\n1. RATIONALE & COMMUNITY URGENCY\nOur program is designed to directly support ${target}, who are navigating a critical gap in localized resources. Under the '${title}' framework, ${orgName} initiates local action to address these disparities directly.\n\nOur proposed project — focused specifically on '${project}' — aims to deliver direct support, workshop hubs, and material tools directly to those of highest vulnerability. This represents a vital, immediate intervention because traditional outreach program pipelines frequently overlook the nuanced needs of our regional population. Based on our current local operating scale in ${profile.location || "our city"}, this grant of $${requested.toLocaleString()} will directly facilitate immediate workshops, mentorship materials, and tangible local resources, setting an enduring foundation of resilience.`
        },
        {
          id: "sec_2",
          sectionTitle: "Operational Design & Project Methodology",
          objective: "Detail the chronological execution steps, showing exactly how funding translates to actions.",
          guidelines: "Identify core markers, key staffing positions, and physical setup logistics.",
          tailoredDraft: `2. CHRONOLOGICAL PROGRAM BLUEPRINT\nOver our active program timeline, we will move through three primary execution phases, ensuring maximum efficiency of all grant resources:\n\nPhase A - Ingestion & Recruitment (Months 1-2): We will directly integrate with community organizations in ${profile.location || "the area"} to recruit diverse participants conforming to our core ${target} target demographic.\n\nPhase B - Workshop Delivery & Toolkit Dissemination (Months 3-5): We will launch active operational cycles for '${project}', utilizing expert guides and interactive materials. Funding goes toward purchasing necessary toolkits and securing local spaces.\n\nPhase C - Metrics Assessment & Public Impact Showcase (Month 6): We will run quantitative and qualitative reviews, and host a public showcase event in compliance with the ${extractedGrantName} guidelines.`
        },
        {
          id: "sec_3",
          sectionTitle: "Impact Assessment & Community Evaluation Plan",
          objective: "Explain how you will measure and report project success to the grant jury.",
          guidelines: "Blend descriptive surveys with solid numerical metrics like participant counts and retention rates.",
          tailoredDraft: `3. IMPACT METRICS & SUCCESS DETERMINATION\nTo verify that the $${requested.toLocaleString()} funding from ${funderName} achieves maximum social yield, we will measure three primary performance markers:\n\n- Quantitative Reach: We aim to directly engage at least 150 members of the ${target} population in our educational/action workshops within the first 6 months.\n\n- Qualitative Adaptation: We will conduct robust entrance and exit interviews to measure the shift in local skill confidence and accessibility.\n\n- Continuing Self-Reliance: Progress metrics will be compiled into a public impact ledger and shared on open-source repositories to support duplication elsewhere.`
        }
      ]
    },
    review: {
      missingInfoFlags: [
        { item: "Audited financial statements", priority: "medium", explanation: "For requests over $25,000, review committees look highly upon standard accounting audits to check fiduciary safety." },
        { item: "Previous grant execution references", priority: "low", explanation: "Demonstrates that your organization can manage reporting timelines on time." }
      ],
      fundingRisks: [
        "Funder uses a performance-based milestone billing system. The organization will need bridge funding or a line of credit to manage initial start-up purchasing costs.",
        "Competition remains high for direct-action grants. Ensure that your localized impact figures are precise and backed with solid citations."
      ],
      complianceChecks: [
        "All outreach narratives must explicitly exclude any political lobbying activities and include active non-discrimination pledges in the public recruitment materials.",
        "A formal interim report must be submitted exactly 90 days after funding receipt, outlining all hardware/material asset procurement invoices."
      ],
      recommendedStrategy: `Begin draft compilation immediately, using our customized Executive Summary. Form a physical partner commitment with a verified administrative entity if your budget requires additional coverage, and schedule your board meetings to pre-approve the ${title} application package before the official ${deadline} submission gateway.`
    }
  };
}

// REST route for live agent analysis
app.post("/api/analyze-grant", async (req, res) => {
  const { profile, grantTitle, grantText } = req.body;

  if (!profile) {
    return res.status(400).json({ error: "No profile structure was provided." });
  }

  // Set up sequential multi-agent logs to simulate the workflow
  const logs: any[] = [
    { id: "log_1", agentName: "Coordinator", message: "Ingesting project profile and grant guidelines. Allocating roles...", timestamp: new Date().toLocaleTimeString(), status: "success" },
    { id: "log_2", agentName: "Research Agent", message: "Extracting funder priorities, award sizes, eligibility regulations, and focal areas...", timestamp: new Date().toLocaleTimeString(), status: "running" }
  ];

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!isRealApiKey(apiKey)) {
      // Offline Simulation Mode (Highly personalized for a perfect user-experience)
      // Artificially simulate progressive agent logs
      logs[1].status = "success";
      logs[1].message = "Extracting funder priorities, award sizes, and crucial constraints complete.";
      logs.push({ id: "log_3", agentName: "Eligibility Agent", message: `Comparing profile against requirements. Analyzing constraints for ${profile.orgName}...`, timestamp: new Date().toLocaleTimeString(), status: "success" });
      logs.push({ id: "log_4", agentName: "Checklist Agent", message: "Mapping task milestones and compile document requirements...", timestamp: new Date().toLocaleTimeString(), status: "success" });
      logs.push({ id: "log_5", agentName: "Drafting Agent", message: "Writing customized starter drafts and outline guidelines based on profile text...", timestamp: new Date().toLocaleTimeString(), status: "success" });
      logs.push({ id: "log_6", agentName: "Review Agent", message: "Assessing performance risks, compliance pitfalls, and crafting final strategy metrics...", timestamp: new Date().toLocaleTimeString(), status: "success" });
      logs.push({ id: "log_7", agentName: "Coordinator", message: "Coordinated agent workspace analysis successfully concluded. Dashboard hydrated.", timestamp: new Date().toLocaleTimeString(), status: "success" });

      const fakeResponse = getFallbackAnalysis(profile, grantTitle, grantText);
      return res.json({
        ...fakeResponse,
        agentLogs: logs,
        isSimulation: true
      });
    }

    // Live AI Mode: We execute actual GoogleGenAI API query!
    const ai = getGenAI();

    // Construct the joint multi-agent evaluation prompt
    const systemPrompt = `You are the Coordinator of a Multi-Agent Grant Proposal Team consisting of specialist agents:
1. Research Agent: Deciphers the grant guidelines, seeking exact requirements, total budget thresholds, focus fields, eligibility rules, and dates.
2. Eligibility Agent: Reviews the applicant organization's profile and objectively assesses alignment, providing a score (0 to 100), key pros of fit, critical con points (mismatches, eligibility hurdles), and action suggestions (mitigations).
3. Checklist Agent: Creates a logical timeline of preparation steps leading up to the deadline based on dates found, and lists all mandatory support files (e.g., IRS tax, project narrative) with helpful user tips.
4. Drafting Agent: Crafts highly customized, realistic, complete starter draft proposals for required sections based specifically on the applicant's real-world details (incorporating their name, location, and description, never generic placeholders).
5. Review Agent: Conducts compliance and audit risk screening, detailing critical materials the applicant did not explicitly provide, budget warnings, and an overall implementation recommendation.

Below is the user's organization profile:
- Organization Name: ${profile.orgName}
- Organization Type: ${profile.orgType} (e.g. nonprofit, student_group, community association, or individual)
- Location: ${profile.location}
- Annual Operating Budget: $${profile.annualBudget}
- Target Audience/Population: ${profile.targetPopulation}
- Project Narrative: ${profile.projectDescription}
- Funding Amount Requested: $${profile.requestedAmount}
- Has previous grants? ${profile.hasPreviousGrants ? "Yes" : "No"}

Below is the Grant Opportunity details:
- Stated Title (could be custom): ${grantTitle || "Unspecified Grand Scheme"}
- Provided guidelines and text:
${grantText}

Your task is to coordinate these specialists and return a highly detailed, comprehensive joint consensus report following the JSON schema. Be extremely specific, detailed, and write custom narratives in your responses.`;

    // Make the content call
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Formulate the multi-agent consensus report for our grant application.",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            research: {
              type: Type.OBJECT,
              properties: {
                funderName: { type: Type.STRING },
                grantName: { type: Type.STRING },
                summary: { type: Type.STRING },
                fundingAmountRange: { type: Type.STRING },
                matchingFundsRequired: { type: Type.STRING },
                deadlineDate: { type: Type.STRING },
                keyDatesStr: { type: Type.STRING },
                eligibilityMandates: { type: Type.ARRAY, items: { type: Type.STRING } },
                focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["funderName", "grantName", "summary", "fundingAmountRange", "matchingFundsRequired", "deadlineDate", "keyDatesStr", "eligibilityMandates", "focusAreas"]
            },
            eligibility: {
              type: Type.OBJECT,
              properties: {
                alignmentScore: { type: Type.INTEGER },
                eligibilityStatus: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                mitigations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["alignmentScore", "eligibilityStatus", "pros", "cons", "mitigations"]
            },
            checklist: {
              type: Type.OBJECT,
              properties: {
                milestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      desc: { type: Type.STRING },
                      daysBeforeDeadline: { type: Type.INTEGER }
                    },
                    required: ["title", "desc", "daysBeforeDeadline"]
                  }
                },
                requiredDocuments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      required: { type: Type.BOOLEAN },
                      hint: { type: Type.STRING }
                    },
                    required: ["name", "required", "hint"]
                  }
                }
              },
              required: ["milestones", "requiredDocuments"]
            },
            drafting: {
              type: Type.OBJECT,
              properties: {
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      sectionTitle: { type: Type.STRING },
                      objective: { type: Type.STRING },
                      guidelines: { type: Type.STRING },
                      tailoredDraft: { type: Type.STRING }
                    },
                    required: ["id", "sectionTitle", "objective", "guidelines", "tailoredDraft"]
                  }
                }
              },
              required: ["sections"]
            },
            review: {
              type: Type.OBJECT,
              properties: {
                missingInfoFlags: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      priority: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["item", "priority", "explanation"]
                  }
                },
                fundingRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                complianceChecks: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedStrategy: { type: Type.STRING }
              },
              required: ["missingInfoFlags", "fundingRisks", "complianceChecks", "recommendedStrategy"]
            }
          },
          required: ["research", "eligibility", "checklist", "drafting", "review"]
        }
      }
    });

    const bodyText = response.text || "{}";
    const parsedData = JSON.parse(bodyText.trim());

    // Update active logs with success
    logs[1].status = "success";
    logs[1].message = "Deciphered grant criteria, funding lines and key limits successfully.";
    logs.push({ id: "log_3", agentName: "Eligibility Agent", message: "Evaluated applicant compliance score, pros, and primary mitigations.", timestamp: new Date().toLocaleTimeString(), status: "success" });
    logs.push({ id: "log_4", agentName: "Checklist Agent", message: "Parsed important milestones schedule and mapped requested attachments checklist.", timestamp: new Date().toLocaleTimeString(), status: "success" });
    logs.push({ id: "log_5", agentName: "Drafting Agent", message: "Authored 3 highly tailored project narrative outlines incorporating exact project descriptions.", timestamp: new Date().toLocaleTimeString(), status: "success" });
    logs.push({ id: "log_6", agentName: "Review Agent", message: "Concluded risk vetting, and drafted final strategy guidelines.", timestamp: new Date().toLocaleTimeString(), status: "success" });
    logs.push({ id: "log_7", agentName: "Coordinator", message: "Consolidated agent findings successfully. Launchpad fully loaded.", timestamp: new Date().toLocaleTimeString(), status: "success" });

    res.json({
      ...parsedData,
      agentLogs: logs,
      isSimulation: false
    });
  } catch (error: any) {
    console.error("Gemini Multi-Agent Execution Error:", error);
    
    // In case of actual system failures but with key set, return localized helpful warnings or fallback
    const fallback = getFallbackAnalysis(profile, grantTitle, grantText);
    
    res.json({
      ...fallback,
      agentLogs: [
        { id: "e_1", agentName: "Coordinator", message: `Live API call error: ${error.message || "Request Limit/Credential issue"}. Switched elegantly to simulator fallback engine.`, timestamp: new Date().toLocaleTimeString(), status: "error" },
        ...logs.slice(1)
      ],
      isSimulation: true,
      apiError: error.message || "Unknown error"
    });
  }
});

// Configure Vite integration inside custom server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GrantGuide Agent server active at http://localhost:${PORT}`);
  });
}

startServer();
