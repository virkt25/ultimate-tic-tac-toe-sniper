# User Personas & Journey Maps: Ultimate Tic Tac Toe

> **Status:** Draft
> **Author:** Discovery Team — User Researcher
> **Date:** 2026-02-17

## Persona Overview
This browser-based Ultimate Tic Tac Toe game targets local multiplayer users who share a single device. Primary users include casual gamers seeking quick entertainment, strategy enthusiasts who enjoy tactical gameplay, office workers on breaks, and families/friends in social settings. The game serves both newcomers who need to learn the rules and experienced players who want a polished, frustration-free implementation.

---

## Persona 1: The Casual Break-Taker

### Demographics & Context
- **Role:** Office worker, student, or remote professional
- **Experience Level:** Beginner to intermediate with Ultimate Tic Tac Toe
- **Tech Savviness:** Medium
- **Usage Frequency:** Daily to weekly (during breaks, downtime)

### Goals
1. Find quick, engaging entertainment during 5-10 minute breaks
2. Play a game that's easy to understand but mentally stimulating
3. Challenge a coworker or friend without complicated setup
4. Learn Ultimate Tic Tac Toe rules if unfamiliar

### Pain Points
1. Doesn't remember all the special rules of Ultimate Tic Tac Toe (which board is active?)
2. Gets frustrated when UI doesn't clearly indicate what moves are valid
3. Limited time means can't afford confusing interfaces or slow load times
4. Needs to quickly pass device back and forth between players

### Current Workflow
Currently plays regular tic-tac-toe on paper, uses mobile apps with ads and poor UX, or searches for web versions with clunky interfaces and unclear rule implementations.

### User Journey Map

| Stage | Action | Touchpoint | Emotion | Opportunity |
|-------|--------|------------|---------|-------------|
| Awareness | Friend mentions "ultimate tic-tac-toe" during lunch | Word of mouth | Curious, slightly confused | Clear value prop on landing |
| Onboarding | Opens URL, sees game board | Initial page load | Overwhelmed by complex grid | Interactive tutorial or rule overlay |
| First Use | Clicks a cell, receives error feedback | Game board interaction | Frustrated (invalid move) | Visual highlighting of valid moves |
| Regular Use | Plays 2-3 games per break session | Repeated gameplay | Engaged, competitive | Quick rematch button, move history |
| Advanced Use | Teaches the game to new coworkers | Social sharing | Proud, social connector | Shareable link, spectator mode |

### Key Scenarios

#### Scenario 1: Lunchtime Challenge
- **Context:** Two coworkers finish lunch early and have 10 minutes before a meeting
- **Trigger:** One says "Want to play a quick game?"
- **Steps:**
  1. Opens browser on laptop
  2. Navigates to game URL
  3. Player 1 makes first move
  4. Passes laptop to Player 2
  5. Players alternate until someone wins
- **Success Criteria:** Game completes in under 8 minutes with clear winner, both players understand what happened

#### Scenario 2: Learning the Rules
- **Context:** Player has heard of Ultimate Tic Tac Toe but never played
- **Trigger:** Friend challenges them to a game
- **Steps:**
  1. Arrives at game with no prior knowledge
  2. Attempts to click anywhere on board
  3. Receives feedback about which moves are valid
  4. Gradually infers rules through gameplay
- **Success Criteria:** Player understands basic rules after one complete game without external documentation

---

## Persona 2: The Strategy Enthusiast

### Demographics & Context
- **Role:** Board game hobbyist, puzzle solver, competitive gamer
- **Experience Level:** Advanced (familiar with Ultimate Tic Tac Toe rules)
- **Tech Savviness:** High
- **Usage Frequency:** Multiple times per week

### Goals
1. Find a clean, bug-free implementation of Ultimate Tic Tac Toe
2. Focus on strategic depth without UI distractions
3. Analyze completed games to improve strategy
4. Play quickly with minimal friction (keyboard shortcuts, fast interactions)

### Pain Points
1. Many implementations have rule bugs (incorrect win conditions, wrong board activation)
2. Poor visual design makes it hard to see board state at a glance
3. Slow animations or unnecessary confirmations disrupt flow
4. Can't review move history or game state from earlier in the match

### Current Workflow
Uses paper grids for serious play, sketches game trees, or plays on mobile apps with bugs. Often frustrated by incorrect implementations that don't match official rules.

### User Journey Map

| Stage | Action | Touchpoint | Emotion | Opportunity |
|-------|--------|------------|---------|-------------|
| Awareness | Searches "ultimate tic tac toe online" | Search engine | Skeptical (burned by bad implementations) | Clear rule accuracy statement |
| Onboarding | Scans interface for rule correctness | Visual inspection | Analytical, judging quality | Show rule clarifications upfront |
| First Use | Plays through edge cases (board ties, send-anywhere) | Gameplay testing | Relieved when rules work correctly | Smooth handling of edge cases |
| Regular Use | Plays 5-10 games in sitting | Extended sessions | Deeply focused, in flow | Performance optimization, no lag |
| Advanced Use | Recommends to strategy game communities | Social proof, reviews | Evangelical advocate | Stats, game history export |

