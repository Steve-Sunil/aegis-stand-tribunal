/**
 * Multi-Agent AI Candidate Assessment - Main Application Controller
 */

import { PRESET_CANDIDATES } from "./presets.js";
import { AGENT_DEFINITIONS, AgentManager } from "./agents.js";
import { ProfileBuilder } from "./profileBuilder.js";
import { DebateEngine } from "./debateEngine.js";
import { VoiceEngine } from "./voiceEngine.js";
import { DecisionEngine } from "./decisionEngine.js";

class AegisCouncilApp {
  constructor() {
    this.currentStep = 1;
    this.selectedCandidate = PRESET_CANDIDATES[0];
    this.sharedFactBase = null;
    this.isolatedOpinions = [];
    this.debateResult = null;
    this.finalDossier = null;
    this.voiceEngine = new VoiceEngine();

    this.llmConfig = {
      provider: localStorage.getItem("aegis_llm_provider") || "offline",
      apiKey: localStorage.getItem("aegis_llm_api_key") || "",
      useLiveLLM: localStorage.getItem("aegis_llm_provider") && localStorage.getItem("aegis_llm_provider") !== "offline"
    };

    this.initElements();
    this.initEvents();
    this.initVoiceEngine();
    this.renderPresets();
    this.loadCandidate(this.selectedCandidate);
  }

  initElements() {
    // Navigation tabs
    this.stepTabs = [
      document.getElementById("stepNav1"),
      document.getElementById("stepNav2"),
      document.getElementById("stepNav3"),
      document.getElementById("stepNav4"),
      document.getElementById("stepNav5")
    ];

    // Views
    this.stepViews = [
      document.getElementById("stepView1"),
      document.getElementById("stepView2"),
      document.getElementById("stepView3"),
      document.getElementById("stepView4")
    ];

    // Step 1 Elements
    this.presetGrid = document.getElementById("presetGrid");
    this.resumeInput = document.getElementById("resumeInput");
    this.transcriptInput = document.getElementById("transcriptInput");
    this.resumeWordCount = document.getElementById("resumeWordCount");
    this.transcriptWordCount = document.getElementById("transcriptWordCount");
    this.sharedFactBaseCard = document.getElementById("sharedFactBaseCard");
    this.factSkillsCloud = document.getElementById("factSkillsCloud");
    this.factClaimsList = document.getElementById("factClaimsList");
    this.factQuotesCount = document.getElementById("factQuotesCount");
    this.factQuotesSample = document.getElementById("factQuotesSample");
    this.btnExtractAndEvaluate = document.getElementById("btnExtractAndEvaluate");

    // Step 2 Elements
    this.isolatedAgentsGrid = document.getElementById("isolatedAgentsGrid");
    this.btnBackToStep1 = document.getElementById("btnBackToStep1");
    this.btnProceedToDebate = document.getElementById("btnProceedToDebate");

    // Step 3 Elements
    this.personaSoptlights = document.getElementById("personaSoptlights");
    this.debateTurnStream = document.getElementById("debateTurnStream");
    this.stanceEvolutionGrid = document.getElementById("stanceEvolutionGrid");
    this.btnPlayVoiceDebate = document.getElementById("btnPlayVoiceDebate");
    this.btnPauseVoiceDebate = document.getElementById("btnPauseVoiceDebate");
    this.btnPrevVoiceTurn = document.getElementById("btnPrevVoiceTurn");
    this.btnNextVoiceTurn = document.getElementById("btnNextVoiceTurn");
    this.voiceSpeedSelect = document.getElementById("voiceSpeedSelect");
    this.playIcon = document.getElementById("playIcon");
    this.playLabel = document.getElementById("playLabel");
    this.audioWaveCanvas = document.getElementById("audioWaveCanvas");
    this.btnBackToStep2 = document.getElementById("btnBackToStep2");
    this.btnProceedToDecision = document.getElementById("btnProceedToDecision");

    // Step 4 & 5 Elements
    this.finalVerdictStamp = document.getElementById("finalVerdictStamp");
    this.dossierCandidateName = document.getElementById("dossierCandidateName");
    this.dossierLevelingTag = document.getElementById("dossierLevelingTag");
    this.dossierScoreVal = document.getElementById("dossierScoreVal");
    this.dossierConfidenceVal = document.getElementById("dossierConfidenceVal");
    this.mathComparisonBadge = document.getElementById("mathComparisonBadge");
    this.dossierReasoningText = document.getElementById("dossierReasoningText");
    this.verifiedStrengthsList = document.getElementById("verifiedStrengthsList");
    this.verifiedConcernsList = document.getElementById("verifiedConcernsList");
    this.unresolvedConflictsList = document.getElementById("unresolvedConflictsList");
    this.btnBackToDebate = document.getElementById("btnBackToDebate");
    this.btnExportPDF = document.getElementById("btnExportPDF");
    this.btnCopyMarkdown = document.getElementById("btnCopyMarkdown");
    this.btnRestart = document.getElementById("btnRestart");

    // Modals
    this.settingsModal = document.getElementById("settingsModal");
    this.btnOpenSettings = document.getElementById("btnOpenSettings");
    this.btnCloseSettings = document.getElementById("btnCloseSettings");
    this.btnSaveSettings = document.getElementById("btnSaveSettings");
    this.llmProviderSelect = document.getElementById("llmProviderSelect");
    this.apiKeyGroup = document.getElementById("apiKeyGroup");
    this.apiKeyInput = document.getElementById("apiKeyInput");
    this.btnResetApp = document.getElementById("btnResetApp");
    this.toastContainer = document.getElementById("toastContainer");
  }

