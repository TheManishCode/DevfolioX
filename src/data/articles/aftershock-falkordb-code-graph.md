Every engineer has asked the same question before merging: **what breaks if I change this?** Usually the answer comes from grep, memory, and a full test run that takes too long. For Graph Hacks (WeMakeDevs × FalkorDB) I built **Aftershock**, a tool that answers that question with graph traversals instead of guesswork, and shows the evidence behind every answer.

- **Code:** [github.com/TheManishCode/aftershocks---Graph-Hacks](https://github.com/TheManishCode/aftershocks---Graph-Hacks)
- **Live UI:** [aftershock-eta.vercel.app](https://aftershock-eta.vercel.app)

## The problem with text search

Grep finds the places a name appears. It does not tell you which of those places are real calls, which are a different method with the same name, what calls *those* callers, or which tests eventually exercise the code you touched. Dependencies are a graph problem, so I stored the code as a graph.

## Code as a property graph

Aftershock parses a repository and writes one FalkorDB graph per repo (`repo:<name>`):

- **Nodes:** `File`, `Symbol` (functions, classes, methods), `External` packages, `Person` (git authors) and `TestRun`.
- **Edges:** `CALLS`, `INHERITS`/`IMPLEMENTS`, `OVERRIDES`, `IMPORTS`, `CO_CHANGES` (files that change together in git history), `AUTHORED`, `COVERS` (per-test coverage), and `RAN`/`SUSPECTS` for recorded test runs.

Every `CALLS` edge records *how* it was resolved (local, import, module attribute, inferred) and a confidence score. That is what lets every answer explain itself rather than just assert.

## What it answers

| Question | How |
| --- | --- |
| What breaks if I delete, rename, or change X? | A probabilistic multi-hop walk over reverse dependencies, tiered *definite / likely / possible*, rolled into a 0–100 risk score |
| What does my working tree or PR break? | The git diff is classified into symbol changes, then scored the same way |
| Which tests should I run? | Walk from the changed symbols to every test that reaches them, including external test suites registered as libraries |
| Why does A depend on B? | The most confident path between two symbols, hop by hop |
| These tests fail. What caused it? | Failures are traced back through the graph and suspects are ranked with Ochiai scoring |
| Anything else | Plain-English questions answered by an LLM that can only use read-only graph tools, with a trace of every query |

## How FalkorDB does the heavy lifting

**Bounded variable-length traversals.** Impact analysis is openCypher with `*1..N` paths over reverse `CALLS`, `INHERITS` and `OVERRIDES` edges. Every traversal is capped by a configured maximum depth, so a hub function cannot blow up a query.

**Built-in algorithms.** `algo.pageRank` over `CALLS` finds the most central symbols, `algo.betweenness` finds chokepoints, and `algo.labelPropagation` over `IMPORTS` finds module communities. Those feed the hotspot and architecture views without a separate analytics stack.

**Full-text search.** A `db.idx.fulltext` index over symbol names and docstrings gives stemmed search, so "parse config" finds `load_settings` when its docstring says so.

**Read-only by construction.** Every read goes through `GRAPH.RO_QUERY` with a timeout. That matters because two features run Cypher I did not write: a raw Cypher console in the UI, and an LLM agent that writes its own queries. Neither can modify the graph.

**Receipts.** Every response carries the queries it ran and how long each took, so you can check the work instead of trusting it.

**Incremental indexing.** Each file owns its symbols and every edge leaving them. Re-indexing a file replaces exactly what it owns, and edges other files point at it survive unless the target symbol disappeared.

## A worked example

The demo repo is a small ledger. Someone changes `Money.times` to truncate instead of round, a one-line edit that looks harmless.

1. **Diff** picks up the uncommitted change, maps it to `Money.times`, and scores the blast radius.
2. **Impact** shows the callers hop by hop, including a compliance test suite that lives *outside* the repo. It was registered as a test library and indexed into the same graph.
3. **Path** explains how an external month-end compliance test reaches `Money.times` through three hops.
4. **Tests** selects only the tests the change reaches and runs them. In the demo, some fail.
5. **Culprit** traces each failure back through the graph and ranks `Money.times` as the likely cause.

The [two-minute demo video](https://github.com/TheManishCode/aftershocks---Graph-Hacks/blob/main/media/aftershock-demo.mp4) walks through exactly this.

## One engine, many surfaces

All analysis lives in one Python package. It is exposed through:

- a **CLI** whose output is markdown, so it pastes straight into PRs;
- a **FastAPI** REST API, with server-sent events for streamed answers;
- an **MCP server**, so AI coding agents can ask the graph before they edit;
- a **GitHub Action** that comments the impact report on pull requests;
- a **Next.js** web UI.

Running a repository's tests executes its code, so that is gated: it works only when the server is started with an explicit flag *and* the request comes from the same machine. The hosted demo never runs code.

## What I learned

- **Store how you know, not just what you know.** Recording the resolution method and confidence on every edge turned the output from "trust me" into something a reviewer can verify.
- **Bound everything.** Depth limits, node caps and query timeouts are what make graph analysis safe to run on real codebases.
- **Read-only is a feature.** `GRAPH.RO_QUERY` made it reasonable to let an LLM write Cypher against the graph.

## What I would improve in FalkorDB

Clearer guidance around query timeouts and `TIMEOUT_MAX` (I had to tune write timeouts to stay under the server's limit), fuller documentation of the `algo.*` procedure parameters, and a way to profile slow variable-length traversals.

## Try it

The repo has setup instructions for the CLI, API, MCP server and UI. Start FalkorDB with Docker, index a repository, and ask it what breaks.