### Key Scenarios

#### Scenario 1: Rule Verification
- **Context:** Player wants to verify this implementation follows official rules
- **Trigger:** Previous web versions had bugs
- **Steps:**
  1. Deliberately creates edge case scenarios (tied sub-board, won sub-board, send-anywhere situation)
  2. Tests whether game correctly handles each case
  3. Checks win condition logic
- **Success Criteria:** All edge cases handled correctly, matches expected Ultimate Tic Tac Toe tournament rules

#### Scenario 2: Deep Strategy Session
- **Context:** Weekend evening, wants to practice with a friend
- **Trigger:** Upcoming game night tournament
- **Steps:**
  1. Opens game with serious strategic intent
  2. Plays multiple games rapidly
  3. Mentally tracks patterns and strategies
  4. Discusses moves with opponent between games
- **Success Criteria:** Can play 10+ games in 30 minutes without UI friction, game never bugs out

---

## Persona 3: The Social Player

### Demographics & Context
- **Role:** Parent, teacher, friend group organizer
- **Experience Level:** Varies (often teaching others)
- **Tech Savviness:** Low to medium
- **Usage Frequency:** Weekly (social gatherings, family time)

### Goals
1. Find an activity that works for mixed-age groups
2. Introduce people to an interesting twist on tic-tac-toe
3. Create fun social moments with minimal technical hassle
4. Keep everyone engaged without complex rules explanations

### Pain Points
1. Hard to explain Ultimate Tic Tac Toe rules verbally
2. Younger/older players get confused by which board is active
3. Device passing feels awkward (whose turn? who touched screen?)
4. Needs to work on various devices (tablet, phone, laptop)

### Current Workflow
Uses physical board games, draws grids on paper, or plays simpler games that don't require as much explanation.

### User Journey Map

| Stage | Action | Touchpoint | Emotion | Opportunity |
|-------|--------|------------|---------|-------------|
| Awareness | Sees game at friend's house or school | Social setting observation | Intrigued, wants to bring home | Easy shareable URL, memorable name |
| Onboarding | Opens on family tablet during game night | Shared device setup | Hopeful but uncertain | "How to play" accessible but optional |
| First Use | Teaches two kids how to play | Teaching experience | Slightly overwhelmed (two novices) | Visual cues reduce explanation burden |
| Regular Use | Game becomes Friday night tradition | Weekly ritual | Warm, connected | Celebration animations, fun feedback |
| Advanced Use | Introduces at school classroom or club | Evangelism in educational settings | Proud facilitator | Kid-friendly UI, no distracting elements |

### Key Scenarios

#### Scenario 1: Family Game Night
- **Context:** Parents with two children (ages 10 and 14) on a Friday evening
- **Trigger:** Kids ask to play something together
- **Steps:**
  1. Parent suggests trying "that cool tic-tac-toe game"
  2. Opens game on living room tablet
  3. Parent explains basic concept while first game starts
  4. Kids play while parent watches and answers questions
  5. Winner celebrates, quick rematch
- **Success Criteria:** Kids grasp rules within one game, want to play again, minimal parent intervention needed

#### Scenario 2: Classroom Brain Break
- **Context:** Middle school teacher has 10 minutes before class ends
- **Trigger:** Lesson finishes early, students are restless
- **Steps:**
  1. Teacher projects game on classroom screen
  2. Two student volunteers play while class watches
  3. Class discusses strategy and next moves
  4. Winner is celebrated, teacher transitions to closing
- **Success Criteria:** Students stay engaged, game is appropriate for all ages, no technical issues

---

## Persona 4: The Quick Competitor

### Demographics & Context
- **Role:** College student, young professional
- **Experience Level:** Intermediate
- **Tech Savviness:** High
- **Usage Frequency:** Multiple times per week (spontaneous challenges)

### Goals
1. Crush friends in quick matches
2. Develop reputation as "unbeatable" at Ultimate Tic Tac Toe
3. Play anywhere (phone during commute, laptop at dorm)
4. Instant rematches to prove victories weren't flukes

### Pain Points
1. Loading times kill momentum of competitive banter
2. Unclear win states lead to disputes ("Did I win? Where?")
3. Can't see previous game result when starting rematch
4. Mobile versions often broken or janky

### Current Workflow
Challenges friends to various quick skill games (pool, darts, mobile games), but wants something more strategic than reflex-based. Currently no good Ultimate Tic Tac Toe option.

### User Journey Map

