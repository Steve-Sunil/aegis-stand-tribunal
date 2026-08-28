/**
 * Multi-Agent AI Candidate Assessment - Candidate Profile Builder
 * Parses Resume and Interview Transcript to generate the immutable Shared Fact Base.
 */

export class ProfileBuilder {
  /**
   * Build structured Candidate Shared Fact Base from raw resume & transcript.
   * @param {string} resumeText - Raw text of the resume
   * @param {string} transcriptText - Raw text of the interview transcript
   * @param {object} [metadata] - Optional preset metadata (name, role, etc.)
   * @param {object} [llmConfig] - Optional live LLM API config
   * @returns {Promise<object>} - Structured Shared Fact Base
   */
  static async buildSharedFactBase(resumeText, transcriptText, metadata = {}, llmConfig = null) {
    // If live LLM config is available and selected, we can attempt live extraction
    if (llmConfig && llmConfig.apiKey && llmConfig.useLiveLLM) {
      try {
        const liveExtracted = await this.extractWithLiveLLM(resumeText, transcriptText, llmConfig);
        if (liveExtracted) {
          return {
            ...liveExtracted,
            rawResume: resumeText,
            rawTranscript: transcriptText,
            extractedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn("Live LLM extraction failed, falling back to heuristic engine:", err);
      }
    }

    // Heuristic & Pattern Extraction Engine
    return this.extractHeuristicFactBase(resumeText, transcriptText, metadata);
  }

  /**
   * Deterministic & Pattern-based Fact Extractor
   */
  static extractHeuristicFactBase(resumeText, transcriptText, metadata = {}) {
    const lines = resumeText.split("\n").map(l => l.trim()).filter(Boolean);
    const transcriptLines = transcriptText.split("\n").map(l => l.trim()).filter(Boolean);

    // 1. Candidate Info
    const candidateName = metadata.name || this.extractName(lines) || "Candidate";
    const candidateRole = metadata.role || this.extractRole(lines) || "Software Engineer";
    const education = metadata.education || this.extractEducation(lines) || "B.S. in Computer Science";
    const experienceYears = metadata.experienceYears || this.estimateExperienceYears(lines) || 5;

    // 2. Skills Extraction
    const skills = this.extractSkills(resumeText);

    // 3. Experience & Milestones Timeline
    const timeline = this.extractTimeline(resumeText);

    // 4. Quantified Claims (Metrics claimed on Resume)
    const claims = this.extractQuantifiedClaims(resumeText);

    // 5. Indexed Verbatim Transcript Quotes with Topics
    const indexedQuotes = this.indexTranscript(transcriptLines, candidateName);

    // 6. Cross-reference mapping (Claims vs Transcript statements)
    const crossReferences = this.mapClaimsToTranscript(claims, indexedQuotes);

    return {
      candidateName,
      candidateRole,
      experienceYears,
      education,
      avatar: metadata.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      skills,
      timeline,
      claims,
      indexedQuotes,
      crossReferences,
      rawResume: resumeText,
      rawTranscript: transcriptText,
      extractedAt: new Date().toISOString()
    };
  }

  static extractName(lines) {
    if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes("@")) {
      return lines[0].replace(/[^a-zA-Z\s.-]/g, "").trim();
    }
    return null;
  }

  static extractRole(lines) {
    for (const line of lines.slice(0, 10)) {
      if (/engineer|architect|developer|lead|manager|scientist/i.test(line) && !line.includes("@") && line.length < 60) {
        return line.trim();
      }
    }
    return null;
  }

  static extractEducation(lines) {
    const eduIdx = lines.findIndex(l => /EDUCATION/i.test(l));
    if (eduIdx !== -1 && lines[eduIdx + 1]) {
      return lines[eduIdx + 1].trim();
    }
    for (const line of lines) {
      if (/B\.S\.|M\.S\.|Ph\.D\.|Bachelor|Master|Degree|University/i.test(line)) {
        return line.trim();
      }
    }
    return null;
  }

  static estimateExperienceYears(lines) {
    const yearMatches = [...lines.join(" ").matchAll(/\b(20\d{2})\b/g)].map(m => parseInt(m[1]));
    if (yearMatches.length >= 2) {
      const minYear = Math.min(...yearMatches);
      const maxYear = Math.max(...yearMatches);
      const span = maxYear - minYear;
      if (span > 0 && span < 30) return span;
    }
    return 5;
  }

  static extractSkills(text) {
    const commonCategories = {
      languages: ["Go", "Rust", "Python", "JavaScript", "TypeScript", "Java", "C++", "SQL", "HTML", "CSS", "Ruby"],
      frameworksAndTools: ["React", "Next.js", "Vue.js", "Docker", "Kubernetes", "Kafka", "Redis", "PostgreSQL", "Cassandra", "PyTorch", "LangChain", "FastAPI", "GraphQL", "gRPC", "RabbitMQ", "Storybook", "OpenTelemetry"],
      architectureAndConcepts: ["Distributed Systems", "Raft", "Paxos", "Event-Driven", "CQRS", "Microservices", "Speculative Decoding", "KV-Cache", "Vector Search", "Core Web Vitals", "A/B Testing", "Idempotency", "Database Sharding"]
    };

    const detected = {
      languages: [],
      frameworksAndTools: [],
      architectureAndConcepts: []
    };

    for (const [category, keywords] of Object.entries(commonCategories)) {
      for (const kw of keywords) {
        const regex = new RegExp(`\\b${kw.replace("+", "\\+")}\\b`, "i");
        if (regex.test(text)) {
          detected[category].push(kw);
        }
      }
    }

    return detected;
  }

  static extractTimeline(resumeText) {
    const lines = resumeText.split("\n");
    const timeline = [];
    let currentEntry = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Match role and company patterns like: Senior Engineer | CloudScale Networks (2022 - Present)
      const roleMatch = line.match(/^([A-Za-z\s]+)\s*\|\s*([A-Za-z0-9\s]+)\s*\((20\d{2}.*?)\)/);
      if (roleMatch) {
        if (currentEntry) timeline.push(currentEntry);
        currentEntry = {
          role: roleMatch[1].trim(),
          company: roleMatch[2].trim(),
          period: roleMatch[3].trim(),
          highlights: []
        };
        continue;
      }

      if (line.startsWith("- ") && currentEntry) {
        currentEntry.highlights.push(line.replace(/^- /, "").trim());
      }
    }

    if (currentEntry) timeline.push(currentEntry);
    return timeline;
  }

