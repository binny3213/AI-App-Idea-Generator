const form = document.getElementById("idea-form");
const textarea = document.getElementById("customPrompt");
const charHint = document.getElementById("char-hint");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");
const resultSection = document.getElementById("result-section");
const resultLoading = document.getElementById("result-loading");
const ideaOutput = document.getElementById("idea-output");
const copyBtn = document.getElementById("copy-btn");

const MAX_LEN = 2000;

function hasIdeaContent() {
  return Boolean(ideaOutput.innerHTML.trim());
}

function setError(message) {
  if (!message) {
    formError.hidden = true;
    formError.textContent = "";
    return;
  }
  formError.hidden = false;
  formError.textContent = message;
}

function updateCharHint() {
  const n = textarea.value.length;
  charHint.textContent = `${n} / ${MAX_LEN}`;
}

/** Turn plain idea text into HTML: highlight numbered section headers */
function formatIdeaHtml(text) {
  const lines = text.split("\n");
  const out = [];
  const sectionRe = /^\s*(\d+)\.\s+(.+)$/;

  for (const line of lines) {
    const m = line.match(sectionRe);
    if (m && m[2].length < 80) {
      out.push(
        `<span class="idea-line-strong">${escapeHtml(m[2].trim())}</span>`,
      );
    } else {
      out.push(escapeHtml(line));
    }
  }
  return out.join("\n");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

textarea.addEventListener("input", updateCharHint);
updateCharHint();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");

  const customPrompt = textarea.value.trim();
  if (!customPrompt) {
    setError("Please describe what you want — even a short phrase works.");
    textarea.focus();
    return;
  }

  const hadIdea = hasIdeaContent();
  resultSection.hidden = false;
  resultLoading.hidden = false;
  resultLoading.classList.toggle("is-overlay", hadIdea);
  if (!hadIdea) {
    ideaOutput.hidden = true;
    copyBtn.hidden = true;
  }
  resultSection.setAttribute("aria-busy", "true");
  submitBtn.disabled = true;
  submitBtn.classList.add("is-loading");
  submitBtn.querySelector(".btn-label").textContent = "Generating…";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customPrompt }),
    });

    const raw = await res.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      setError(
        `Server returned an unexpected response (${res.status}). Are you opening this app via http://localhost — not as a saved HTML file?`,
      );
      resultLoading.hidden = true;
      resultLoading.classList.remove("is-overlay");
      if (!hadIdea) {
        ideaOutput.hidden = true;
        copyBtn.hidden = true;
        resultSection.hidden = true;
      }
      return;
    }

    if (!res.ok || !data.success) {
      setError(data.error || `Something went wrong (${res.status}). Try again.`);
      resultLoading.hidden = true;
      resultLoading.classList.remove("is-overlay");
      if (!hadIdea) {
        ideaOutput.hidden = true;
        copyBtn.hidden = true;
        resultSection.hidden = true;
      }
      return;
    }

    ideaOutput.innerHTML = formatIdeaHtml(data.idea || "");
    ideaOutput.hidden = false;
    copyBtn.hidden = false;
  } catch {
    setError("Network error — check your connection and try again.");
    resultLoading.classList.remove("is-overlay");
    if (!hadIdea) {
      ideaOutput.hidden = true;
      copyBtn.hidden = true;
      resultSection.hidden = true;
    }
  } finally {
    resultLoading.hidden = true;
    resultLoading.classList.remove("is-overlay");
    resultSection.setAttribute("aria-busy", "false");
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
    submitBtn.querySelector(".btn-label").textContent = "Generate idea";
  }
});

copyBtn.addEventListener("click", async () => {
  const text = ideaOutput.innerText;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const prev = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = prev;
    }, 2000);
  } catch {
    copyBtn.textContent = "Copy failed";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 2000);
  }
});
