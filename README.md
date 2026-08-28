# ⚡ Aegis Stand Tribunal — Multi-Agent AI Interview & Deliberation Panel Simulator

An advanced, multi-agent AI hiring assessment platform featuring **4 isolated AI personas**, **multi-round cross-examination debates**, **Web Speech API voice debate synthesis**, and a **non-averaging evidentiary decision deliberation engine**.

![Aegis Tribunal Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 System Architecture & Pipeline Flow

```
[ Candidate Resume + Verbatim Interview Transcript ]
                         │
                         ▼
        [ 1. Candidate Profile Builder ]  ─── Extracts ───► [ Immutable Shared Fact Base ]
                         │
   ┌─────────────────────┼─────────────────────┬─────────────────────┐
   ▼                     ▼                     ▼                     ▼
[ Dr. Aris Vance ]   [ Elena Rostova ]     [ Marcus Sterling ]   [ Agent Jax ]
(Tech Architect)     (Culture & People)    (Hiring Manager)      (Skeptic Auditor)
 *Strict Isolation*   *Strict Isolation*   *Strict Isolation*    *Strict Isolation*
 *Quote Citations*    *Quote Citations*    *Quote Citations*     *Quote Citations*
   │                     │                     │                     │
   └─────────────────────┼─────────────────────┴─────────────────────┘
                         │
                         ▼
        [ 3. Multi-Round Live Debate Arena & 🎙️ Voice Engine ]
         ├─ Round 1: Opening Clashes & Contradiction Audits
         ├─ Round 2: Direct Rebuttals & Peer Cross-Examinations
         ├─ Round 3: Stance Updates & Dynamic Concessions
         └─ Web Speech Synthesis with 4 Persona Voice Profiles + Waveform Visualizer
                         │
                         ▼
        [ 4. Evidentiary Deliberation Engine (Non-Averaging) ]
         ├─ Fatal Red-Flag Veto Verification
         ├─ Evidence Depth Multipliers (1.35x for audited metrics/code)
         ├─ Stance Shift Delta Analysis
         └─ Role Leveling Calibration (e.g., Senior vs Staff alignment)
                         │
                         ▼
        [ 5. Executive Hiring Dossier & Final Report ]
         ├─ Supreme Recommendation Badge & Deliberation Confidence
         ├─ "Why Simple Averaging Failed" Contrast Callout
         ├─ Two-Column Verified Strengths vs Red Flags (with Quotes)
         ├─ Unresolved Disagreements Matrix
         └─ One-Click PDF Export & Markdown Dossier Copy
```

---

## 🚀 Key Features

### 1. 🧬 Candidate Profile Builder & Shared Fact Ingestion
- Extracts technical skills (Languages, Frameworks, Architecture Concepts).
- Catalogs career timeline milestones and quantified resume claims.
- Indexes verbatim interview transcript turns with exact line numbers and timestamps.

### 2. 🎭 4 Strictly Isolated AI Personas
- **Dr. Aris Vance (Principal Technical Architect)**: Analyzes algorithmic depth, systems design, concurrency, and trade-offs.
- **Elena Rostova (VP of People & Culture)**: Evaluates teamwork dynamics, candor, psychological safety, and emotional intelligence.
- **Marcus Sterling (Director of Engineering & Hiring Manager)**: Weighs delivery speed, ROI, business alignment, and autonomy.
- **Agent Jax (Lead Auditor & Skeptic)**: Hunts for metric inflation, vague buzzwords, and resume-vs-transcript contradictions.
- *Strict Isolation Guarantee*: Each agent independently assesses the Shared Fact Base with zero peer data leakage. Every claim is strictly anchored to **verbatim quotes with citations**.

### 3. ⚔️ Multi-Round Cross-Examination Debate
- Agents actively challenge peers, cite transcript proof, and execute direct rebuttals.
- Features dynamic stance shifts where agents adjust scores and explain their reasoning based on peer evidence.

### 4. 🎙️ Voice Debate Engine (Web Speech Synthesis)
- Distinct voice profiles (custom pitch, speech rate, and timbre) for each agent persona.
- Real-time animated canvas waveform visualizer (`#audioWaveCanvas`) synchronized with active speakers.
- Interactive playback controls: Play, Pause, Skip Next/Prev, and Speed Toggle (`0.9x`, `1.0x`, `1.25x`, `1.5x`).

### 5. ⚖️ Evidentiary Deliberation Engine (Non-Averaging)
- Strictly rejects naive mathematical score averaging.
- Weighed by **Evidence Depth Multipliers** (1.35x for corroborated billing logs/code) and **Fatal Red-Flag Vetoes**.
- Provides explicit role band leveling recommendations (e.g. down-leveling from Staff to Senior based on diagnostic limits).

### 6. 📄 Executive Hiring Dossier
- Comprehensive final report with Recommendation Badge, Verified Strengths, Critical Concerns, and an **Unresolved Disagreements Matrix**.
- Ready for one-click PDF printing and Markdown clipboard export.

---

## 🛠️ Quick Start (Running Locally)

### Prerequisites
- Python 3.8+ or any static web server

### Run Local Server
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/aegis-stand-tribunal.git
cd aegis-stand-tribunal

# Start local server
python server.py
# or: py server.py
```
Open **`http://localhost:8080`** in your browser.

---

## 📦 Docker & Cloud Run Deployment

```bash
# Build Docker image
docker build -t aegis-tribunal .

# Run locally
docker run -p 8080:8080 aegis-tribunal

# Deploy to Google Cloud Run
gcloud run deploy aegis-tribunal --source . --platform managed --allow-unauthenticated
```

---

## 👥 Built For
Multi-Agent AI Interview Panel Simulator Hackathon Challenge.