  static extractQuantifiedClaims(resumeText) {
    const claims = [];
    const lines = resumeText.split("\n");
    const metricRegex = /(\d+(\.\d+)?%|\d+(\.\d+)?[kKmMbB]\b|\$\d+([kKmMbB]|M|K)?|\b\d+\.?\d*\s*(req\/sec|events\/sec|stars|users|nodes|ms|tokens\/day|percentile)\b)/gi;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") && metricRegex.test(trimmed)) {
        const matches = [...trimmed.matchAll(metricRegex)].map(m => m[0]);
        claims.push({
          id: `claim-${idx}`,
          text: trimmed.replace(/^- /, "").trim(),
          metrics: matches,
          verifiedStatus: "pending_audit"
        });
      }
    });

    return claims;
  }

  static indexTranscript(transcriptLines, candidateName) {
    return transcriptLines.map((line, index) => {
      const timestampMatch = line.match(/^\[(\d{2}:\d{2})\]/);
      const timestamp = timestampMatch ? timestampMatch[1] : `00:${String(index).padStart(2, "0")}`;
      
      let speaker = "Unknown";
      let text = line;

      const speakerMatch = line.match(/^\[\d{2}:\d{2}\]\s*([^:]+):\s*(.*)/);
      if (speakerMatch) {
        speaker = speakerMatch[1].trim();
        text = speakerMatch[2].trim();
      }

      const isCandidate = speaker.toLowerCase().includes("candidate") || 
                          speaker.toLowerCase().includes(candidateName.toLowerCase().split(" ")[0]);

      // Detect semantic tags
      const tags = [];
      if (/raft|consensus|cache|kv|latency|gpu|memory|profiler|postgres|schema|concurrency/i.test(text)) tags.push("technical");
      if (/team|mentor|conflict|disagree|junior|collaborat|burnout|inclusive/i.test(text)) tags.push("culture_leadership");
      if (/metric|arr|revenue|conversion|cost|roi|savings|a\/b/i.test(text)) tags.push("business_impact");
      if (/overstatement|admit|library|custom|solo|single-handedly|clarify|actually/i.test(text)) tags.push("skeptic_audit");

      return {
        id: `quote-${index + 1}`,
        lineNumber: index + 1,
        timestamp,
        speaker,
        isCandidate,
        text,
        tags
      };
    });
  }

  static mapClaimsToTranscript(claims, indexedQuotes) {
    return claims.map(claim => {
      const keywords = claim.text.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const relatedQuotes = indexedQuotes.filter(q => {
        const quoteLower = q.text.toLowerCase();
        return keywords.some(k => quoteLower.includes(k));
      });

      return {
        claimId: claim.id,
        claimText: claim.text,
        relatedQuoteIds: relatedQuotes.map(q => q.id),
        quoteExcerpts: relatedQuotes.slice(0, 3).map(q => `[${q.timestamp}] ${q.speaker}: "${q.text}"`)
      };
    });
  }

  /**
   * Optional Live LLM Extraction using Google Gemini or OpenAI API
   */
  static async extractWithLiveLLM(resumeText, transcriptText, config) {
    const prompt = `You are a precise technical fact-extractor. Extract structured facts from the following resume and interview transcript.
Return pure JSON with keys:
- candidateName (string)
- candidateRole (string)
- experienceYears (number)
- education (string)
- skills: { languages: [], frameworksAndTools: [], architectureAndConcepts: [] }
- timeline: [{ role, company, period, highlights: [] }]
- claims: [{ id, text, metrics: [] }]
- indexedQuotes: [{ id, lineNumber, timestamp, speaker, isCandidate: boolean, text, tags: [] }]

Resume:
${resumeText}

Transcript:
${transcriptText}
`;

    if (config.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(rawText);
    } else if (config.provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      });
      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    }
    return null;
  }
}
