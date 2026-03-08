---
id: L-001
source:
  type: human
  protocol: SNPR-20260307-c8a1
  phase: discover
confidence: 0.95
status: active
scope:
  agents: [lead-orchestrator]
  phases: [discover, plan]
created: "2026-03-07"
updated: "2026-03-07"
applied_in: [SNPR-20260307-c8a1]
history:
  - timestamp: "2026-03-07T23:59:00Z"
    event: validated_by_absence
    detail: "No recurrence in SNPR-20260307-c8a1. Stories were correctly deferred to plan phase. Discover gate passed first attempt."
    confidence_delta: +0.05
---

# Discover phase must gate spec/PRD before stories

**Learning:** The discover phase must present the spec and PRD for interactive review and get explicit user approval BEFORE creating stories. Stories depend on architecture decisions made in the plan phase, so they should not be produced during discover.

**Anti-pattern:** Running analyst + product-manager in parallel during discover, where the PM produces stories alongside the PRD without waiting for spec approval and architecture.

**Correction:** Discover phase should produce only the spec (analyst) and PRD (product-manager) — no stories. Present both for user review. After approval, the plan phase produces architecture, and THEN stories are created based on the approved architecture.
