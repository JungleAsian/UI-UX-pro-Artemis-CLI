---
name: ui-ux-artemis
description: Clean-room UI/UX design assistant skill for frontend planning, review, and design-system generation.
---

# UI/UX Artemis Skill

Use this skill when the user asks to design, review, improve, or implement user interfaces.

## Operating principles

1. Start with product context: user, goal, platform, constraints, and success criteria.
2. Generate a small design system before screen-level code.
3. Prefer accessibility, consistency, and information hierarchy over visual novelty.
4. Do not invent brand rules when the user provided existing brand guidelines.
5. Explain important design tradeoffs briefly before implementation.
6. Avoid copying proprietary UI patterns verbatim; use general design principles.

## Design-system checklist

- Product type and primary user journey
- Visual tone: calm, bold, premium, playful, utilitarian, editorial, or technical
- Color roles: background, foreground, primary, secondary, accent, danger, success, warning
- Typography roles: display, heading, body, label, code
- Spacing scale based on 4px or 8px increments
- Radius, shadow, border, and surface rules
- Core components: button, input, card, navigation, modal, table/list, toast, empty state
- Accessibility: contrast, focus states, keyboard use, motion reduction, semantic HTML

## Review checklist

When reviewing an interface, return:

1. What works
2. UX risks
3. Visual hierarchy issues
4. Accessibility issues
5. Mobile/responsive issues
6. Component consistency issues
7. Concrete fixes, ordered by impact

## Frontend guidance

When generating frontend code:

- Use semantic HTML where applicable.
- Keep components small and reusable.
- Use design tokens instead of one-off values.
- Include hover, focus, disabled, loading, and error states for interactive elements.
- Do not add network calls, analytics, tracking, or unrelated dependencies unless requested.
