# Working on the Aurum Design System

Aurum is a design system for money interfaces: design tokens, guidelines and a
React component library in TypeScript, built for a personal finance app. It is
built in small steps, each decided with the user before it is made.

## Read first

1. `docs/ROADMAP.md`: where the work is now, and every item planned or
   deferred, in order.
2. `docs/decisions/`: the choices already made, and why.
3. `docs/updating.md`: the update routine, run at the start of every roadmap
   item.
4. Decision 0039: where each file goes.
5. `docs/accessibility.md`: the target, and how each criterion is checked.

## Rules

- **Never guess.** Before stating what exists, what was done or what was
  discussed, check it: read the files, the history, the roadmap and the
  decisions. If it cannot be checked, say so instead of assuming.
- **Check before recording.** Verify versions, names and facts about tools in
  their official sources before writing them into a decision or a build file.
- **No unilateral decisions.** Any choice that affects the repository is
  raised as a question, with a recommendation, and decided by the user.
- **One point per question.** Never bundle several choices into one question
  to approve at once.
- **Each tool is decided in the commit that introduces it**, not ahead of time.
- **Decisions are recorded when adopted.** A choice is adopted when the first
  commit that depends on it is made. That commit records it in
  `docs/decisions/`, with its reasons.
- **Small steps.** One step at a time, one commit per step, each leaving the
  repository working. Do not work ahead.
- **Stay in scope.** Anything found along the way that is outside the step
  goes into the roadmap instead of being fixed on the side.
- **Nothing discussed is lost.** Whatever is deferred in a conversation goes
  into `docs/ROADMAP.md` right away.
- **Test first.** Write the test cases, show them failing, then implement.
- **Accessibility in the open.** Every component's proposal and report go through
  `docs/accessibility.md`: what applies, what has a check and what does not.
- **Fictitious data only.** Never real data, not even anonymized.
- **English in the repository.** Code, names, documentation and commits are in
  English. Talk to the user in Portuguese.
- **Commit only when the user approves.** Conventional messages (`feat:`,
  `fix:`, `docs:`, `chore:`…). Never add `Co-Authored-By`, `Claude-Session` or
  any other attribution trailer. The user reviews and pushes.

## The rhythm of a step

1. Propose the step and list its open points.
2. The user decides them, one at a time.
3. Write the tests and show them failing. In a step without code, write the
   document to review instead.
4. Implement, then show the tests passing.
5. The user reviews and approves the commit, then pushes.

`docs/ROADMAP.md` is updated in the commit of each step, so a new session can
resume from it.

## Talking to the user

- Be concise.
- One point per message, the most important first.
- Keep each message at one level of abstraction. Do not mix principles with
  implementation details.
