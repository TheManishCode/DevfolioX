A one-line change to a money helper should not be scary. In most codebases it is, because nobody can say with confidence what calls it, what calls *those* callers, and which tests would notice. You find out after the merge.

For the WeMakeDevs × FalkorDB *Graph Hacks* hackathon I built **Aftershock** to answer that question before the merge. It reads a repository, stores it as a property graph in FalkorDB, and answers "what breaks if I change this?" by walking the graph. Every answer comes with the path it took and how sure it is about each step.

The code is on [GitHub](https://github.com/TheManishCode/aftershocks---Graph-Hacks), and the web UI is at [aftershock-eta.vercel.app](https://aftershock-eta.vercel.app).

## Why grep is the wrong tool

Search finds where a name is *written*. Dependencies are about who *calls* whom. Those diverge quickly:

- `times` appears in comments, in other classes, and in a library you imported.
- A method is reached through an import alias, a module attribute, or a subclass that overrides it.
- The test that would catch the bug lives three calls away, sometimes in a different repository.

Each of those is a hop in a graph. So I stopped treating the code as text.

## The shape of the system

![Aftershock architecture: source, ingest, FalkorDB, analysis, and five interfaces](/ink/aftershock/architecture.svg "Fig. 1. Ingest writes the graph once; every interface reads the same graph through the same analysis code.")

Indexing runs in four steps. Tree-sitter parses each file. A resolver then works out what every call actually points at: a local function, an imported one, a module attribute, or a best-guess inference. `git log` adds churn, co-change and ownership. The pipeline is incremental by content hash, so re-indexing after a small edit only rewrites the files that changed.

Everything after that is a query. The CLI, the REST API, an MCP server for AI coding agents, a GitHub Action, and the Next.js UI all call the same analysis functions, and all the Cypher lives in one module. An agent asking over MCP gets the same answer you see in the browser.

## The graph

![Graph model: File, Symbol, External, Person and TestRun nodes and their relationships](/ink/aftershock/graph-model.svg "Fig. 2. One FalkorDB graph per repository. Symbol is the centre of gravity.")

The decision that mattered most was what to store on the `CALLS` edge. Each one records **how** the call was resolved and a **confidence** for that method. An import-resolved call is more trustworthy than a name match, and the analysis should know the difference. Each edge also stores the argument count at the call site, which comes back later when a signature changes.

The rest of the model is there to answer specific questions:

- `CO_CHANGES` between files catches coupling the code does not show: two files that always change together in git history.
- `AUTHORED` answers "who should review this?"
- `COVERS` records which tests actually executed a symbol, when per-test coverage has been collected.
- `TestRun` nodes with `RAN` and `SUSPECTS` edges keep the history of test runs and what was blamed for each failure.

## How impact is computed

![Impact walk from Money.times through callers to an external compliance test](/ink/aftershock/impact-walk.svg "Fig. 3. Probability decays with every hop and with every weak link.")

Impact is not a plain reachability query. Reachability says almost everything depends on almost everything, which is true and useless.

Instead it is a walk backwards along `CALLS`, `INHERITS` and `OVERRIDES`. Each node's break probability is a noisy-OR over its callers. Every hop multiplies in the edge type's weight, the edge's resolution confidence, and a transmit factor. The starting probability depends on the kind of change: deleting or renaming a function is certain to break callers, a signature change usually does, and a body change only sometimes does.

Signature changes get one extra check. Each call site's stored argument count is compared with the new signature, so a caller that still passes valid arguments is downgraded and one that cannot is flagged with the reason.

![Impact page for Money.times with a risk score of 37 and its breakdown](/ink/aftershock/ui-impact.jpg "The impact page shows the score and every term that went into it.")

The weights live in a JSON file and are labelled as priors, not measurements. There is an `eval` command to tune them against a repository's own history. I would rather ship honest defaults than invented accuracy numbers.

## What FalkorDB is doing

FalkorDB is not a storage layer here. It does the actual work:

- **Bounded variable-length paths.** Impact, test selection and path finding are openCypher with `*1..N`. N is capped in config, so a hub function cannot produce a runaway query.
- **Built-in algorithms.** `algo.pageRank` over `CALLS` ranks central symbols, `algo.betweenness` finds chokepoints, and `algo.labelPropagation` over `IMPORTS` groups files into subsystems. Those three drive the overview page with no separate analytics job.
- **Full-text search.** A `db.idx.fulltext` index over symbol names and docstrings lets you search by what a function does, not only by what it is called.
- **Read-only queries.** Every read goes through `GRAPH.RO_QUERY` with a timeout. That one guarantee is what made two features safe: a raw Cypher console in the UI, and an LLM agent that writes its own Cypher. Neither can change the graph, whatever it sends.

Every response also carries **receipts**: the queries that ran and how long each took. When the tool says a change is risky, you can open the receipts and see why.

## A worked example

The demo repository is a small ledger, plus a separate compliance test suite that the finance team keeps outside the repo. The change is one line: `Money.times` truncates instead of rounding.

**1. Register the outside tests.** The compliance suite is added as a test library. Its tests are indexed into the same graph under an `@lib/compliance/` prefix, so they are visible to everything that follows.

**2. Score the diff.** Diff reads the uncommitted working tree, maps the edit to the `Money.times` symbol by digest, and runs impact on it.

![Diff page scoring the uncommitted change to Money.times](/ink/aftershock/ui-diff.jpg "The diff page: one symbol changed, scored before a PR exists.")

**3. Ask why.** The path view explains how a month-end compliance test reaches `Money.times`, one hop at a time, with the resolution method of each hop.

![Path view showing the hops from a compliance test to Money.times](/ink/aftershock/ui-path.jpg "Three hops from a test in another repository to the changed method.")

**4. Run only what the change reaches.** Tests are selected from the graph, repo tests and library tests together, and run. Some fail, as they should: the change is a real bug.

**5. Find the culprit.** Each failing test is traced back through the graph and the candidate causes are ranked with Ochiai scoring, a standard fault-localisation formula. `Money.times` comes out on top.

![Culprit page ranking likely causes of the failing tests](/ink/aftershock/ui-culprit.jpg "Failures traced back to the code most likely responsible.")

**6. Ask in plain English.** "Which tests reach Money.times?" goes to an LLM that can only use read-only graph tools. The answer comes with a trace of every tool call it made.

![Ask page answering which tests reach Money.times, with a tool trace](/ink/aftershock/ui-ask.jpg "The model answers from the graph, and the trace shows its work.")

The two-minute video at the top of this post shows the full run.

## Running other people's code safely

Running a repository's tests executes that repository's code. On a hosted demo that is remote code execution with extra steps. So it is off by default. The API only runs tests when the server is started with an explicit flag *and* the request comes from the same machine. The public demo never runs code, and its mutating routes need a server-side key that the browser never sees.

## What I would do differently

- **Measure the weights.** The priors are reasonable, but the next step is running `eval` across real open-source history and publishing what comes out, good or bad.
- **More languages, deeper.** Tree-sitter makes adding a parser cheap. Resolving calls well in each language is the expensive part.
- **Cache the hot traversals.** Most questions in a review session start from the same few changed symbols.

## Notes on FalkorDB

What worked well: openCypher with variable-length paths made the core walks short and readable. Having PageRank, betweenness and community detection in the database removed a whole service. `GRAPH.RO_QUERY` is an underrated feature for anything that lets an LLM write queries.

What I would like to see: clearer guidance on query timeouts and `TIMEOUT_MAX` (I had to tune write timeouts to fit under the server limit), fuller parameter docs for the `algo.*` procedures, and a way to profile slow variable-length traversals.

If you maintain a codebase where a small change can cause a surprise, the repository has setup steps for the CLI, the API, the MCP server and the UI. Start FalkorDB in Docker, index a repo, and ask it what breaks.
