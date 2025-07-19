# Generate Requirements Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Purpose-built Claude Code command that turns a terse feature description ($ARGUMENTS)
    into a machine-readable Product Requirements Document (PRD) using the Volere + IEEE
    hybrid structure. It loads repository knowledge from:
      • .claude/repo-context.md
      • CLAUDE.md
      • .claude/glossary.md (autocreated/updated)
    The agent iteratively elicits clarifications until every mandatory Volere section,
    all key quality attributes (with emphasis on latency/performance), GDPR constraints,
    and MoSCoW-prioritised user stories are complete.
    A review sub-agent performs an independent quality-gate pass before final write.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS FOR THE COMMAND ---------- -->
  <requirements>
    - Accept a single free-text argument string ($ARGUMENTS).
    - Abort with explicit error if any context file is missing or unreadable.
    - Comprehensive questioning strategy:
      * Minimum 15 clarification questions for standard projects
      * 20-30 questions for complex/enterprise projects
      * Coverage tracking: ensure all 25+ predefined categories are explored
      * Adaptive depth: 2-3 follow-up questions per critical area
      * Complexity scoring: adjust question count based on detected scope
    - Fast mode (--fast flag): Still ask minimum 8-10 essential questions
    - Normal mode: Continue until comprehensive coverage achieved (typically 15-25 questions)
    - Dynamic question generation based on user responses and detected patterns
    - Multi-level questioning with intelligent follow-ups
    - Track coverage progress and show percentage complete
    - Enforce MoSCoW with Must-Have effort ≤ 60 %.
    - Express functional needs as INVEST atomic user-story objects plus system-shall
      clauses.
    - Quantify all NFRs using Quality-Attribute Scenario template
      (Stimulus → Environment → Artifact → Response → Measure).
    - Attach SMART goal metadata where time-bound outcomes exist.
    - Generate risk register (probability, impact, mitigation, owner).
    - Maintain glossary in .claude/glossary.md (create if absent, update terms).
    - Ensure each requirement links to unique ID for traceability matrix fields
      (need_id, test_case_ref, design_link).
    - Produce a **JSON PRD** file in `.plan/01_requirements/NN_<slug>.json`,
      where NN is next available ascending number with zero-pad (01, 02…).
    - Return concise summary of actions to stdout.
    - When asking clarifying questions ask them in sequence one at a time, waiting for the user's input then proceed to the next one.
    - Allow users to request additional questions with /more command
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <init>
         - Verify presence of context & glossary files; abort on failure.
         - Read files, summarise via map-reduce to 3 × 256-token chunks for prompt efficiency.
    2. <parse-input>
         - Derive provisional feature synopsis, domain nouns, implied stakeholders.
    3. <clarification-loop>
         - Initialize coverage tracker with 25+ question categories
         - Core question categories (ask ALL of these):
           * Actors & Users: primary users, secondary users, admin roles, system actors
           * Business Context: business goals, KPIs, success metrics, ROI expectations
           * Functional Scope: core features, nice-to-haves, explicitly out-of-scope items
           * Technical Constraints: platform requirements, browser support, device types
           * Performance: latency targets, throughput needs, concurrent users, response times
           * Scale: data volumes, growth projections, peak loads, geographic distribution
           * Security: authentication methods, authorization levels, data encryption, compliance
           * Data: data types, retention policies, privacy requirements, GDPR classes
           * Integration: external systems, APIs, third-party services, data exchange formats
           * User Experience: accessibility needs, localization, responsive design requirements
           * Error Handling: failure modes, recovery strategies, user notifications
           * Monitoring: logging requirements, analytics, alerting thresholds
           * Deployment: environments, release cadence, rollback procedures
           * Testing: test data needs, coverage requirements, acceptance criteria
           * Documentation: user guides, API docs, admin manuals, training materials
           * Migration: existing system data, transition period, backward compatibility
           * Compliance: regulatory requirements, industry standards, audit trails
           * Budget: cost constraints, resource availability, timeline boundaries
           * Risks: technical risks, business risks, external dependencies
           * Edge Cases: boundary conditions, exceptional scenarios, failure points
         - Adaptive questioning strategy:
           * Analyze each response for implicit assumptions
           * Generate 2-3 follow-up questions for complex areas
           * Detect technology-specific requirements and probe deeper
           * Identify contradictions and seek clarification
         - Progress tracking:
           * Show coverage percentage after every 5 questions
           * Highlight unexplored critical areas
           * Allow user to see remaining categories with /status
         - Continue until:
           * All categories have at least one question answered
           * Critical categories have 2-3 clarifications each
           * User explicitly issues /done or /skip
           * Minimum 15 questions answered (even in fast mode: minimum 8)
    4. <draft-reqs>
         - Build internal JSON structure:
             {
               "meta": { "title": "", "version": "0.1.0", "date": "<ISO-8601>" },
               "stakeholders": [],
               "vision": "",
               "requirements": {
                 "functional": [ { "id": "F-001", "story": "", "shall": "", "moscow": "", "acceptance": { "gherkin": "" } } ],
                 "non_functional": [ { "id": "N-001", "quality": "Performance", "scenario": { "stimulus": "", "response": "", "measure": "" }, "threshold": "" } ]
               },
               "risks": [ { "id": "R-001", "prob": "", "impact": "", "mitigation": "" } ],
               "glossary_refs": [],
               "traceability": []
             }
    5. <self-critique>
         - Run comprehensive checklist:
             * Question coverage: minimum 15 questions asked?
             * Category coverage: all 25+ categories explored?
             * Follow-up depth: critical areas have 2-3 clarifications?
             * All Must-Have ≤ 60 %?
             * Every requirement SMART/INVEST?
             * NFR latency quantified?
             * Risk register non-empty?
             * Glossary updated?
             * Edge cases documented?
             * Integration points clarified?
             * Performance metrics specific?
    6. <sub-agent-review>
         - Spawn “Reviewer Agent” with role = Requirements Auditor.
         - Provide draft JSON; ask for anomalies, missing areas, conflicting MoSCoW tags.
         - Merge feedback.
    7. <write-output>
         - Determine next NN prefix; mkdir -p .plan/01_requirements if needed.
         - Write JSON file; overwrite on re-run only if --overwrite flag present.
    8. <report>
         - Echo summary: path, counts, any open questions.
  </execution>

  <!-- ---------- 4. VALIDATION / QUALITY GATES ---------- -->
  <validation>
    - [ ] Minimum 15 clarification questions asked (8 in fast mode).
    - [ ] All 25+ question categories have at least one response.
    - [ ] Critical categories (performance, security, scale) have 2-3 clarifications each.
    - [ ] Follow-up questions generated for complex responses.
    - [ ] Coverage tracking shows >90% completion.
    - [ ] Volere sections populated (Vision, Scope, Stakeholders, Constraints, FRs, NFRs,
          Glossary, Risks, Assumptions).
    - [ ] ≤ 60 % Must-Have effort.
    - [ ] Each requirement INVEST-compliant.
    - [ ] All NFRs quantified with measurable thresholds.
    - [ ] Acceptance criteria in Gherkin syntax compile without parser errors.
    - [ ] Glossary terms referenced ≥ 1 time in doc.
    - [ ] Risk register includes probability & impact ratings.
    - [ ] JSON schema validates (draft-2020-12).
    - [ ] Reviewer sub-agent signed off.
  </validation>

  <!-- ---------- 5. EXAMPLE INVOCATIONS ---------- -->
  <examples>
    ```bash
    # Generate full PRD interactively
    /code:plan:gen-reqs "Enable users to schedule recurring payments"

    # Fast mode (minimum 8-10 essential questions)
    /code:plan:gen-reqs --fast "Provide dark-mode toggle in settings"

    # Overwrite existing numbered file
    /code:plan:gen-reqs --overwrite "Add web-socket live chat support"
    ```

  </examples>

  <!-- ---------- 6. QUESTION TEMPLATES & ADAPTIVE LOGIC ---------- -->
  <question-templates>
    <initial-questions>
      <!-- These form the foundation - always ask these first -->
      1. "What is the primary business problem this feature/system solves?"
      2. "Who are the main users and what are their roles?"
      3. "What does success look like? How will you measure it?"
      4. "What are the must-have vs nice-to-have features?"
      5. "What's the expected timeline and any hard deadlines?"
    </initial-questions>

    <follow-up-patterns>
      <!-- Dynamic follow-ups based on response patterns -->
      <if-mentions keywords="performance, fast, speed, latency">
        - "What are the specific performance targets? (e.g., <100ms response time)"
        - "What's the expected concurrent user load?"
        - "Are there specific operations that are performance-critical?"
      </if-mentions>

      <if-mentions keywords="integration, API, external, third-party">
        - "Which specific systems need to integrate?"
        - "What are the data formats and protocols?"
        - "What happens if an external system is unavailable?"
      </if-mentions>

      <if-mentions keywords="secure, security, authentication, sensitive">
        - "What are the specific security requirements?"
        - "Who can access what data/features?"
        - "Are there compliance requirements (GDPR, HIPAA, etc.)?"
      </if-mentions>
    </follow-up-patterns>

    <depth-probing>
      <!-- Questions to dig deeper into vague responses -->
      - If user says "it should be fast": "Can you quantify 'fast'? What's the maximum acceptable response time?"
      - If user says "many users": "Can you estimate the number? Hundreds, thousands, or millions?"
      - If user says "secure": "What specific security threats are you concerned about?"
      - If user says "easy to use": "Can you describe the ideal user workflow?"
    </depth-probing>

    <edge-case-exploration>
      <!-- Always explore boundaries and failure modes -->
      - "What should happen when [the system fails/network is down/data is invalid]?"
      - "What's the maximum [data size/user count/transaction volume] we need to handle?"
      - "What are the minimum requirements for the system to function?"
      - "Are there any scenarios where the system should refuse to operate?"
    </edge-case-exploration>

  </question-templates>

  <!-- ---------- 7. COVERAGE TRACKING ALGORITHM ---------- -->
  <coverage-algorithm>
    1. Initialize all 25+ categories as "unexplored"
    2. For each question asked:
       - Mark relevant categories as "explored"
       - Increment depth counter for that category
       - Calculate coverage percentage
    3. Priority scoring:
       - Critical categories (security, performance, data) = weight 2.0
       - Standard categories = weight 1.0
       - Nice-to-have categories = weight 0.5
    4. Continue questioning until:
       - Weighted coverage > 90% OR
       - Minimum questions reached (15 normal, 8 fast) AND critical coverage > 95%
    5. Show progress: "[Coverage: 73% | Questions: 14/15 | Critical areas: 8/10]"
  </coverage-algorithm>
</instructions>
