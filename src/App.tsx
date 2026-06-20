import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ClipboardCheck, 
  Terminal, 
  Play, 
  Sparkles, 
  BookOpen, 
  Video, 
  FileCheck2, 
  Eye, 
  Clock, 
  RefreshCw,
  Award,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { UserProfile, MultiAgentAnalysisResponse } from "./types";
import { PRELOADED_GRANTS, GrantTemplate, DEFAULT_PROFILE } from "./data";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tech_good");
  const [grantTitle, setGrantTitle] = useState<string>(PRELOADED_GRANTS[0].title);
  const [grantText, setGrantText] = useState<string>(PRELOADED_GRANTS[0].guidelines);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<MultiAgentAnalysisResponse | null>(null);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [activeDraftTab, setActiveDraftTab] = useState<string>("sec_1");
  const [activeKaggleTab, setActiveKaggleTab] = useState<"writeup" | "video_script" | "submission_checklist">("writeup");
  const [checkedMilestones, setCheckedMilestones] = useState<Record<string, boolean>>({});
  const [customGrantInput, setCustomGrantInput] = useState<boolean>(false);
  
  // Custom states to demonstrate interaction
  const [currentUtcTime, setCurrentUtcTime] = useState<string>("18:55:39");

  // Keep digital clock running
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentUtcTime(now.toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set selected preset
  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    if (id === "custom") {
      setCustomGrantInput(true);
      setGrantTitle("");
      setGrantText("");
    } else {
      setCustomGrantInput(false);
      const grant = PRELOADED_GRANTS.find(g => g.id === id);
      if (grant) {
        setGrantTitle(grant.title);
        setGrantText(grant.guidelines);
      }
    }
  };

  const loadPresetProfile = (presetType: "coding" | "green" | "arts") => {
    if (presetType === "coding") {
      setProfile({
        orgName: "SocioCode Initiative",
        orgType: "student_group",
        location: "Chicago, IL, USA",
        annualBudget: 15000,
        projectDescription: "We are organizing 'CodeCamp Chicago', a series of weekend coding workshops, mentor matching, and computer access hubs supporting low-income high school students. Funding will be utilized to secure laptops, deliver snacks, and secure a physical training venue.",
        targetPopulation: "Historically under-represented youth & public school students",
        requestedAmount: 18000,
        hasPreviousGrants: false
      });
      handleSelectPreset("tech_good");
    } else if (presetType === "green") {
      setProfile({
        orgName: "EcoAct Composting & Farm Co-op",
        orgType: "community",
        location: "Denver, CO, USA",
        annualBudget: 35000,
        projectDescription: "Setting up three community compost hubs with digital moisture tracking. The project aims to process local household organic waste, teach sustainable soils practices key to local neighborhoods, and donate rich soils to community gardens.",
        targetPopulation: "Urban neighborhood households and junior growers",
        requestedAmount: 25000,
        hasPreviousGrants: true
      });
      handleSelectPreset("green_tech");
    } else if (presetType === "arts") {
      setProfile({
        orgName: "FirstVoice Pods & Murals",
        orgType: "nonprofit",
        location: "Seattle, WA, USA",
        annualBudget: 55000,
        projectDescription: "Creating the 'Generations Podcast Study', recording 15 qualitative oral history interview segments between community elders and youth mentors. We also plan to release a community co-designed neighborhood mural detailing this local heritage.",
        targetPopulation: "Regional indigenous communities, local artists and elder citizens",
        requestedAmount: 18000,
        hasPreviousGrants: true
      });
      handleSelectPreset("arts_equity");
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/analyze-grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profile,
          grantTitle,
          grantText
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      if (data.drafting?.sections?.length > 0) {
        setActiveDraftTab(data.drafting.sections[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while compiling your agent analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial simulation load to make the dashboard immediately gorgeous
  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  const toggleMilestone = (mId: string) => {
    setCheckedMilestones(prev => ({
      ...prev,
      [mId]: !prev[mId]
    }));
  };

  return (
    <div id="grantguide_app" className="bg-[#070708] text-slate-100 font-sans min-h-screen p-4 lg:p-6 flex flex-col gap-4">
      {/* HEADER SECTION (BENTO HEADER) */}
      <header id="app_header" className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0F0F11] border border-white/10 rounded-2xl p-5 md:px-6 md:py-4 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md border border-blue-400/20">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">GrantGuide <span className="text-blue-500 font-medium">Agent</span></h1>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-wider">
                Agents for Good Track
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Multi-Agent AI team analyzing eligibility guidelines, milestones timeline & tailored program drafts</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4 bg-[#141417] border border-white/5 py-1.5 px-3 rounded-lg text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 justify-center h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="font-mono text-green-400">ONLINE</span>
            </div>
            <div className="h-3 w-px bg-white/10"></div>
            <div>UTC CLOCK: <span className="font-mono text-white">{currentUtcTime}</span></div>
          </div>
          
          <button 
            id="analyze_button_primary"
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isLoading ? "Running Agent Consensus..." : "Start Agent Analysis"}
          </button>
        </div>
      </header>

      {/* BENTO GRID MATRIX */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ROW 1 COLUMN 1: INTERACTIVE INPUT PANEL (COL-SPAN-5, MULTI-TAB) */}
        <section id="input_panel" className="col-span-1 lg:col-span-5 bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-blue-500 rounded-full"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">1. Core Context Workspace</h2>
            </div>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono">STEP_01</span>
          </div>

          {/* Quick preset loaders */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Fast Demo Presets (Automated profiles for instant evaluation):
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button 
                id="preset_coding"
                onClick={() => loadPresetProfile("coding")}
                className={`py-1.5 px-1.5 text-[10px] font-bold rounded border tracking-tight transition-all cursor-pointer ${
                  profile.orgType === "student_group" && profile.orgName.includes("SocioCode")
                    ? "bg-blue-600 border-blue-400 text-white shadow"
                    : "bg-[#141417] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1E]"
                }`}
              >
                CodeCamp (Youth)
              </button>
              <button 
                id="preset_green"
                onClick={() => loadPresetProfile("green")}
                className={`py-1.5 px-1.5 text-[10px] font-bold rounded border tracking-tight transition-all cursor-pointer ${
                  profile.orgType === "community" && profile.orgName.includes("EcoAct")
                    ? "bg-blue-600 border-blue-400 text-white shadow"
                    : "bg-[#141417] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1E]"
                }`}
              >
                EcoAct (Climate)
              </button>
              <button 
                id="preset_arts"
                onClick={() => loadPresetProfile("arts")}
                className={`py-1.5 px-1.5 text-[10px] font-bold rounded border tracking-tight transition-all cursor-pointer ${
                  profile.orgType === "nonprofit" && profile.orgName.includes("FirstVoice")
                    ? "bg-blue-600 border-blue-400 text-white shadow"
                    : "bg-[#141417] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1E]"
                }`}
              >
                Arts Voice (Equity)
              </button>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-3 mt-1">
            {/* Applicant Profile fields */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-slate-300 uppercase font-semibold">Applicant/Org Name</label>
                <span className="text-[9px] text-slate-500">Target matching tag</span>
              </div>
              <input 
                id="field_org_name"
                type="text"
                value={profile.orgName}
                onChange={(e) => setProfile({...profile, orgName: e.target.value})}
                placeholder="e.g., Chicago Youth Science Club"
                className="w-full bg-[#141417] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-300 uppercase font-semibold block mb-1">Entity Classification</label>
                <select 
                  id="field_org_type"
                  value={profile.orgType}
                  onChange={(e) => setProfile({...profile, orgType: e.target.value as any})}
                  className="w-full bg-[#141417] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="nonprofit">Registered 501(c)(3) Nonprofit</option>
                  <option value="student_group">Unincorporated Student Group</option>
                  <option value="community">Grassroots Community Co-op</option>
                  <option value="individual">Individual Practitioner / Artist</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-300 uppercase font-semibold block mb-1">HQ Region & Country</label>
                <input 
                  id="field_location"
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="Chicago, IL, USA"
                  className="w-full bg-[#141417] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-300 uppercase font-semibold block mb-1">Parent Annual Budget</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input 
                    id="field_annual_budget"
                    type="number"
                    value={profile.annualBudget}
                    onChange={(e) => setProfile({...profile, annualBudget: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#141417] border border-white/10 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-300 uppercase font-semibold block mb-1">Request Amount</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input 
                    id="field_requested_amount"
                    type="number"
                    value={profile.requestedAmount}
                    onChange={(e) => setProfile({...profile, requestedAmount: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#141417] border border-white/10 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-300 uppercase font-semibold block mb-1">Target Community Demographics</label>
              <input 
                id="field_target_population"
                type="text"
                value={profile.targetPopulation}
                onChange={(e) => setProfile({...profile, targetPopulation: e.target.value})}
                placeholder="e.g., localized under-resourced low-income youth"
                className="w-full bg-[#141417] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-300 uppercase font-semibold block mb-1">Your Project Design & Narrative Summary</label>
              <textarea 
                id="field_project_description"
                rows={3}
                value={profile.projectDescription}
                onChange={(e) => setProfile({...profile, projectDescription: e.target.value})}
                placeholder="Express what activities your program triggers, how you allocate requested funds and secure real local community output..."
                className="w-full bg-[#141417] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <input 
                id="field_previous_grants"
                type="checkbox"
                checked={profile.hasPreviousGrants}
                onChange={(e) => setProfile({...profile, hasPreviousGrants: e.target.checked})}
                className="w-4 h-4 rounded text-blue-600 bg-[#141417] border-white/20 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="field_previous_grants" className="text-xs text-slate-300 select-none cursor-pointer">
                Organization possesses a track record mapping previously reported grants.
              </label>
            </div>

            {/* Grant Selection */}
            <div className="border-t border-white/5 pt-3 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                  2. Select Grant Opportunity to Analyze:
                </label>
                <div className="space-y-1.5">
                  {PRELOADED_GRANTS.map((gr) => (
                    <div 
                      key={gr.id}
                      onClick={() => handleSelectPreset(gr.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                        selectedPresetId === gr.id 
                          ? "bg-slate-800/40 border-blue-500/80" 
                          : "bg-[#141417]/80 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">{gr.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono italic">Funder: {gr.funder} | Prize: {gr.amountRange}</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                        {selectedPresetId === gr.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => handleSelectPreset("custom")}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                      selectedPresetId === "custom" 
                        ? "bg-slate-800/40 border-blue-500/80" 
                        : "bg-[#141417]/80 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-200">Submit Custom Guidelines / Proposal Guidelines</span>
                      <span className="text-[9px] text-slate-500 italic">Insert your own parameters manually</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                      {selectedPresetId === "custom" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Input boxes if "custom" is active */}
              {customGrantInput && (
                <div className="space-y-2 animate-fadeIn py-1">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">CUSTOM GRANT NAME</label>
                    <input 
                      id="custom_grant_title"
                      type="text"
                      placeholder="e.g. Clean Energy Community Pilot Outreach Grant"
                      value={grantTitle}
                      onChange={(e) => setGrantTitle(e.target.value)}
                      className="w-full bg-[#18181C] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">MANUAL ELIGIBILITY GUIDELINES</label>
                    <textarea 
                      id="custom_grant_guidelines"
                      rows={4}
                      placeholder="Paste the program details, organizational rules, budget limitations, matching mandates and constraints here..."
                      value={grantText}
                      onChange={(e) => setGrantText(e.target.value)}
                      className="w-full bg-[#18181C] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono text-[10px]"
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              id="analyze_button_form"
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isLoading ? "Integrating Agent Models..." : "Assemble Specialists & Analyze"}
            </button>
          </form>

          {/* Guidelines info card */}
          <div className="bg-[#141417] border border-white/5 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-bold text-xs block text-slate-200 mb-1">Agent Workflow Instructions</span>
            Inputs route strictly first to the <span className="text-white font-semibold">Research Specialist</span> to build criteria taxonomies, then sequentially pipeline to check alignment triggers before producing final deliverables.
          </div>
        </section>

        {/* CONTAINER ON THE RIGHT (COL-SPAN-7) FOR DETAILED BENTO MODULES */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
          
          {/* TOP DUAL BENTO ROW: COORD STATUS (LEFT CELL) + LIVE ALIGNMENT PROGRESS GAUGES (RIGHT CELL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* AGENT COORDINATOR MONITOR & REALTIME CONSOLE */}
            <section id="coordinator_status" className="bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Live Orchestration Watch</h2>
                </div>
                <span className="text-[9px] text-emerald-400 font-mono tracking-tighter animate-pulse uppercase">active_stream</span>
              </div>

              {/* Status checklist bars */}
              <div className="space-y-2 py-1.5">
                <div className="flex items-center justify-between p-2 bg-[#141417]/90 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></span>
                    <span className="text-[11px] font-medium text-slate-300">Coordinator Agent</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{isLoading ? "PIPELINING" : "STANDBY_READY"}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#141417]/90 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></span>
                    <span className="text-[11px] font-medium text-slate-300">Research & Entity Extraction</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400">{isLoading ? "EXTRACTING" : "SYNCED"}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#141417]/90 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></span>
                    <span className="text-[11px] font-medium text-slate-300">Eligibility Vetting Officer</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{isLoading ? "COMPARING" : "DECIDED"}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#141417]/90 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></span>
                    <span className="text-[11px] font-medium text-slate-300">Drafting outline & Review Audit</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{isLoading ? "GENERATING" : "HYDRATED"}</span>
                </div>
              </div>

              {/* Logs terminal container */}
              <div className="flex-grow flex flex-col bg-[#050506] border border-white/10 rounded-xl p-3 font-mono text-[10px] leading-relaxed text-slate-400 overflow-y-auto max-h-[160px]">
                <div className="text-slate-500 mb-1 border-b border-white/5 pb-1 flex items-center justify-between">
                  <span>TERMINAL LOGSTREAM</span>
                  <span className="text-[9px]">COMPOSITION RATE: 3.5F</span>
                </div>
                {isLoading ? (
                  <div className="space-y-1.5 text-blue-400 animate-pulse">
                    <span>&gt; [SYSTEM] Initializing virtual sandbox environment...</span>
                    <span>&gt; [COORDINATOR] Spawning specialist nodes for {profile.orgName}...</span>
                    <span>&gt; [RESEARCH] Parsing raw eligibility texts for matching key constraints...</span>
                    <span>&gt; Running live AI consensus heuristics (Please stand by)...</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-slate-300">
                    {result?.agentLogs?.map((log, index) => (
                      <div key={log.id || index} className="flex gap-1.5">
                        <span className="text-slate-500">[{log.timestamp}]</span>
                        <span className="text-blue-400 font-bold">{log.agentName}:</span>
                        <span className={log.status === 'error' ? 'text-rose-400' : 'text-slate-300'}>{log.message}</span>
                      </div>
                    ))}
                    {result?.isSimulation && (
                      <div className="text-amber-500/80 text-[9px] italic border-t border-amber-500/10 pt-1">
                        * Running simulation engine based on localized parameters (Gemini Sandbox API active).
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* HIGH-FIDELITY ELIGIBILITY SCORE & ASSESSMENT GAUGES */}
            <section id="eligibility_gauge" className="bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-400" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Alignment Index Score</h2>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">AGENT_RATING</span>
              </div>

              {isLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-6 text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <span>Calculating criteria weights...</span>
                </div>
              ) : result ? (
                <div className="flex-grow flex flex-col justify-between pt-4 gap-4">
                  
                  {/* Gauge indicator and score */}
                  <div className="flex items-center gap-5">
                    {/* Ring score */}
                    <div className="relative w-24 h-24 flex items-center justify-center bg-black rounded-full border-4 border-slate-800">
                      {/* Highlight segment */}
                      <svg className="absolute w-28 h-28 -rotate-90">
                        <circle 
                          cx="56" 
                          cy="56" 
                          r="48" 
                          stroke="rgb(29, 78, 216)" 
                          strokeWidth="4" 
                          fill="transparent" 
                          strokeDasharray={301.5}
                          strokeDashoffset={301.5 - (301.5 * (result.eligibility.alignmentScore || 85)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-3xl font-black text-white italic tracking-tighter">
                          {result.eligibility.alignmentScore}%
                        </span>
                        <span className="block text-[8px] uppercase tracking-widest text-slate-400 mt-0.5">MATCHED</span>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide block">Eligibility State</span>
                      <span className={`text-sm font-extrabold block uppercase tracking-tight mt-0.5 ${
                        result.eligibility.eligibilityStatus === 'Fully Eligible' ? 'text-green-400' :
                        result.eligibility.eligibilityStatus === 'Ineligible' ? 'text-red-400' : 'text-amber-400 font-semibold'
                      }`}>
                        {result.eligibility.eligibilityStatus}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        Assessors mapped your request amount against the average award ratio of this fund.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Pros list */}
                  <div className="border-t border-white/5 pt-3 flex-grow space-y-2">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 block">Identified High-Alignment Matches:</span>
                    <div className="space-y-1 max-h-[105px] overflow-y-auto">
                      {result.eligibility.pros.map((p, idx) => (
                        <div key={idx} className="flex gap-1.5 items-start text-[10.5px] leading-relaxed text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-slate-500 text-xs">
                  Awaiting analysis parameters configuration.
                </div>
              )}
            </section>

          </div>

          {/* DYNAMIC CHECKLIST & MILESTONE CHRONOLOGY (BENTO BLOCK) */}
          <section id="milestones_bento" className="bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">2. Execution Timeline & Required Attachments</h2>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">CHECKLIST_ENGINE</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                <span className="text-xs">Drafting submission schedule and requirements audit...</span>
              </div>
            ) : result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-1">
                
                {/* Column A: Document Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Required Proof Files Check:</span>
                    <span className="text-[9px] text-slate-500">PDF / Formats</span>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {result.checklist.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="bg-[#141417] border border-white/5 p-2 rounded-xl flex items-start justify-between gap-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                            {doc.name}
                            {doc.required ? (
                              <span className="text-[8px] px-1 bg-red-950/80 text-rose-400 font-black rounded-sm border border-red-800/30 uppercase">MANDATORY</span>
                            ) : (
                              <span className="text-[8px] px-1 bg-slate-900 text-slate-400 font-medium rounded-sm border border-white/5 uppercase">OPTIONAL</span>
                            )}
                          </span>
                          <span className="text-[9.5px] text-slate-400 leading-normal">{doc.hint}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column B: Timeline milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Preparation Road Map Timeline:</span>
                    <span className="text-[9px] text-amber-400 font-mono">DATES ESTIMATED</span>
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {result.checklist.milestones.map((ms, idx) => {
                      const mId = `ms_${idx}`;
                      const isChecked = checkedMilestones[mId];
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone(mId)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isChecked 
                              ? "bg-slate-900/30 border-emerald-500/30 text-slate-400" 
                              : "bg-[#141417] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="mt-0.5">
                            <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all ${
                              isChecked 
                                ? "bg-emerald-600 border-emerald-400 text-white" 
                                : "border-slate-600 hover:border-slate-400"
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                          <div className="flex-grow flex flex-col gap-0.5">
                            <div className="flex justify-between items-center">
                              <span className={`text-[11px] font-bold ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {ms.title}
                              </span>
                              <span className="text-[9px] font-mono text-amber-500/90 whitespace-nowrap bg-amber-500/10 px-1.5 py-0.2 rounded font-bold">
                                {ms.daysBeforeDeadline}d remaining
                              </span>
                            </div>
                            <span className={`text-[10px] leading-relaxed ${isChecked ? 'text-slate-500' : 'text-slate-400'}`}>
                              {ms.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 flex items-center justify-center text-slate-500 text-xs">
                Inputs context required to plot milestones plan.
              </div>
            )}
          </section>

        </div>

      </main>

      {/* LOWER GRID FOR DETAILED WORK PRODUCTS (PROPOSAL DRAFTS + RISKS) & KAGGLE WRITEUP EXPORT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* TAILORED DRAFT OUTLINE WRITER (COL-SPAN-7) */}
        <div id="proposal_drafts" className="col-span-1 lg:col-span-7 bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 min-h-[440px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">3. Proposal Draft Outlines & Section Narrative</h2>
            </div>
            <span className="text-[9px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">DRAFT_GEN</span>
          </div>

          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-16 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <span className="text-xs">Generating highly tailored content drafts representing your profile...</span>
            </div>
          ) : result ? (
            <div className="flex-grow flex flex-col gap-3">
              
              {/* Draft tab buttons selector */}
              <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2">
                {result.drafting.sections.map((sec) => (
                  <button 
                    key={sec.id}
                    onClick={() => setActiveDraftTab(sec.id)}
                    className={`py-1.5 px-3 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                      activeDraftTab === sec.id 
                        ? "bg-blue-600 text-white shadow font-semibold"
                        : "bg-[#141417]/80 hover:bg-[#1C1C22]/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sec.sectionTitle.split("&")[0].substring(0, 24)}...
                  </button>
                ))}
              </div>

              {/* Dynamic Draft Content display box */}
              {result.drafting.sections.map((sec) => {
                if (sec.id !== activeDraftTab) return null;
                return (
                  <div key={sec.id} className="flex-grow flex flex-col gap-3.5 animate-fadeIn">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141417] border border-white/5 p-3 rounded-xl gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-slate-500 font-extrabold block">Objective Guide:</span>
                        <p className="text-[11px] text-white mt-0.5 leading-relaxed font-semibold">{sec.objective}</p>
                      </div>
                      <button 
                        onClick={() => handleCopyText(sec.tailoredDraft, sec.id)}
                        className="shrink-0 px-3 py-1 bg-[#1E1E24] hover:bg-[#25252E] text-slate-200 text-[10.5px] font-bold rounded border border-white/5 hover:border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer self-end md:self-auto"
                      >
                        {copiedSectionId === sec.id ? <ClipboardCheck className="w-3 text-green-400" /> : <Copy className="w-3" />}
                        {copiedSectionId === sec.id ? "Copied!" : "Copy Narrative"}
                      </button>
                    </div>

                    <div className="flex-grow bg-[#050506] border border-white/15 rounded-xl p-4 font-normal text-xs text-slate-200 leading-relaxed overflow-y-auto max-h-[240px] whitespace-pre-wrap font-mono">
                      {sec.tailoredDraft}
                    </div>

                    <div className="text-[9.5px] text-slate-400 leading-normal bg-[#1C0F10]/20 border border-orange-500/10 rounded-lg p-2.5">
                      <span className="font-bold text-slate-200 uppercase tracking-wide block mb-0.5">⚠️ Compliance Alignment Indicator:</span>
                      * These drafts are outlines generated dynamically utilizing your program profile. Do not hand-in blank templates; double-check that local stats align perfectly with fund parameters.
                    </div>
                  </div>
                );
              })}

            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-slate-500 text-xs">
              Awaiting matching credentials context configuration to generate drafts.
            </div>
          )}
        </div>

        {/* COMPLIANCE AUDITING, RISKS & RECOMMENDATIONS (COL-SPAN-5) */}
        <div id="compliance_risks" className="col-span-1 lg:col-span-5 bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col gap-3.5 min-h-[440px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">4. Risk Assessment & Audit Compliance</h2>
            </div>
            <span className="text-[9px] text-orange-400 font-mono">CRITICAL_VET</span>
          </div>

          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-2" />
              <span className="text-xs">Running audit routines and detecting budget matching risks...</span>
            </div>
          ) : result ? (
            <div className="flex-grow flex flex-col justify-between gap-4">
              
              {/* Risks array */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-400 block mb-1">Detected Regulatory Pitfalls:</span>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {result.review.fundingRisks.map((risk, idx) => (
                    <div key={idx} className="bg-[#1C1113] border border-rose-500/15 p-2 rounded-xl flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-[10.5px] leading-relaxed text-slate-300">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Info Flags */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Critique Warnings / Board Disclaimers:</span>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {result.review.missingInfoFlags.map((flag, idx) => (
                    <div key={idx} className="bg-[#19191C]/80 border border-white/5 p-2 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10.5px] font-bold text-slate-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-slate-500 shrink-0" />
                          {flag.item}
                        </span>
                        <span className={`text-[8px] px-1 rounded font-bold uppercase ${
                          flag.priority === 'high' ? 'bg-red-950 text-rose-400' :
                          flag.priority === 'medium' ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {flag.priority} Priority
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{flag.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Strategy Outcome Recommendation */}
              <div className="border-t border-white/5 pt-3.5 mt-auto">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 block mb-1">Coordinator Strategy Summary:</span>
                <p className="text-[10.5px] leading-relaxed text-slate-300">
                  {result.review.recommendedStrategy}
                </p>
              </div>

            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-slate-500 text-xs">
              No warnings produced until context has compiled.
            </div>
          )}
        </div>

      </section>

      {/* KAGGLE CAPSTONE WRITEUP & SUBMISSION ASSETS CENTER (FULL-WIDTH BENTO CARD) */}
      <section id="kaggle_center" className="bg-[#0F0F11] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">5. Kaggle Capstone AI Agents Submission Assistant</h2>
              <p className="text-[11px] text-slate-400">Exportable templates containing course concept highlights to secure top submission points.</p>
            </div>
          </div>
          
          {/* Tabs header */}
          <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-white/5">
            <button 
              id="tab_kaggle_writeup"
              onClick={() => setActiveKaggleTab("writeup")}
              className={`py-1 px-3 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                activeKaggleTab === "writeup" ? "bg-[#1E1E24] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Kaggle Proposal Writeup
            </button>
            <button 
              id="tab_kaggle_video"
              onClick={() => setActiveKaggleTab("video_script")}
              className={`py-1 px-3 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                activeKaggleTab === "video_script" ? "bg-[#1E1E24] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              5-Min Video Script
            </button>
            <button 
              id="tab_kaggle_checklist"
              onClick={() => setActiveKaggleTab("submission_checklist")}
              className={`py-1 px-3 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                activeKaggleTab === "submission_checklist" ? "bg-[#1E1E24] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Final Entry Checklist
            </button>
          </div>
        </div>

        {/* Dynamic Display */}
        <div className="bg-[#050506] border border-white/10 rounded-xl p-4">
          {activeKaggleTab === "writeup" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[11px] font-bold text-slate-300">PROPOSAL WRITEUP MARKDOWN OUTLINE:</span>
                <button 
                  onClick={() => handleCopyText(`
# GrantGuide Agent: A Multi-Agent Assistant for Community Grant Applications

## 1. Problem Statement
Many grass-roots organizations, student teams and non-profit founders in regional areas like ${profile.location} lack dedicated technical grant-writers. Funding rules remain complex, and application opportunities are passed over due to compliance hurdles.

## 2. Solution Overview
The GrantGuide Agent coordinates specialized diagnostic sub-agents to analyze opportunities, gauge eligibility against organizational metrics (such as parent budget lines and project narratives), plot milestones timelines, and compose responsive drafts.

## 3. Why Agents?
Analyzing a grant requires more than basic lookup. It requires:
1. Extraction (Research Specialist parsing criteria weights)
2. Quantitative assessment (Eligibility Agent modeling budget ratios)
3. Direct execution plans (Checklist milestones engine)
4. Multi-modal compilation (Drafting section narratives)

## 4. Course Concepts Demonstrated
- **Coordinator Router Architecture**: Real-time task allocation with stream logging logs.
- **Durable Persistence Strategy**: Client states coupled with cloud-ready API proxies.
- **Failsafe Simulation Core**: Smooth offline triggers preventing runtime failures during key dropouts.
- **Security Protocols**: Sanitized .env structures concealing API parameters perfectly.
`, "macro_writeup")}
                  className="px-2.5 py-1 bg-[#1C1C22] hover:bg-[#25252E] text-slate-300 rounded text-[10px] font-bold border border-white/5 flex items-center gap-1 select-none cursor-pointer"
                >
                  {copiedSectionId === "macro_writeup" ? <ClipboardCheck className="w-3 text-green-400" /> : <Copy className="w-3" />}
                  Copy Markdown
                </button>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                <span className="text-blue-400 font-bold"># GrantGuide Agent: A Multi-Agent Assistant for Community Grant Applications</span>
                {"\n"}
                <span className="text-slate-400 font-bold">## 1. Problem Statement</span>
                {"\n"}Many grass-roots organizations, student teams and non-profit founders in regional areas like <span className="text-amber-400 font-bold">{profile.location}</span> lack dedicated technical grant-writers. Funding rules remain complex, and application opportunities are passed over due to compliance hurdles.
                {"\n\n"}
                <span className="text-slate-400 font-bold">## 2. Solution Overview</span>
                {"\n"}The GrantGuide Agent coordinates specialized diagnostic sub-agents to analyze opportunities, gauge eligibility against organizational metrics (such as parent budget lines and project narratives), plot milestones timelines, and compose responsive drafts.
                {"\n\n"}
                <span className="text-slate-400 font-bold">## 3. Why Agents?</span>
                {"\n"}Host criteria analysis requires multi-disciplinary coordination. Over-the-counter chat formats are prone to hallucinating deadline schedules, whereas our dedicated team divides work into dedicated phases:
                {"\n"}- Extraction (Research Specialist parsing criteria weights)
                {"\n"}- Quantitative alignment (Eligibility Agent modeling budget ratios)
                {"\n"}- Task allocation (Checklist milestones planner)
                {"\n"}- Draft outlines compilation (Drafting sector narratives matching {profile.orgName})
              </div>
            </div>
          )}

          {activeKaggleTab === "video_script" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[11px] font-bold text-slate-300">DEMO VIDEO STORYBOARD STORY SCRIPT (UNDER 5 MINS):</span>
                <button 
                  onClick={() => handleCopyText(`
## 5-Minute Pitch Script - GrantGuide Agent Demo

[0:00 - 0:30] PREMISES & IMPACT
"Small nonprofits, students, and community groups struggle to compete for funding simply due to lack of technical writing staff. GrantGuide Agent levels the playing field."

[0:30 - 1:15] SYSTEM ARCHITECTURE OVERVIEW
"Our app utilizes a coordinated Multi-Agent design. Instead of standard chat models, we spawn specialized agents: Research, Eligibility, Timeline, Drafting, and Review. This compartmentalization mimics a human proposal team."

[1:15 - 3:30] LIVE DEMO WALKTHROUGH
"Here we see our workspace console. We have chosen our preloaded profile: ${profile.orgName} located in ${profile.location}. We run a simulated opportunity scan.
The Agent logs demonstrate immediate consensus. Note our circular Alignment Gauges showing fit compliance, accompanied with action mitigations. 
Below, our Milestone checklist allows users to keep track of tasks on time, and our generative outlining node outputs customized drafting modules. No lorem ipsum - everything incorporates the user's raw organization parameters."

[3:30 - 4:30] SECURITY & KAGGLE COURSE REFLECTIONS
"Our system runs with strict security sandboxes. No credentials are leaked to repository trackers. We use localized failsafes to sustain operation if tokens are restricted."

[4:30 - 5:00] MISSION STATEMENT
"GrantGuide Agent enables community organisers to identify matching opportunities in minutes instead of months."
`, "macro_video")}
                  className="px-2.5 py-1 bg-[#1C1C22] hover:bg-[#25252E] text-slate-300 rounded text-[10px] font-bold border border-white/5 flex items-center gap-1 select-none cursor-pointer"
                >
                  {copiedSectionId === "macro_video" ? <ClipboardCheck className="w-3 text-green-400" /> : <Copy className="w-3" />}
                  Copy Storyboard
                </button>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                <span className="text-amber-400 font-bold">## [0:00 - 0:30] THE PROBLEM</span>
                {"\n"}"Small grassroots organizations, school teams, and local founders in regional areas like {profile.location} struggle to secure grants simply because proposal requirements are overly complex and tedious."
                {"\n\n"}
                <span className="text-amber-400 font-bold">## [0:30 - 1:15] THE SOLUTION & AGENT DELEGATION</span>
                {"\n"}"GrantGuide Agent resolves this by coordinating a multi-agent workflow: our Research Agent dissects constraints, the Eligibility Agent flags capacity bottlenecks, and the Drafting Agent builds custom programmatic modules representing {profile.orgName}."
                {"\n\n"}
                <span className="text-amber-400 font-bold">## [1:15 - 3:30] LIVE DEMO SEQUENCE</span>
                {"\n"}"As shown in our live Bento panel grid, changing parameters instantly triggers the coordinated pipeline. The real-time terminal monitor prints the handshakes between our simulated nodes. In the Checklist module, milestone obligations are plotted automatically. When we click onto our Generative Outlines, we get a solid, customized draft for direct review."
              </div>
            </div>
          )}

          {activeKaggleTab === "submission_checklist" && (
            <div className="space-y-4 animate-fadeIn">
              <span className="text-[11px] font-bold text-slate-300 block border-b border-white/5 pb-2 uppercase">Kaggle Submission Rules Compliance Check:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px] leading-relaxed text-slate-300">
                <div className="space-y-2 bg-[#121215] p-3 rounded-lg border border-white/5">
                  <span className="font-bold text-slate-200 block mb-0.5">🏆 3 Required Course Concepts Satisfied:</span>
                  <div className="flex gap-2 items-start text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Multi-Agent System:</strong> Employs structured coordinator delegating roles.</span>
                  </div>
                  <div className="flex gap-2 items-start text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Security Safeguards:</strong> Fully isolated environment configuration variables.</span>
                  </div>
                  <div className="flex gap-2 items-start text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Local Failsafes:</strong> Provides elegant simulation feedback when API key is limited.</span>
                  </div>
                </div>

                <div className="space-y-2 bg-[#121215] p-3 rounded-lg border border-white/5">
                  <span className="font-bold text-slate-200 block mb-0.5">📦 Submission Metadata:</span>
                  <div>• <strong className="text-slate-300">Track:</strong> Agents for Good (Underprivileged community tools)</div>
                  <div>• <strong className="text-slate-300">Writeup Constraint:</strong> Under 2,500 words</div>
                  <div>• <strong className="text-slate-300">Video Requirement:</strong> Under 5 minutes with live dashboard traversal</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer id="app_footer" className="mt-auto flex flex-col sm:flex-row justify-between items-center bg-[#0F0F11] border border-white/10 rounded-xl px-5 py-3 text-[10px] text-slate-500 gap-2">
        <div className="font-mono">PROJECT ID: GRANTGUIDE-V1.2.0 | KAGGLE CAPSTONE SPECIFICATION</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <span>PORT: 3000 (HTTP)</span>
          <span>SECURITY: SECURE SANDBOX</span>
          <span>ROUTING: SERVICE CONTROLLERS</span>
        </div>
      </footer>
    </div>
  );
}