| Stage | Action | Touchpoint | Emotion | Opportunity |
|-------|--------|------------|---------|-------------|
| Awareness | Friend sends link via text message | Mobile sharing | Competitive, ready to battle | Instant load on mobile |
| Onboarding | Opens link immediately, no patience for tutorials | Mobile browser | Impatient, confident | Skip-able intro, jump to gameplay |
| First Use | Rapidly makes moves, competitive banter with opponent | Fast-paced gameplay | Hyper-focused, trash-talking | Responsive UI, satisfying clicks |
| Regular Use | Sends link to new opponents after victories | Viral sharing loop | Dominant, status-seeking | Win/loss tracking, bragging rights |
| Advanced Use | Becomes "the person" who always has this game ready | Social identity | Pride in expertise | Quick access, bookmark-able |

### Key Scenarios

#### Scenario 1: Dorm Room Showdown
- **Context:** Friday night, group of friends hanging out
- **Trigger:** Someone says "I bet I can beat anyone here at strategy"
- **Steps:**
  1. Another friend pulls up game on laptop
  2. Challenge begins immediately
  3. Group gathers around to watch
  4. Winner gloats, loser demands rematch
  5. Best-of-three series unfolds
- **Success Criteria:** Zero downtime between games, clear victory conditions, spectators can follow action

#### Scenario 2: Coffee Shop Kill Time
- **Context:** Waiting for third friend to arrive at coffee shop
- **Trigger:** 15 minutes to kill, two friends present
- **Steps:**
  1. Opens game on phone
  2. Plays on small screen while sipping coffee
  3. Completes 2-3 quick games
  4. Third friend arrives, conversation resumes
- **Success Criteria:** Mobile UI works perfectly, can pause/resume easily, no data/wifi issues

---

## Cross-Persona Analysis

### Shared Needs
- **Clarity:** All personas need to immediately understand which moves are valid and which board is active
- **Speed:** Everyone values fast load times and responsive interactions
- **Correctness:** Rule implementation must be bug-free and match expected behavior
- **Accessibility:** Game must work across devices (desktop, tablet, mobile)
- **Zero friction:** No accounts, no downloads, no setup - just play

### Conflicting Needs
- **Tutorial vs. Speed:** Casual Break-Taker and Social Player may need rule explanations, while Strategy Enthusiast and Quick Competitor want to skip straight to gameplay
  - **Resolution:** Optional, dismissible tutorial/rule overlay. Never force tutorial on repeat visitors.

- **Visual complexity:** Strategy Enthusiast wants minimal UI distractions, while Social Player needs extra visual cues to reduce teaching burden
  - **Resolution:** Clear visual hierarchy with highlighting for active board, but clean aesthetic overall. Progressive disclosure.

- **Pace:** Quick Competitor wants instant rematches, while Social Player may want time to discuss/celebrate
  - **Resolution:** Show win state clearly with celebration, but make "New Game" button immediately available

### Prioritization
| Persona | Priority | Justification |
|---------|----------|---------------|
| The Casual Break-Taker | P0 | Largest potential user base, represents most common use case (quick casual play). If UI doesn't serve this persona, game fails. |
| The Strategy Enthusiast | P0 | Vocal influencer group who will evangelize or criticize. Correct rule implementation is table stakes. Their feedback drives quality. |
| The Social Player | P1 | Important for virality and educational settings, but needs overlap with P0 personas. Secondary optimization target. |
| The Quick Competitor | P1 | High engagement but smaller segment. Many needs overlap with Casual Break-Taker. Mobile optimization is key differentiator. |

## Friction Points Summary
1. **Rule confusion:** Players don't understand which board is active or what moves are valid - causes frustration and abandoned games
2. **Unclear win conditions:** Players miss that someone won, or dispute whether a win actually occurred - undermines competitive integrity
3. **Device passing awkwardness:** Local multiplayer requires physical device handoff, creating social friction and accidental touches
4. **Poor mobile experience:** Small screens make complex 3x3 grid of 3x3 grids hard to parse - limits accessibility
5. **No move validation feedback:** Clicking invalid cell provides no helpful guidance - punishes learning players

## Moments of Delight
1. **"Aha!" moment:** When visual highlighting suddenly makes the rules click for a new player - creates sense of mastery
2. **Satisfying win celebration:** Clear visual feedback when someone wins (animation, sound?) - makes victory feel earned
3. **Instant rematch flow:** "New Game" button appears immediately after win with no page reload - enables "best of 3" momentum
4. **Mobile "just works":** Opening link on phone and having it perfectly formatted - exceeds low expectations for web games
5. **Strategy depth reveal:** Experienced player realizes the meta-strategy of board control - creates long-term engagement
6. **Teaching success:** When a parent/teacher watches two novices play without intervention - proves intuitive design
