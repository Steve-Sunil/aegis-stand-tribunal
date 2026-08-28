/**
 * Multi-Agent AI Candidate Assessment - Preset Candidates
 * Rich resumes and multi-turn interview transcripts engineered for nuanced multi-agent debates.
 */

export const PRESET_CANDIDATES = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Senior Distributed Systems Engineer",
    experienceYears: 7,
    education: "B.S. in Computer Science, University of Washington (2019)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    summary: "Distributed backend engineer specializing in high-throughput streaming systems, consensus protocols, and microservices.",
    resumeText: `ALEX RIVERA
Email: alex.rivera@example.com | GitHub: github.com/alexrivera-dev | LinkedIn: linkedin.com/in/alexrivera

PROFESSIONAL SUMMARY
Senior Distributed Systems Engineer with 7 years of experience building resilient microservices, consensus-backed distributed state engines, and real-time streaming pipelines processing >2.5M events/sec.

CORE SKILLS
- Languages: Go, Rust, Java, Python, SQL
- Distributed Systems: Raft, Paxos, Kafka, gRPC, Redis Cluster, Cassandra, Kubernetes
- Architecture: Event-Driven Architecture, CQRS, Zero-Downtime Migration, Multi-Region Replication

EXPERIENCE

Senior Infrastructure Engineer | CloudScale Networks (2022 - Present)
- Architected and implemented a high-performance distributed consensus layer using custom Raft replication in Go, handling 2.5M req/sec.
- Single-handedly reduced P99 write latency by 65% (from 140ms to 49ms) across 4 global cloud regions.
- Led migration of 12 monolithic database tables to sharded Apache Cassandra with zero downtime over a 6-month period.
- Mentored 4 junior engineers on distributed debugging, tracing with OpenTelemetry, and chaos engineering.

Backend Engineer | DataFlow Systems (2019 - 2022)
- Built streaming data pipelines in Apache Kafka and Go for financial transaction auditing.
- Implemented idempotency guarantees and exactly-once processing semantics for payment events.
- Created automated load testing suites simulating 50k concurrent virtual users using k6 and Grafana.

EDUCATION
B.S. in Computer Science, University of Washington (2019)
`,
    transcriptText: `[00:01] Interviewer (Dr. Vance): Welcome Alex. Let's dive into your distributed systems work at CloudScale Networks. You mentioned architecting a custom Raft consensus layer. Could you explain how your implementation handles split-brain scenarios and leader election during a network partition?
[00:45] Alex Rivera: Thanks Dr. Vance. Yes, so in our Go service, we implemented consensus for state replication. When a partition occurs, the nodes on the minority side can't reach a quorum, so they can't commit writes. For the leader election, we used randomized election timers to avoid split votes.
[01:18] Interviewer (Dr. Vance): That is standard Raft. But what happened when the partition healed? How did your log reconciliation handle uncommitted log entries on the old leader?
[01:42] Alex Rivera: Oh, um, honestly, we used an existing open-source Raft library under the hood for the low-level RPC log matching and conflict truncation. I wrapped the state machine logic around our application layer rather than writing the core consensus protocol from scratch.
[02:15] Interviewer (Agent Jax): Alex, your resume states: "Architected and implemented a high-performance distributed consensus layer using custom Raft replication". That sounds like a scratch implementation. Why did you describe it as custom?
[02:38] Alex Rivera: That's fair feedback. The wrapper, telemetry, and state machine persistence were custom-built by me, but I should clarify that the core consensus Raft state machine utilized HashiCorp's Raft library.
[03:10] Interviewer (Marcus): Let's talk about the latency metric. You claimed: "Single-handedly reduced P99 write latency by 65% across 4 global regions." How did you achieve that 65% reduction?
[03:40] Alex Rivera: We migrated from synchronous cross-region database locks to local leader writes with asynchronous regional read-replicas, and batched our Kafka disk syncs.
[04:05] Interviewer (Marcus): And was that strictly a solo effort?
[04:22] Alex Rivera: Well, our platform team had 5 engineers working on the infra and Cassandra provisioning, but I drove the protocol redesign and wrote the Go pipeline services. Saying 'single-handedly' in the resume bullet was probably an overstatement from my resume review pass.
[04:58] Interviewer (Elena): Alex, when working across that 5-person team, how did you handle technical disagreements when deciding between Cassandra vs CockroachDB?
[05:25] Alex Rivera: Great question. Two senior teammates wanted CockroachDB for ACID guarantees. I wrote a benchmark RFC demonstrating that our write volume would saturate Cockroach's Raft overhead, while Cassandra gave us the required write throughput. We ran a 1-week bake-off, and everyone agreed on the benchmark data. We kept communication open and no egos were involved.
[06:10] Interviewer (Elena): How do you support junior engineers who are struggling with difficult distributed concepts like distributed deadlocks or eventual consistency?
[06:40] Alex Rivera: I believe in pair programming without taking over the keyboard. I set up local Docker-Compose testbeds with network chaos (injecting packet loss) so they can visually observe node failover and see why eventual consistency behaves the way it does.
[07:15] Interviewer (Marcus): Where do you see your next growth area as an engineering leader?
[07:35] Alex Rivera: I want to bridge the gap between technical architecture and business roadmap—ensuring that our architectural bets directly translate to lower infrastructure burn and faster customer feature velocity.
`
  },
  {
    id: "maya-chen",
    name: "Maya Chen",
    role: "Principal AI & Fullstack Lead",
    experienceYears: 9,
    education: "M.S. in Computer Science (AI/ML), Stanford University (2017)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    summary: "Elite fullstack architect and AI engineer with deep expertise in LLM orchestration, vector retrieval systems, and scalable UI architectures.",
    resumeText: `MAYA CHEN
Email: maya.chen@example.com | GitHub: github.com/mayachen-ai | Website: mayachen.io

PROFESSIONAL SUMMARY
Principal AI & Fullstack Architect with 9 years of experience. Creator of open-source agent framework 'NexusCore' (8.2k stars). Expert in LLM serving, semantic search, latency optimization, and reactive modern frontends.

CORE SKILLS
- AI & Orchestration: PyTorch, LangChain, LlamaIndex, vLLM, TensorRT-LLM, Vector DBs (Qdrant, Milvus)
- Fullstack & Systems: TypeScript, Next.js, React, Rust, Python, WebSockets, Redis, PostgreSQL
- Leadership: Technical Strategy, Team Scaling (0 to 18 devs), Open Source Governance

EXPERIENCE

Principal Architect | Synthetix AI Labs (2021 - Present)
- Designed and built an enterprise LLM streaming orchestration platform handling 180M tokens/day with p95 latency under 120ms.
- Built speculative decoding and semantic KV-cache layers in Rust and Python, reducing inference compute costs by $420k/year.
- Authored open-source framework 'NexusCore' (8,200 GitHub stars, 140 community contributors).
- Established company-wide engineering guidelines for prompt regression testing, synthetic data eval, and red-teaming.

Senior Fullstack Lead | Horizon Digital (2017 - 2021)
- Spearheaded redesign of real-time collaborative workspace used by 450,000 monthly active enterprise users.
- Migrated legacy monolith to a micro-frontend architecture with Next.js, WebAssembly, and CRDT-based offline sync.
- Mentored 12 engineers, with 4 advancing to tech lead and staff roles under direct sponsorship.

EDUCATION
M.S. in Computer Science (Artificial Intelligence), Stanford University (2017)
B.S. in Computer Science & Applied Mathematics, UC Berkeley (2015)
`,
    transcriptText: `[00:00] Interviewer (Dr. Vance): Welcome Maya. Your background in high-throughput LLM serving is impressive. Can you walk us through the speculative decoding and semantic KV-cache architecture you implemented at Synthetix?
[00:35] Maya Chen: Absolutely. At Synthetix, our primary bottleneck was autoregressive generation latency. We implemented speculative decoding using a lightweight 1.5B draft model that proposes 4-token candidate sequences verified in a single forward pass by our 70B target model. For the semantic KV-cache, we built an approximate nearest neighbor lookup in Rust over prefix embeddings. If the incoming system prompt and context overlap by 80%+ cosine similarity, we reuse the pre-computed key-value states, bypassing redundant attention computation.
[01:30] Interviewer (Dr. Vance): How did you maintain KV-cache eviction consistency under high memory pressure across GPU nodes?
[01:58] Maya Chen: We implemented a modified LRU policy weighted by token length and generation frequency, backed by host pinned memory swapping. If GPU VRAM crossed 88%, we offload inactive KV pages via CUDA async streams to CPU memory instead of discarding them.
[02:30] Interviewer (Agent Jax): Maya, your open-source project NexusCore claims 8.2k GitHub stars. Did you build this independently or within your company time? Are there any IP conflicts?
[02:55] Maya Chen: NexusCore was created by me in 2022 as an independent MIT-licensed project before my current company incorporated agentic workflows. I have a signed IP carve-out agreement with Synthetix legal confirming open-source ownership. We have over 140 external contributors, and the governance is fully public on GitHub.
[03:30] Interviewer (Marcus): The $420k/year compute savings claim—how was that audited and validated?
[03:52] Maya Chen: That was audited directly against our AWS and RunPod GPU cloud billing logs over two quarters. By achieving a 42% cache hit rate and a 2.4x token acceptance rate on speculative decoding, we dropped our active A100 GPU cluster footprint from 32 nodes to 18 nodes while maintaining identical throughput SLAs.
[04:30] Interviewer (Elena): Maya, you've scaled teams and mentored 12 engineers. Can you share an example of how you handled a situation where an engineer was burning out or struggling to meet deliverables?
[05:00] Maya Chen: Yes. In 2023, one of our senior engineers was working late nights trying to deliver our multi-modal streaming gateway alone. I noticed their PR review velocity slowing and tone becoming abrupt. In our 1-on-1, I took initiative to de-scope the non-critical features, reassigned two backend components to myself and another teammate, and instituted a mandatory no-weekend-deploy policy. We shipped on time without losing a key engineer, and that engineer later went on to lead our observability initiative.
[05:55] Interviewer (Elena): How do you create an inclusive environment where junior members feel safe challenging senior architectural decisions?
[06:25] Maya Chen: Every RFC we publish has a mandatory 'Critique & Failure Modes' section. In our architecture review meetings, junior engineers speak first before principal engineers comment, preventing senior anchoring bias.
`
  },
  {
    id: "jordan-miller",
    name: "Jordan Miller",
    role: "Senior Frontend Architect",
    experienceYears: 6,
    education: "B.A. in Interactive Media & Computer Science, NYU (2020)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    summary: "Dynamic frontend architect known for design system leadership, rapid UI delivery, and cross-functional design sprints.",
    resumeText: `JORDAN MILLER
Email: jordan.miller@example.com | Portfolio: jordanmiller.design | Twitter: @jordanmiller_ui

PROFESSIONAL SUMMARY
Senior Frontend Architect with 6 years of experience driving modern web applications, design systems, and delightful UX. Expert in React 19, TypeScript, CSS Architecture, Next.js, and Web Performance.

CORE SKILLS
- Frontend: React, Next.js, TypeScript, Vue.js, WebGL, TailwindCSS, CSS Modules, Storybook
- Performance: Core Web Vitals, Bundle Optimization, Code Splitting, Lighthouse 100/100 Audits
- UX & Leadership: Design Systems, Figma-to-Code Pipelines, Accessibility (WCAG 2.1 AAA), Agile Sprint Facilitation

EXPERIENCE

Senior Frontend Architect | Nexus Commerce (2022 - Present)
- Led frontend modernization across 12 micro-frontends serving 8M monthly shoppers, improving Core Web Vitals to the 99th percentile.
- Created and open-sourced 'PrismUI', a modern design system with 60+ accessible headless components used across 5 company apps.
- Increased mobile checkout conversion rate by 28% through interactive micro-animations and instantaneous optimistic UI updates.
- Facilitated bi-weekly design sprints with UX researchers, product managers, and executive leadership.

Frontend Engineer | PixelCraft Studio (2020 - 2022)
- Built high-impact interactive e-commerce landing pages with WebGL 3D product previews.
- Reduced initial JS bundle size by 54% using tree-shaking and route-based dynamic imports.

EDUCATION
B.A. in Interactive Media & CS, New York University (2020)
`,
    transcriptText: `[00:05] Interviewer (Elena): Hello Jordan! Your portfolio and design system work are visually breathtaking. How do you ensure tight collaboration between engineering and design?
[00:38] Jordan Miller: Hi Elena! I believe the secret is speaking the same language. I built our Figma-to-Code sync tokens so whenever a designer tweaks an HSL variable or spacing unit in Figma, it triggers a PR in our GitHub design system repo. We also do joint design-engineering pairing sessions every Wednesday.
[01:15] Interviewer (Marcus): Jordan, you mentioned increasing mobile checkout conversion by 28% through optimistic UI updates and micro-animations. How did you isolate the impact of UI vs pricing promotions during that A/B test?
[01:48] Jordan Miller: We ran a clean split-traffic A/B test via LaunchDarkly over a 30-day window with 400k unique visitors. Group A had the standard multi-step checkout with server blocking transitions, while Group B had our optimistic instant-save cart with animated micro-feedback. The conversion lift was statistically significant at p < 0.01.
[02:30] Interviewer (Dr. Vance): Let's transition to deep frontend engineering and diagnostics. When you have a complex React single-page app with multiple Web Workers, canvas animations, and WebSocket streams, how do you diagnose and resolve progressive heap memory leaks and frame-rate stutters?
[03:05] Jordan Miller: Well, we make sure to use Chrome Lighthouse audits on every build, and we keep our bundle size small by code-splitting. We also rely on Sentry for frontend crash alerts.
[03:32] Interviewer (Dr. Vance): Lighthouse and Sentry don't detect memory leak retainers in heap snapshots or detached DOM nodes. Can you explain the specific steps you take inside Chrome DevTools Memory Profiler to trace detached DOM trees and closure memory leaks?
[04:02] Jordan Miller: To be completely transparent, in our team, our platform infra team and senior performance specialists usually dig into the raw heap allocation timelines and C++ v8 profilers. My focus was heavily on component ergonomics, design system primitives, and accessibility.
[04:38] Interviewer (Agent Jax): Jordan, your resume highlights: "Improved Core Web Vitals to the 99th percentile across 12 micro-frontends" and lists "Performance & Heap Optimization" in your skills. Is it accurate to claim frontend architectural leadership if you rely on other engineers to profile memory leaks and thread performance?
[05:10] Jordan Miller: I led the architectural component boundaries, code-splitting rules, and asset delivery pipelines, which directly brought our LCP and CLS to the top percentile. But when it comes to low-level V8 garbage collection internals and raw heap allocations, I collaborate with specialized backend/infra engineers.
[05:45] Interviewer (Marcus): How comfortable are you diving into backend API contracts and Node.js BFF (Backend For Frontend) layers?
[06:05] Jordan Miller: I am very comfortable with GraphQL schema definitions and RESTful BFF endpoints in Next.js API routes, but I prefer focusing on user-facing frontend excellence.
`
  },
  {
    id: "liam-patel",
    name: "Liam Patel",
    role: "Growth Backend Engineer",
    experienceYears: 5,
    education: "B.S. in Software Engineering, UT Austin (2021)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    summary: "Backend growth engineer specializing in experimentation engines, user lifecycle pipelines, and database query optimization.",
    resumeText: `LIAM PATEL
Email: liam.patel@example.com | GitHub: github.com/liampatel | LinkedIn: linkedin.com/in/liampatel

PROFESSIONAL SUMMARY
Data-driven Growth Backend Engineer with 5 years of experience building high-scale experimentation frameworks, viral referral mechanics, and high-throughput messaging pipelines.

CORE SKILLS
- Backend: Python, FastAPI, Node.js, PostgreSQL, Redis, RabbitMQ, Docker
- Growth & Analytics: Multi-Armed Bandit Experimentation, Segment, Mixpanel, BigQuery, Kafka
- Database: PostgreSQL Index Tuning, Redis Caching, Connection Pooling, Query Profiling

EXPERIENCE

Growth Backend Engineer | FinPulse Global (2022 - Present)
- Engineered real-time referral & viral loop engine driving $14M in incremental ARR and a 300% surge in user conversions.
- Re-architected notification dispatcher from monolithic cron jobs to distributed RabbitMQ queues, delivering 12M push alerts/day.
- Optimized PostgreSQL transaction query performance, slashing checkout lock contention by 70%.

Software Engineer | Streamline Media (2021 - 2022)
- Built user onboarding APIs and integrated Stripe billing subscriptions for 150k active subscribers.
- Created telemetry pipelines logging user clickstream events directly into Snowflake and BigQuery.

EDUCATION
B.S. in Software Engineering, University of Texas at Austin (2021)
`,
    transcriptText: `[00:02] Interviewer (Marcus): Hi Liam. That $14M incremental ARR bullet on your resume caught my eye. Can you break down how your referral engine generated that revenue?
[00:30] Liam Patel: Thanks Marcus! At FinPulse, we noticed our customer acquisition costs were climbing on paid channels. I built an event-driven referral system where users earned instant micro-yield rewards when friends signed up and deposited funds. The virality coefficient (K-factor) jumped from 0.4 to 1.35.
[01:10] Interviewer (Agent Jax): Liam, $14M ARR is massive for a 5-year engineer. Was this $14M purely generated by your referral code logic, or was there an accompanying multi-million dollar marketing campaign and brand advertising run concurrently?
[01:38] Liam Patel: Well, our marketing department ran a nationwide campaign at the same time, which certainly drove top-of-funnel traffic. But our referral engine converted and retained those users. The $14M figure was the total ARR attributed to the growth campaign cohort where the referral loop was active.
[02:12] Interviewer (Agent Jax): So if marketing drove the acquisition, claiming that you "Engineered engine driving $14M ARR" as a solo bullet point claims full attribution for a company-wide marketing effort, doesn't it?
[02:35] Liam Patel: In hindsight, I can see how that looks. The $14M was the cohort total; my contribution was the backend code, fraud prevention algorithms, and instant reward ledger that made the mechanics work.
[03:05] Interviewer (Dr. Vance): Let's talk about the PostgreSQL lock contention. How did you reduce checkout lock contention by 70%?
[03:32] Liam Patel: We had a table with row-level locks on user balance updates during concurrent referral credit payouts. I changed the schema from in-place updates to an append-only ledger pattern with background reconciliation workers, eliminating row lock wait times.
[04:10] Interviewer (Dr. Vance): That is a solid pattern. How did you handle idempotency for background reconciliation when a worker crashed mid-batch?
[04:35] Liam Patel: We used PostgreSQL advisory locks per batch ID and stored transaction UUIDs in Redis with a 24-hour TTL to reject duplicate incoming ledger entries.
[05:15] Interviewer (Elena): Liam, in fast-paced growth teams, product managers often push to ship hacks quickly without unit tests. How do you balance rapid growth experimentation with engineering quality?
[05:45] Liam Patel: I use feature flags for quick-and-dirty experiments, but I isolate experiment logic into modular plugins. If an experiment loses the A/B test, we delete the flag and code cleanly within 2 weeks so it doesn't leave technical debt behind.
`
  }
];