  initEvents() {
    // Navigation clicks
    this.stepTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        if (!tab.disabled) {
          const stepNum = index < 3 ? index + 1 : 4;
          this.goToStep(stepNum);
        }
      });
    });

    // Step 1 Inputs
    this.resumeInput.addEventListener("input", () => this.updateWordCounts());
    this.transcriptInput.addEventListener("input", () => this.updateWordCounts());

    this.btnExtractAndEvaluate.addEventListener("click", async () => {
      await this.handleExtractAndEvaluate();
    });

    // Step 2 Action
    this.btnBackToStep1.addEventListener("click", () => this.goToStep(1));
    this.btnProceedToDebate.addEventListener("click", async () => {
      await this.handleStartDebate();
    });

    // Step 3 Actions
    this.btnBackToStep2.addEventListener("click", () => {
      this.voiceEngine.stop();
      this.goToStep(2);
    });

    this.btnProceedToDecision.addEventListener("click", () => {
      this.voiceEngine.stop();
      this.handleSynthesizeDecision();
    });

    // Voice Engine Controls
    this.btnPlayVoiceDebate.addEventListener("click", () => this.handlePlayVoice());
    this.btnPauseVoiceDebate.addEventListener("click", () => this.handlePauseVoice());
    this.btnPrevVoiceTurn.addEventListener("click", () => this.voiceEngine.skipPrevious());
    this.btnNextVoiceTurn.addEventListener("click", () => this.voiceEngine.skipNext());
    this.voiceSpeedSelect.addEventListener("change", (e) => {
      this.voiceEngine.setSpeed(parseFloat(e.target.value));
    });

    // Step 4 Actions
    this.btnBackToDebate.addEventListener("click", () => this.goToStep(3));
    this.btnExportPDF.addEventListener("click", () => window.print());
    this.btnCopyMarkdown.addEventListener("click", () => this.copyMarkdownDossier());
    this.btnRestart.addEventListener("click", () => this.resetAssessment());

    // Settings Modal
    this.btnOpenSettings.addEventListener("click", () => {
      this.llmProviderSelect.value = this.llmConfig.provider;
      this.apiKeyInput.value = this.llmConfig.apiKey;
      this.apiKeyGroup.style.display = this.llmConfig.provider !== "offline" ? "block" : "none";
      this.settingsModal.classList.add("active");
    });

    this.btnCloseSettings.addEventListener("click", () => {
      this.settingsModal.classList.remove("active");
    });

    this.llmProviderSelect.addEventListener("change", (e) => {
      this.apiKeyGroup.style.display = e.target.value !== "offline" ? "block" : "none";
    });

    this.btnSaveSettings.addEventListener("click", () => {
      this.llmConfig.provider = this.llmProviderSelect.value;
      this.llmConfig.apiKey = this.apiKeyInput.value.trim();
      this.llmConfig.useLiveLLM = this.llmConfig.provider !== "offline";
      
      localStorage.setItem("aegis_llm_provider", this.llmConfig.provider);
      localStorage.setItem("aegis_llm_api_key", this.llmConfig.apiKey);

      this.settingsModal.classList.remove("active");
      this.showToast("Settings updated successfully!");
    });

    this.btnResetApp.addEventListener("click", () => this.resetAssessment());
  }

  initVoiceEngine() {
    this.voiceEngine.setVisualizerCanvas(this.audioWaveCanvas);
    this.voiceEngine.setCallbacks({
      onTurnStart: (index, turn) => {
        this.highlightActiveSpeaker(turn.speakerId);
        this.highlightActiveTurnCard(index);
        this.btnPauseVoiceDebate.disabled = false;
        this.playLabel.textContent = "Playing...";
        this.playIcon.textContent = "🔊";
      },
      onTurnEnd: (index, turn) => {
        // speaker finish hook
      },
      onComplete: () => {
        this.resetSpeakerHighlights();
        this.btnPauseVoiceDebate.disabled = true;
        this.playLabel.textContent = "Play Voice Debate";
        this.playIcon.textContent = "▶";
        this.showToast("Voice debate playback completed.");
      }
    });
  }

  renderPresets() {
    this.presetGrid.innerHTML = "";
    PRESET_CANDIDATES.forEach((candidate) => {
      const isSelected = this.selectedCandidate && this.selectedCandidate.id === candidate.id;
      const card = document.createElement("div");
      card.className = `preset-card ${isSelected ? 'selected' : ''}`;
      card.dataset.candidateId = candidate.id;

      card.innerHTML = `
        <div class="preset-header">
          <img src="${candidate.avatar}" alt="${candidate.name}" class="candidate-avatar">
          <div class="candidate-meta">
            <h3>${candidate.name}</h3>
            <span class="candidate-role-badge">${candidate.role}</span>
          </div>
        </div>
        <p class="preset-summary">${candidate.summary}</p>
        <div class="preset-conflict-tag">
          ⚡ Trigger: ${this.getConflictPreview(candidate.id)}
        </div>
      `;

      card.addEventListener("click", () => {
        document.querySelectorAll(".preset-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        this.loadCandidate(candidate);
      });

      this.presetGrid.appendChild(card);
    });
  }

  getConflictPreview(candidateId) {
    if (candidateId === "alex-rivera") return "Raft scratch claim vs Library wrapper confession";
    if (candidateId === "maya-chen") return "Airtight GPU caching metrics & Zero red flags";
    if (candidateId === "jordan-miller") return "Figma UI mastery vs DevTools Heap leak evasion";
    if (candidateId === "liam-patel") return "$14M ARR solo credit vs Marketing campaign cohort";
    return "Custom candidate deliberation";
  }

  loadCandidate(candidate) {
    this.selectedCandidate = candidate;
    this.resumeInput.value = candidate.resumeText;
    this.transcriptInput.value = candidate.transcriptText;
    this.updateWordCounts();
    this.sharedFactBaseCard.style.display = "none";
  }

  updateWordCounts() {
    const resumeWords = this.resumeInput.value.trim().split(/\s+/).filter(Boolean).length;
    const transcriptWords = this.transcriptInput.value.trim().split(/\s+/).filter(Boolean).length;
    this.resumeWordCount.textContent = `${resumeWords} words`;
    this.transcriptWordCount.textContent = `${transcriptWords} words`;
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;

    // Update nav buttons
    this.stepTabs.forEach((tab, idx) => {
      tab.classList.remove("active");
      if (idx + 1 === stepNumber || (stepNumber === 4 && (idx === 3 || idx === 4))) {
        tab.classList.add("active");
      }
    });

    // Update view sections
    this.stepViews.forEach((view, idx) => {
      view.classList.remove("active");
      if (idx + 1 === stepNumber) {
        view.classList.add("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async handleExtractAndEvaluate() {
    const resumeText = this.resumeInput.value.trim();
    const transcriptText = this.transcriptInput.value.trim();

    if (!resumeText || !transcriptText) {
      this.showToast("Please provide both Resume and Interview Transcript.", "warning");
      return;
    }

    this.btnExtractAndEvaluate.disabled = true;
    this.btnExtractAndEvaluate.textContent = "Extracting Facts & Ingesting...";

    try {
      // 1. Build Shared Fact Base
      this.sharedFactBase = await ProfileBuilder.buildSharedFactBase(
        resumeText,
        transcriptText,
        this.selectedCandidate || {},
        this.llmConfig
      );

      this.renderSharedFactBase(this.sharedFactBase);

      // Unlock Step 2 tab
      this.stepTabs[1].disabled = false;
      this.goToStep(2);

      // 2. Run Isolated Evaluations for all 4 Personas
      await this.runAgentEvaluations();

    } catch (err) {
      console.error("Extraction error:", err);
      this.showToast("Error processing candidate data.", "danger");
    } finally {
      this.btnExtractAndEvaluate.disabled = false;
      this.btnExtractAndEvaluate.innerHTML = `<span>Extract Fact Base & Run Isolated AI Evaluations</span><span>→</span>`;
    }
  }

  renderSharedFactBase(factBase) {
    this.sharedFactBaseCard.style.display = "block";

    // Skills
    this.factSkillsCloud.innerHTML = "";
    const allSkills = [
      ...(factBase.skills.languages || []).map(s => ({ name: s, type: "lang" })),
      ...(factBase.skills.frameworksAndTools || []).map(s => ({ name: s, type: "framework" })),
      ...(factBase.skills.architectureAndConcepts || []).map(s => ({ name: s, type: "concept" }))
    ];

    allSkills.slice(0, 18).forEach(sk => {
      const tag = document.createElement("span");
      tag.className = `skill-tag ${sk.type}`;
      tag.textContent = sk.name;
      this.factSkillsCloud.appendChild(tag);
    });

    // Claims
    this.factClaimsList.innerHTML = "";
    (factBase.claims || []).slice(0, 3).forEach(claim => {
      const item = document.createElement("div");
      item.innerHTML = `<span style="color: #38bdf8;">•</span> "${claim.text}"`;
      this.factClaimsList.appendChild(item);
    });

    // Quotes count
    const quotes = factBase.indexedQuotes || [];
    this.factQuotesCount.textContent = `Indexed ${quotes.length} Verbatim Dialogue Turns`;
    if (quotes.length > 0) {
      this.factQuotesSample.textContent = `Sample: [${quotes[0].timestamp}] ${quotes[0].speaker}: "${quotes[0].text.substring(0, 90)}..."`;
    }
  }

  async runAgentEvaluations() {
    this.isolatedAgentsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <div style="font-size: 2rem; margin-bottom: 1rem; animation: spin 1s infinite linear;">⚡</div>
        <p style="font-weight: 700; font-size: 1.1rem; color: #ffffff;">Executing 4 Strictly Isolated AI Persona Evaluations...</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: #38bdf8;">Zero cross-agent data sharing. Parsing verbatim quote citations.</p>
      </div>
    `;

    this.isolatedOpinions = await AgentManager.runIsolatedEvaluations(
      this.sharedFactBase,
      this.llmConfig
    );

    this.renderIsolatedAgentOpinions(this.isolatedOpinions);
  }

  renderIsolatedAgentOpinions(opinions) {
    this.isolatedAgentsGrid.innerHTML = "";

    opinions.forEach((op) => {
      const persona = op.persona;
      const card = document.createElement("div");
      card.className = "agent-opinion-card";
      card.dataset.agent = op.agentId;

      const stanceClass = op.stance.toLowerCase().replace(/_/g, "-");

      let keyFindingsHTML = "";
      (op.keyFindings || []).slice(0, 2).forEach(f => {
        keyFindingsHTML += `
          <div class="quote-citation-box">
            <div class="quote-header">
              <span>${f.claim}</span>
              <span>${f.source}</span>
            </div>
            <div class="quote-text">"${f.quote}"</div>
            <div class="quote-analysis">→ ${f.analysis}</div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="agent-card-header">
          <div class="agent-profile">
            <img src="${persona.avatar}" alt="${persona.name}" class="agent-avatar">
            <div class="agent-meta">
              <h4>${persona.name}</h4>
              <div class="agent-title">${persona.title}</div>
            </div>
          </div>
          <div class="score-dial">
            <span class="score-number" style="color: ${persona.themeColor}">${op.score}</span>
            <span class="score-label">Score</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="stance-badge ${stanceClass}">${op.stance.replace(/_/g, ' ')}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
            Confidence: ${op.confidence}%
          </span>
        </div>

        <p class="agent-summary">${op.summary}</p>

        <div>
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">
            Verbatim Evidentiary Citations:
          </div>
          ${keyFindingsHTML}
        </div>
      `;

      this.isolatedAgentsGrid.appendChild(card);
    });

    this.btnProceedToDebate.disabled = false;
  }

  async handleStartDebate() {
    this.stepTabs[2].disabled = false;
    this.goToStep(3);

    this.renderPersonaSpotlights();

    this.debateTurnStream.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
        <div style="font-size: 2rem; margin-bottom: 1rem;">🎙️</div>
        <p style="font-weight: 700; font-size: 1.1rem; color: #ffffff;">Convening Multi-Agent Live Debate Arena...</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: #ec4899;">Cross-examining claims and initiating peer rebuttals.</p>
      </div>
    `;

    this.debateResult = await DebateEngine.orchestrateDebate(
      this.sharedFactBase,
      this.isolatedOpinions,
      this.llmConfig
    );

    this.renderDebateStream(this.debateResult.turns);
    this.renderStanceEvolution(this.debateResult.stanceChanges);

    this.voiceEngine.loadDebateTurns(this.debateResult.turns);
  }

  renderPersonaSpotlights() {
    this.personaSoptlights.innerHTML = "";
    AGENT_DEFINITIONS.forEach(agent => {
      const spot = document.createElement("div");
      spot.className = "spotlight-card";
      spot.id = `spotlight-${agent.id}`;
      spot.innerHTML = `
        <img src="${agent.avatar}" alt="${agent.name}" class="spotlight-avatar">
        <div class="spotlight-info">
          <h5>${agent.name}</h5>
          <div class="spotlight-status">Listening</div>
        </div>
      `;
      this.personaSoptlights.appendChild(spot);
    });
  }

  renderDebateStream(turns) {
    this.debateTurnStream.innerHTML = "";

    turns.forEach((turn, idx) => {
      const agent = AGENT_DEFINITIONS.find(a => a.id === turn.speakerId) || AGENT_DEFINITIONS[0];
      const card = document.createElement("div");
      card.className = "debate-turn-card";
      card.id = `turn-card-${idx}`;

      card.innerHTML = `
        <div class="turn-header">
          <div class="turn-speaker-info">
            <img src="${agent.avatar}" alt="${agent.name}" class="turn-avatar">
            <span class="turn-speaker-name" style="color: ${agent.themeColor}">${turn.speakerName}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${turn.timestamp}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="turn-badge ${turn.type}">${turn.badge}</span>
            <button class="btn btn-secondary btn-icon-only play-single-turn" data-turn-idx="${idx}" title="Listen to this speaker">
              🔊
            </button>
          </div>
        </div>

        <p class="turn-text">${turn.text}</p>

        ${turn.citedQuote ? `
          <div class="turn-quote-pill">
            <span>📌 Cited Evidence:</span>
            <span>"${turn.citedQuote}"</span>
          </div>
        ` : ''}
      `;

      card.querySelector(".play-single-turn").addEventListener("click", () => {
        this.highlightActiveSpeaker(turn.speakerId);
        this.highlightActiveTurnCard(idx);
        this.voiceEngine.speakSingleTurn(turn, () => {
          this.resetSpeakerHighlights();
        });
      });

      this.debateTurnStream.appendChild(card);
    });
  }

  renderStanceEvolution(stanceChanges) {
    this.stanceEvolutionGrid.innerHTML = "";

    Object.values(stanceChanges || {}).forEach(change => {
      const agent = AGENT_DEFINITIONS.find(a => a.id === change.agentId) || AGENT_DEFINITIONS[0];
      const card = document.createElement("div");
      card.className = "evolution-card";

      const deltaClass = change.delta > 0 ? "positive" : change.delta < 0 ? "negative" : "neutral";
      const deltaPrefix = change.delta > 0 ? "+" : "";

      card.innerHTML = `
        <div class="evolution-card-header">
          <strong style="font-size: 0.85rem; color: ${agent.themeColor}">${agent.name}</strong>
          <span class="evolution-delta ${deltaClass}">${deltaPrefix}${change.delta} pts</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.4rem;">
          <span>Initial: ${change.scoreBefore}</span>
          <span>→</span>
          <span style="color: #ffffff; font-weight: 700;">Post-Debate: ${change.scoreAfter}</span>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">${change.reason}</p>
      `;

      this.stanceEvolutionGrid.appendChild(card);
    });
  }

  highlightActiveSpeaker(speakerId) {
    document.querySelectorAll(".spotlight-card").forEach(c => {
      c.classList.remove("active-speaker");
      const statusEl = c.querySelector(".spotlight-status");
      if (statusEl) statusEl.textContent = "Listening";
    });

    const activeSpot = document.getElementById(`spotlight-${speakerId}`);
    if (activeSpot) {
      activeSpot.classList.add("active-speaker");
      const statusEl = activeSpot.querySelector(".spotlight-status");
      if (statusEl) statusEl.textContent = "Speaking...";
    }
  }

  highlightActiveTurnCard(turnIndex) {
    document.querySelectorAll(".debate-turn-card").forEach(c => c.classList.remove("highlight-playing"));
    const activeCard = document.getElementById(`turn-card-${turnIndex}`);
    if (activeCard) {
      activeCard.classList.add("highlight-playing");
      activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  resetSpeakerHighlights() {
    document.querySelectorAll(".spotlight-card").forEach(c => {
      c.classList.remove("active-speaker");
      const statusEl = c.querySelector(".spotlight-status");
      if (statusEl) statusEl.textContent = "Listening";
    });
    document.querySelectorAll(".debate-turn-card").forEach(c => c.classList.remove("highlight-playing"));
  }

  handlePlayVoice() {
    if (this.voiceEngine.isPlaying) {
      this.voiceEngine.pause();
      this.playLabel.textContent = "Resume Debate";
      this.playIcon.textContent = "▶";
      this.btnPauseVoiceDebate.disabled = true;
    } else {
      this.voiceEngine.play();
      this.playLabel.textContent = "Playing...";
      this.playIcon.textContent = "🔊";
      this.btnPauseVoiceDebate.disabled = false;
    }
  }

  handlePauseVoice() {
    this.voiceEngine.pause();
    this.playLabel.textContent = "Resume Debate";
    this.playIcon.textContent = "▶";
    this.btnPauseVoiceDebate.disabled = true;
  }

  handleSynthesizeDecision() {
    this.stepTabs[3].disabled = false;
    this.stepTabs[4].disabled = false;
    this.goToStep(4);

    this.finalDossier = DecisionEngine.synthesizeFinalDecision(
      this.sharedFactBase,
      this.isolatedOpinions,
      this.debateResult
    );

    this.renderExecutiveDossier(this.finalDossier);
  }

  renderExecutiveDossier(dossier) {
    // 1. Verdict Stamp & Header
    const verdictClass = dossier.finalVerdict.toLowerCase().replace(/_/g, "-");
    this.finalVerdictStamp.className = `verdict-stamp ${verdictClass}`;
    this.finalVerdictStamp.textContent = dossier.finalVerdict.replace(/_/g, " ");

    this.dossierCandidateName.textContent = dossier.candidateName;
    this.dossierLevelingTag.textContent = `🎯 Recommended Level: ${dossier.levelingRecommendation}`;
    this.dossierScoreVal.textContent = `${dossier.decisionScore}/100`;
    this.dossierConfidenceVal.textContent = `${dossier.decisionConfidence}%`;

    // 2. Simple Average Math Comparison
    this.mathComparisonBadge.textContent = `Simple Average: ${dossier.simpleAverageScore}/100  ⇄  Evidentiary Deliberated Score: ${dossier.decisionScore}/100`;

    // 3. Reasoning Text
    this.dossierReasoningText.innerHTML = this.formatMarkdownToHTML(dossier.reasoningSummary);

    // 4. Strengths with quotes
    this.verifiedStrengthsList.innerHTML = "";
    dossier.verifiedStrengths.forEach(s => {
      const item = document.createElement("div");
      item.className = "finding-item";
      item.innerHTML = `
        <div class="finding-item-title">${s.claim}</div>
        <div class="finding-item-quote">"${s.quote}"</div>
        <div class="finding-item-analysis"><strong>${s.agentSource}:</strong> ${s.analysis}</div>
      `;
      this.verifiedStrengthsList.appendChild(item);
    });

    // 5. Concerns with quotes
    this.verifiedConcernsList.innerHTML = "";
    if (dossier.verifiedConcerns.length === 0) {
      this.verifiedConcernsList.innerHTML = `<div style="color: #10b981; font-size: 0.85rem; padding: 0.5rem 0;">✓ Zero critical red flags identified. All claims verified.</div>`;
    } else {
      dossier.verifiedConcerns.forEach(c => {
        const item = document.createElement("div");
        item.className = "finding-item concern";
        item.innerHTML = `
          <div class="finding-item-title">${c.claim}</div>
          <div class="finding-item-quote">"${c.quote}"</div>
          <div class="finding-item-analysis"><strong>${c.agentSource}:</strong> ${c.analysis}</div>
        `;
        this.verifiedConcernsList.appendChild(item);
      });
    }

    // 6. Unresolved Disagreements
    this.unresolvedConflictsList.innerHTML = "";
    if (dossier.unresolvedDisagreements.length === 0) {
      this.unresolvedConflictsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">All agent perspectives reached full alignment post-debate.</div>`;
    } else {
      dossier.unresolvedDisagreements.forEach(conf => {
        const entry = document.createElement("div");
        entry.className = "conflict-entry";
        entry.innerHTML = `
          <h5>⚡ ${conf.issue}</h5>
          <div class="conflict-parties">Key Agents: ${conf.agentsInvolved.join(" vs ")}</div>
          <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5;">${conf.description}</p>
        `;
        this.unresolvedConflictsList.appendChild(entry);
      });
    }
  }

  formatMarkdownToHTML(mdText) {
    return mdText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n- /g, '<br>• ');
  }

  copyMarkdownDossier() {
    if (!this.finalDossier) return;

    const md = `# AEGIS COUNCIL - EXECUTIVE HIRING DOSSIER
**Candidate:** ${this.finalDossier.candidateName}
**Target Role:** ${this.finalDossier.targetRole}
**Final Recommendation:** ${this.finalDossier.finalVerdict.replace(/_/g, ' ')}
**Evidentiary Deliberated Score:** ${this.finalDossier.decisionScore}/100 (Deliberation Confidence: ${this.finalDossier.decisionConfidence}%)
**Leveling Assessment:** ${this.finalDossier.levelingRecommendation}

---
## Deliberative Evidentiary Reasoning (Non-Averaging)
${this.finalDossier.reasoningSummary}

---
## Key Verified Strengths
${this.finalDossier.verifiedStrengths.map(s => `- **${s.claim}**\n  > "${s.quote}"\n  *(${s.agentSource}: ${s.analysis})*`).join('\n\n')}

---
## Critical Concerns & Red Flags
${this.finalDossier.verifiedConcerns.map(c => `- **${c.claim}**\n  > "${c.quote}"\n  *(${c.agentSource}: ${c.analysis})*`).join('\n\n')}

---
## Unresolved Agent Disagreements
${this.finalDossier.unresolvedDisagreements.map(d => `- **${d.issue}** (${d.agentsInvolved.join(' vs ')})\n  ${d.description}`).join('\n\n')}
`;

    navigator.clipboard.writeText(md).then(() => {
      this.showToast("Executive Markdown Dossier copied to clipboard!");
    });
  }

  resetAssessment() {
    this.voiceEngine.stop();
    this.stepTabs[1].disabled = true;
    this.stepTabs[2].disabled = true;
    this.stepTabs[3].disabled = true;
    this.stepTabs[4].disabled = true;
    this.goToStep(1);
    this.showToast("Assessment reset.");
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.aegisApp = new AegisCouncilApp();
});
