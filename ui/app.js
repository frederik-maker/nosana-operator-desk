const scenarios = {
  founder: {
    stamp: "Updated 07:10",
    priorities: [
      {
        title: "Close the partner deck before 10:00",
        body: "The only deliverable that changes today's revenue conversation. Everything else is secondary.",
      },
      {
        title: "Reply to the two warm intros in your inbox",
        body: "Both are still warm. Delay lowers conversion more than polishing another draft.",
      },
      {
        title: "Decide whether the Friday ship scope is still realistic",
        body: "There is execution risk hiding behind too many 'almost done' tasks.",
      },
    ],
    risks: [
      "The product update is larger than the original Friday scope.",
      "Two unanswered partner threads could slip into next week.",
      "You have not protected time for the launch post draft.",
    ],
    watchlist: [
      ["Revenue pipeline", "2 threads need action", "up"],
      ["Launch scope", "High slippage risk", "down"],
      ["Inbox backlog", "18 unresolved items", "down"],
    ],
    actions: [
      "Send a rough deck, not a perfect deck.",
      "Block 45 minutes for direct replies only.",
      "Cut one non-critical launch item before noon.",
    ],
    response:
      "Top priority is the partner deck because it unlocks the biggest external outcome today.\n\nSecond priority is direct follow-up on the warm intros while context is still fresh.\n\nThird priority is scope control: if Friday matters, something smaller has to die before lunch.",
  },
  research: {
    stamp: "Updated 06:42",
    priorities: [
      {
        title: "Validate the strongest claim before expanding the brief",
        body: "One missing fact can invalidate the rest of the writeup.",
      },
      {
        title: "Summarize overnight changes into one page",
        body: "Compression beats accumulation when the input surface keeps growing.",
      },
      {
        title: "Tag every open question by evidence source",
        body: "Separate confirmed facts from assumptions before you publish.",
      },
    ],
    risks: [
      "Three saved links repeat the same thesis from different words.",
      "The current notes mix hard evidence and narrative speculation.",
      "You still need one source for the overnight market claim.",
    ],
    watchlist: [
      ["Saved links", "9 new items overnight", "up"],
      ["Open questions", "4 still unresolved", "down"],
      ["Publish readiness", "Needs one final source", "down"],
    ],
    actions: [
      "Cut duplicate sources before more reading.",
      "Pull one evidence block for each major claim.",
      "End with a one-sentence stance, not a hedge pile.",
    ],
    response:
      "Your work should start with source triage, not more reading.\n\nThe main risk is duplicated input creating fake confidence.\n\nIf one overnight claim stays unverified, keep it out of the final summary.",
  },
  trader: {
    stamp: "Updated 08:03",
    priorities: [
      {
        title: "Review the watchlist before adding new exposure",
        body: "There is enough motion already. The first job is ranking what matters.",
      },
      {
        title: "Map the two obvious invalidation points",
        body: "If the thesis breaks, the exit should not require fresh creativity.",
      },
      {
        title: "Trim the note pile into a 24-hour execution plan",
        body: "Research only matters if it changes sizing, timing, or risk.",
      },
    ],
    risks: [
      "Your current plan still assumes correlation will stay friendly.",
      "Two catalysts are close together and could compress reaction time.",
      "The notes mention upside three times and downside once.",
    ],
    watchlist: [
      ["SOL", "+3.2% and reclaiming trend", "up"],
      ["BTC", "Range compression into macro", "up"],
      ["JTO", "Catalyst watch, liquidity thin", "down"],
    ],
    actions: [
      "Write the invalidation levels down before opening anything.",
      "Reduce note sprawl into one execution card per asset.",
      "Do not confuse activity with edge.",
    ],
    response:
      "Your biggest edge today is selectivity.\n\nSOL is the cleanest monitor, BTC is the macro anchor, and JTO is the highest slippage risk.\n\nDo the invalidation work first so sizing stays honest.",
  },
};

const prioritiesNode = document.querySelector("#priorities");
const risksNode = document.querySelector("#risks");
const watchlistNode = document.querySelector("#watchlist");
const actionsNode = document.querySelector("#actions");
const responseNode = document.querySelector("#response");
const stampNode = document.querySelector("#briefStamp");
const buttons = [...document.querySelectorAll(".mode")];
const promptInput = document.querySelector("#promptInput");

function renderScenario(name) {
  const scenario = scenarios[name];

  stampNode.textContent = scenario.stamp;

  prioritiesNode.innerHTML = scenario.priorities
    .map(
      (item) =>
        `<li><strong>${item.title}</strong><span>${item.body}</span></li>`
    )
    .join("");

  risksNode.innerHTML = scenario.risks.map((item) => `<li>${item}</li>`).join("");

  watchlistNode.innerHTML = scenario.watchlist
    .map(
      ([ticker, note, direction]) =>
        `<li><div><div class="ticker">${ticker}</div><div>${note}</div></div><div class="delta ${direction === "down" ? "down" : ""}">${direction === "down" ? "Risk" : "Focus"}</div></li>`
    )
    .join("");

  actionsNode.innerHTML = scenario.actions.map((item) => `<li>${item}</li>`).join("");
  responseNode.textContent = scenario.response;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((entry) => entry.classList.remove("active"));
    button.classList.add("active");
    renderScenario(button.dataset.mode);
  });
});

document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const active = document.querySelector(".mode.active");
  const scenario = scenarios[active.dataset.mode];
  responseNode.textContent = `Prompt: ${promptInput.value}\n\n${scenario.response}`;
});

renderScenario("founder");
