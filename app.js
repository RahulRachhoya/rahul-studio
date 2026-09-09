"use strict";

const byId = (id) => document.getElementById(id);
const profile = window.PORTFOLIO_PROFILE || {};
const serviceNames = { workflow: "AI workflow", design: "Design project", combined: "Workflow + design" };
const servicePlans = {
  workflow: {
    title: "Give the process a clearer path.",
    steps: ["Map how requests arrive and what happens next.", "Create a focused prototype with a review step.", "Test complete and incomplete requests before connecting tools."],
    questions: ["Which tools handle this task today?", "What information must every request include?", "Which actions should wait for your approval?"]
  },
  design: {
    title: "Turn the idea into a focused design brief.",
    steps: ["Establish the audience, message, and required formats.", "Explore one visual direction with a sample.", "Review the agreed deliverables and prepare final files."],
    questions: ["Who is the audience, and what should they do next?", "Do you have brand assets or visual references?", "Which sizes and file formats will you need?"]
  },
  combined: {
    title: "Connect the experience and the process.",
    steps: ["Define the customer journey and the supporting workflow.", "Prototype the page and its enquiry handoff.", "Review the design and test the workflow as separate deliverables."],
    questions: ["Where do people discover your business today?", "Which information should the page collect?", "What should happen after someone sends an enquiry?"]
  }
};
const scenarios = {
  studio: { request: "I run a small design studio. Project enquiries arrive in different places, and I want a clearer way to collect the details and prepare a response.", service: "workflow", timeline: "" },
  creator: { request: "I create educational videos and need a consistent set of thumbnails and social graphics. I want the content to look connected while each topic stays easy to recognize.", service: "design", timeline: "Within two weeks" },
  consultant: { request: "I am launching an independent consulting service. I need a clear landing page and a way to turn incoming enquiries into structured project requests.", service: "combined", timeline: "Within a month" }
};
const projects = {
  voice: {
    eyebrow: "PROFESSIONAL PROJECT / VOICE AI",
    title: "A conversation, backed by useful context.",
    intro: "Voice AI Career Counselor brings speech, retrieval, and a language model into one conversational experience. Rahul’s public portfolio describes work with Claude on AWS Bedrock, Sarvam AI speech tools, pgvector, and FastAPI.",
    details: [["The problem", "A voice experience needs to understand a question, find relevant knowledge, and respond naturally."], ["The approach", "Connect speech-to-text, contextual retrieval, model responses, and text-to-speech, with observability across the flow."], ["Relevance to your project", "A foundation for discussing voice assistants, knowledge-led support, and conversational workflows."], ["Context", "Professional work described in Rahul’s existing public portfolio. No employer code or customer data is included here."]],
    source: "https://rahulrachhoya.is-a.dev/#projects",
    sourceLabel: "View public project background ↗"
  },
  rag: {
    eyebrow: "PROFESSIONAL PROJECT / KNOWLEDGE SYSTEMS",
    title: "Make knowledge easier to put to work.",
    intro: "Rahul’s public LinkedIn projects include an AI-Powered Contextual Knowledge Engine: a retrieval system combining language models, vector storage, and structured context.",
    details: [["The problem", "Useful information is difficult to apply when it is scattered across documents and systems."], ["The approach", "Retrieve relevant material, assemble context, and use it to support domain-specific questions and content workflows."], ["Tools described publicly", "FAISS, Hugging Face Transformers, Python, Docker, and AWS."], ["Relevance to your project", "Internal knowledge assistants, document workflows, and research support with an agreed evaluation process."]],
    source: "https://in.linkedin.com/in/rahul-rachhoya",
    sourceLabel: "View project on LinkedIn ↗"
  },
  mcp: {
    eyebrow: "OPEN-SOURCE PROJECT / DEVELOPER TOOLS",
    title: "The right guidance, when an agent needs it.",
    intro: "auto-skill-mcp is Rahul’s public MCP server for delivering task-relevant guidance to coding agents from a curated skill library.",
    details: [["The problem", "An agent needs relevant guidance without loading every instruction for every task."], ["The approach", "Classify the request with TF-IDF matching, recommend relevant guides, and load their content on demand."], ["Public implementation", "A Python project with a bundled skill library, MCP tools, and configuration helpers. The repository documents its source and setup."], ["Relevance to your project", "Agent tooling, knowledge routing, reusable workflow guidance, and developer productivity integrations."]],
    source: "https://github.com/RahulRachhoya/auto-skill-mcp",
    sourceLabel: "Explore the source on GitHub ↗"
  }
};
let currentDemoText = "";
let currentContactText = "";

