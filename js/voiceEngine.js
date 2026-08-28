/**
 * Multi-Agent AI Candidate Assessment - Voice Debate Engine (Bonus Feature)
 * Utilizes Web Speech API (SpeechSynthesis) to voice the multi-agent debate with distinct
 * persona-tailored voices, pitch, rate, real-time waveform visualizers, and playback controls.
 */

import { AGENT_DEFINITIONS } from "./agents.js";

export class VoiceEngine {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.voices = [];
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTurnIndex = 0;
    this.turns = [];
    this.playbackRate = 1.0;
    this.onTurnStartCallback = null;
    this.onTurnEndCallback = null;
    this.onCompleteCallback = null;
    this.currentUtterance = null;
    this.visualizerCanvas = null;
    this.visualizerAnimationId = null;
    this.isSpeaking = false;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getBestVoiceForAgent(agentId) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    const agentDef = AGENT_DEFINITIONS.find(a => a.id === agentId);
    if (!agentDef) return null;

    const prefs = agentDef.voiceConfig.voiceNamePreference || [];
    for (const pref of prefs) {
      const match = this.voices.find(v => v.name.toLowerCase().includes(pref.toLowerCase()) || v.lang.toLowerCase().includes(pref.toLowerCase()));
      if (match) return match;
    }

    // Fallback: Male vs Female approximation based on agent ID
    if (agentId === "culture") {
      const female = this.voices.find(v => /female|zira|samantha|victoria|karen|susan/i.test(v.name));
      if (female) return female;
    } else {
      const male = this.voices.find(v => /male|david|george|mark|alex|daniel/i.test(v.name));
      if (male) return male;
    }

    return this.voices[0] || null;
  }

  setVisualizerCanvas(canvasElement) {
    this.visualizerCanvas = canvasElement;
  }

  setCallbacks({ onTurnStart, onTurnEnd, onComplete }) {
    this.onTurnStartCallback = onTurnStart;
    this.onTurnEndCallback = onTurnEnd;
    this.onCompleteCallback = onComplete;
  }

  setSpeed(rateMultiplier) {
    this.playbackRate = Math.max(0.75, Math.min(2.0, rateMultiplier));
  }

  loadDebateTurns(turns) {
    this.stop();
    this.turns = turns;
    this.currentTurnIndex = 0;
  }

  async play() {
    if (!this.synth) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.startVisualizer();
      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.startVisualizer();
    await this.speakCurrentTurn();
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
      this.isPlaying = false;
      this.stopVisualizer();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTurnIndex = 0;
    this.stopVisualizer();
  }

  skipNext() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.currentTurnIndex < this.turns.length - 1) {
      this.currentTurnIndex++;
      if (this.isPlaying) {
        this.speakCurrentTurn();
      }
    } else {
      this.stop();
    }
  }

  skipPrevious() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.currentTurnIndex > 0) {
      this.currentTurnIndex--;
      if (this.isPlaying) {
        this.speakCurrentTurn();
      }
    }
  }

  async speakSingleTurn(turn, onEnd = null) {
    if (!this.synth) return;
    this.synth.cancel();

    const agentDef = AGENT_DEFINITIONS.find(a => a.id === turn.speakerId) || AGENT_DEFINITIONS[0];
    const textToSpeak = `${turn.speakerName}: ${turn.text}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.voice = this.getBestVoiceForAgent(turn.speakerId);
    utterance.pitch = agentDef.voiceConfig.pitch || 1.0;
    utterance.rate = (agentDef.voiceConfig.rate || 1.0) * this.playbackRate;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startVisualizer(agentDef.themeColor);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopVisualizer();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech error:", e);
      this.isSpeaking = false;
      this.stopVisualizer();
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  async speakCurrentTurn() {
    if (!this.isPlaying || this.currentTurnIndex >= this.turns.length) {
      this.stop();
      if (this.onCompleteCallback) this.onCompleteCallback();
      return;
    }

    const currentTurn = this.turns[this.currentTurnIndex];
    const agentDef = AGENT_DEFINITIONS.find(a => a.id === currentTurn.speakerId) || AGENT_DEFINITIONS[0];

    if (this.onTurnStartCallback) {
      this.onTurnStartCallback(this.currentTurnIndex, currentTurn);
    }

    const textToSpeak = `${currentTurn.speakerName}: ${currentTurn.text}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.voice = this.getBestVoiceForAgent(currentTurn.speakerId);
    utterance.pitch = agentDef.voiceConfig.pitch || 1.0;
    utterance.rate = (agentDef.voiceConfig.rate || 1.0) * this.playbackRate;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startVisualizer(agentDef.themeColor);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onTurnEndCallback) {
        this.onTurnEndCallback(this.currentTurnIndex, currentTurn);
      }

      if (this.isPlaying) {
        this.currentTurnIndex++;
        // Short natural conversational pause between debate speakers
        setTimeout(() => {
          if (this.isPlaying) {
            this.speakCurrentTurn();
          }
        }, 400 / this.playbackRate);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech error, advancing to next speaker:", e);
      this.isSpeaking = false;
      this.currentTurnIndex++;
      if (this.isPlaying) {
        this.speakCurrentTurn();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  startVisualizer(themeColor = "#38bdf8") {
    if (!this.visualizerCanvas) return;
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
    }

    const ctx = this.visualizerCanvas.getContext("2d");
    const width = this.visualizerCanvas.width = this.visualizerCanvas.offsetWidth || 300;
    const height = this.visualizerCanvas.height = this.visualizerCanvas.offsetHeight || 60;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const numBars = 36;
      const barWidth = Math.floor(width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        // Dynamic oscillation wave
        const amplitude = this.isSpeaking
          ? (Math.sin(phase + i * 0.3) * 0.5 + 0.5) * (Math.cos(phase * 0.7 + i * 0.15) * 0.5 + 0.5)
          : 0.08;

        const barHeight = Math.max(4, amplitude * (height - 10));
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, themeColor);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += 0.15 * this.playbackRate;
      this.visualizerAnimationId = requestAnimationFrame(render);
    };

    render();
  }

  stopVisualizer() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
      this.visualizerAnimationId = null;
    }
    if (this.visualizerCanvas) {
      const ctx = this.visualizerCanvas.getContext("2d");
      ctx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
    }
  }
}