function setList(id, items) {
  byId(id).replaceChildren(...items.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function selectResult(name, focus = false) {
  document.querySelectorAll("[data-result]").forEach((tab) => {
    const active = tab.dataset.result === name;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    byId(`panel-${tab.dataset.result}`).hidden = !active;
    if (active && focus) tab.focus();
  });
}

function renderDemo(announce = true) {
  const request = byId("demo-request").value.trim();
  if (!request) {
    byId("demo-request").setCustomValidity("Add a short description of your project.");
    byId("demo-form").reportValidity();
    return;
  }
  byId("demo-request").setCustomValidity("");
  const service = byId("demo-service").value;
  const timeline = byId("demo-timeline").value;
  const plan = servicePlans[service];
  const questions = [...plan.questions];
  if (!timeline) questions.push("Is there a date or milestone we should plan around?");
  const reply = `Thanks for sharing your ${serviceNames[service].toLowerCase()} idea.\n\nHere is the request I have noted:\n“${request}”\n\nBefore suggesting a scope, ${questions[0].charAt(0).toLowerCase()}${questions[0].slice(1)}${timeline ? ` I have noted your preferred timing: ${timeline.toLowerCase()}.` : " It would also help to know your preferred timing."}\n\nOnce the requirements are clear, we can agree on a focused first step.`;
  byId("result-title").textContent = plan.title;
  byId("result-summary").textContent = request;
  byId("result-service").textContent = serviceNames[service];
  byId("result-timeline").textContent = timeline || "To be discussed";
  byId("result-reply").textContent = reply;
  setList("result-steps", plan.steps);
  setList("result-questions", questions);
  currentDemoText = `SAMPLE PROJECT BRIEF\n\nRequest: ${request}\n\nType: ${serviceNames[service]}\nTimeline: ${timeline || "To be discussed"}\n\nSuggested next steps:\n${plan.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nClarification questions:\n${questions.map((question) => `- ${question}`).join("\n")}\n\nDraft reply for review:\n${reply}\n\nGuided portfolio sample. No live AI processing or message sending.`;
  selectResult("brief");
  if (announce) byId("demo-status").textContent = "Request organized. Review the brief, questions, and draft reply.";
}

async function copyText(text, statusId) {
  try {
    await navigator.clipboard.writeText(text);
    byId(statusId).textContent = "Copied. Ready to paste and share.";
  } catch {
    byId(statusId).textContent = "Clipboard access is unavailable. Select the text to copy it, or download your brief.";
  }
}

function applyProfile() {
  if (profile.name) document.querySelectorAll("[data-profile-name]").forEach((node) => { node.textContent = profile.name; });
  if (profile.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.email)) {
    const contact = byId("contact-email");
    contact.href = `mailto:${profile.email}`;
    contact.textContent = `${profile.email} ↗`;
    byId("direct-contact").hidden = false;
  }
  (profile.links || []).forEach((link) => {
    try {
      const url = new URL(link.url);
      if (url.protocol !== "https:") return;
      const anchor = document.createElement("a");
      anchor.href = url.href;
      anchor.textContent = link.label;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      byId("social-links").append(anchor);
    } catch { /* Invalid optional public links are omitted. */ }
  });
}

function openProject(key) {
  const project = projects[key];
  if (!project) return;
  byId("project-eyebrow").textContent = project.eyebrow;
  byId("project-title").textContent = project.title;
  byId("project-intro").textContent = project.intro;
  const details = project.details.flatMap(([label, text]) => {
    const term = document.createElement("dt");
    const definition = document.createElement("dd");
    term.textContent = label;
    definition.textContent = text;
    return [term, definition];
  });
  byId("project-details").replaceChildren(...details);
  byId("project-source-link").href = project.source;
  byId("project-source-link").textContent = project.sourceLabel;
  byId("project-dialog").showModal();
}

applyProfile();
renderDemo(false);
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((filter) => {
      filter.classList.toggle("active", filter === button);
      filter.setAttribute("aria-pressed", String(filter === button));
    });
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((card) => {
      const visible = button.dataset.filter === "all" || card.dataset.category === button.dataset.filter;
      card.hidden = !visible;
      if (visible) count++;
    });
    byId("work-count").textContent = `${count} project${count === 1 ? "" : "s"}`;
  });
});
document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    const scenario = scenarios[button.dataset.scenario];
    byId("demo-request").value = scenario.request;
    byId("demo-request").setCustomValidity("");
    byId("demo-service").value = scenario.service;
    byId("demo-timeline").value = scenario.timeline;
    document.querySelectorAll("[data-scenario]").forEach((item) => {
      item.classList.toggle("selected", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderDemo();
  });
});
byId("demo-request").addEventListener("input", () => byId("demo-request").setCustomValidity(""));
byId("demo-form").addEventListener("submit", (event) => { event.preventDefault(); renderDemo(); });
document.querySelectorAll("[data-result]").forEach((tab) => {
  tab.addEventListener("click", () => selectResult(tab.dataset.result));
  tab.addEventListener("keydown", (event) => {
    const tabs = [...document.querySelectorAll("[data-result]")];
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectResult(tabs[next].dataset.result, true); }
  });
});
byId("copy-demo").addEventListener("click", () => copyText(currentDemoText, "demo-status"));
document.querySelectorAll("[data-open-case]").forEach((button) => button.addEventListener("click", () => byId("case-dialog").showModal()));
document.querySelectorAll("[data-open-project]").forEach((button) => button.addEventListener("click", () => openProject(button.dataset.openProject)));
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    byId("client-service").value = link.dataset.interest;
    byId("contact-form").hidden = false;
    byId("brief-result").hidden = true;
    byId("contact-status").textContent = "";
  });
});
byId("client-idea").addEventListener("input", () => byId("client-idea").setCustomValidity(""));
byId("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = byId("client-idea").value.trim();
  if (!idea) {
    byId("client-idea").setCustomValidity("Tell me a little about the project.");
    byId("contact-form").reportValidity();
    return;
  }
  currentContactText = `PROJECT ENQUIRY FOR ${profile.name || "AI × Design"}\n\nName: ${byId("client-name").value.trim() || "Not provided"}\nService: ${byId("client-service").value}\n\nMy project:\n${idea}\n\nPreferred timing: ${byId("client-deadline").value.trim() || "To be discussed"}\n\nI'd like to discuss the scope, deliverables, and next step.`;
  byId("brief-text").textContent = currentContactText;
  byId("contact-form").hidden = true;
  byId("brief-result").hidden = false;
  byId("contact-status").textContent = "Your brief is ready. It has not been sent.";
  if (profile.email) {
    byId("email-brief").href = `mailto:${profile.email}?subject=${encodeURIComponent(`Project enquiry — ${byId("client-service").value}`)}&body=${encodeURIComponent(currentContactText)}`;
    byId("email-brief").hidden = false;
  }
  byId("brief-result-title").focus({ preventScroll: true });
});
byId("copy-contact").addEventListener("click", () => copyText(currentContactText, "contact-status"));
byId("download-contact").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([currentContactText], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "project-brief.txt";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  byId("contact-status").textContent = "Brief download requested. Nothing has been sent.";
});
byId("edit-brief").addEventListener("click", () => {
  byId("brief-result").hidden = true;
  byId("contact-form").hidden = false;
  byId("contact-status").textContent = "";
  byId("client-idea").focus({ preventScroll: true });
});
