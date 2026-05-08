(() => {
  "use strict";

  const STORAGE_PREFIX = "review-comments::";

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function findReviewRoot() {
    return document.querySelector(".review-annotated-content");
  }

  function sanitizeFileStem(value) {
    return value.replaceAll(/[^\w.-]+/g, "-").replaceAll(/-+/g, "-").replaceAll(/^-|-$/g, "");
  }

  function loadDrafts(storageKey) {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const drafts = {};
      for (const entry of parsed) {
        if (!entry || typeof entry.anchor !== "string" || typeof entry.text !== "string") {
          continue;
        }
        const existing = drafts[entry.anchor];
        if (!existing || String(existing.updatedAt || "") < String(entry.updatedAt || "")) {
          drafts[entry.anchor] = {
            text: entry.text,
            updatedAt: entry.updatedAt || nowIso()
          };
        }
      }
      return drafts;
    }
    if (parsed && typeof parsed === "object") {
      const drafts = {};
      for (const [anchor, value] of Object.entries(parsed)) {
        if (typeof value === "string") {
          drafts[anchor] = { text: value, updatedAt: nowIso() };
          continue;
        }
        if (
          value &&
          typeof value === "object" &&
          typeof value.text === "string"
        ) {
          drafts[anchor] = {
            text: value.text,
            updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : nowIso()
          };
        }
      }
      return drafts;
    }
    throw new Error(`expected object or array in localStorage for ${storageKey}`);
  }

  function saveDrafts(storageKey, drafts) {
    window.localStorage.setItem(storageKey, JSON.stringify(drafts));
  }

  function buildExportMarkdown(page, draftEntries) {
    const lines = [
      `# Review notes for ${page.title}`,
      "",
      `- Source: \`${page.src}\``,
      `- Preview path: \`/${page.url}\``,
      `- Exported: ${nowIso()}`,
      ""
    ];
    const ordered = [...draftEntries].sort((a, b) => a.index - b.index);
    for (const entry of ordered) {
      lines.push(`## Note @${entry.anchor}`);
      lines.push("");
      lines.push(entry.text);
      lines.push("");
    }
    if (ordered.length === 0) {
      lines.push("_No review notes yet._");
      lines.push("");
    }
    return lines.join("\n");
  }

  function initReviewComments() {
    const root = findReviewRoot();
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const article = root.closest("article");
    if (!(article instanceof HTMLElement)) {
      return;
    }

    const page = {
      src: root.dataset.reviewPageSrc || "unknown-source",
      url: root.dataset.reviewPageUrl || "",
      title: root.dataset.reviewPageTitle || document.title
    };
    const storageKey = `${STORAGE_PREFIX}${page.src}`;
    let drafts = loadDrafts(storageKey);
    let activeAnchor = null;

    const bubbleLayer = document.createElement("div");
    bubbleLayer.className = "review-bubble-layer";
    const noteLayer = document.createElement("div");
    noteLayer.className = "review-note-layer";
    root.style.position = "relative";
    root.append(bubbleLayer, noteLayer);

    const exportOverlay = document.createElement("div");
    exportOverlay.className = "review-export-overlay";
    exportOverlay.innerHTML = `
      <div class="review-export-panel">
        <div class="review-note-header">
          <div>
            <div class="review-note-title">Review notes export</div>
            <div class="review-note-meta">${escapeHtml(page.src)}</div>
          </div>
          <div class="review-export-actions review-export-actions-top">
            <button type="button" class="review-copy primary">Copy</button>
            <a href="#" download>Download .md</a>
            <button type="button" class="review-note-close review-export-close" aria-label="Close export">×</button>
          </div>
        </div>
        <textarea spellcheck="false"></textarea>
      </div>
    `;
    document.body.append(exportOverlay);

    const exportTextarea = exportOverlay.querySelector("textarea");
    const downloadLink = exportOverlay.querySelector("a[download]");
    const copyButton = exportOverlay.querySelector(".review-copy");
    const closeExportButton = exportOverlay.querySelector(".review-note-close");
    if (!(exportTextarea instanceof HTMLTextAreaElement)) {
      throw new Error("missing review export textarea");
    }
    if (!(downloadLink instanceof HTMLAnchorElement)) {
      throw new Error("missing review export download link");
    }
    if (!(copyButton instanceof HTMLButtonElement) || !(closeExportButton instanceof HTMLButtonElement)) {
      throw new Error("missing review export buttons");
    }

    const metadataList = document.querySelector(".md-post__meta .md-nav__list");
    let sidebarButton = null;
    if (metadataList instanceof HTMLElement) {
      const item = document.createElement("li");
      item.className = "md-nav__item";
      item.innerHTML = `
        <div class="md-nav__link review-sidebar-row">
          <span class="review-sidebar-summary">
            <i class="fa-regular fa-comment-dots review-sidebar-icon" aria-hidden="true"></i>
            <span class="review-sidebar-button-count">0 notes</span>
          </span>
          <button type="button" class="review-sidebar-button">View</button>
        </div>
      `;
      metadataList.append(item);
      sidebarButton = item.querySelector(".review-sidebar-button");
    }

    function buildAnchorMap() {
      const map = new Map();
      for (const anchor of root.querySelectorAll(".review-anchor")) {
        if (!(anchor instanceof HTMLElement)) {
          continue;
        }
        const anchorId = anchor.dataset.reviewAnchor;
        if (!anchorId) {
          continue;
        }
        map.set(anchorId, anchor);
      }
      return map;
    }

    function findReviewAnchor(target) {
      if (!(target instanceof Element)) {
        return null;
      }
      const direct = target.closest(".review-anchor");
      return direct instanceof HTMLElement && root.contains(direct) ? direct : null;
    }

    function findReviewAnchorFromEvent(event) {
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      for (const node of path) {
        const anchor = findReviewAnchor(node);
        if (anchor) {
          return anchor;
        }
      }
      return findReviewAnchor(event.target);
    }

    function nonEmptyDraftText(anchorId) {
      return String(drafts[anchorId]?.text || "").trim();
    }

    function draftEntries() {
      const anchors = buildAnchorMap();
      const entries = [];
      for (const [anchorId, draft] of Object.entries(drafts)) {
        const text = String(draft?.text || "").trim();
        if (!text) {
          continue;
        }
        const anchor = anchors.get(anchorId);
        if (!(anchor instanceof HTMLElement)) {
          continue;
        }
        entries.push({
          anchor: anchorId,
          index: Number(anchor.dataset.reviewIndex || "0"),
          text
        });
      }
      return entries;
    }

    function totalDraftCount() {
      return draftEntries().length;
    }

    function refreshExportPayload() {
      const markdown = buildExportMarkdown(page, draftEntries());
      exportTextarea.value = markdown;
      downloadLink.href = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
      downloadLink.download = `${sanitizeFileStem(page.src.replace(/\.md(\.j2)?$/, ""))}-review-notes.md`;
    }

    function updateSidebarButton() {
      if (!(sidebarButton instanceof HTMLButtonElement)) {
        return;
      }
      const count = totalDraftCount();
      const countNode = sidebarButton.closest(".review-sidebar-row")?.querySelector(".review-sidebar-button-count");
      if (countNode instanceof HTMLElement) {
        countNode.textContent = `${count} note${count === 1 ? "" : "s"}`;
      }
    }

    function clearActiveHighlight() {
      for (const node of root.querySelectorAll(".review-anchor-active")) {
        node.classList.remove("review-anchor-active");
      }
    }

    function closeNote() {
      activeAnchor = null;
      noteLayer.replaceChildren();
      clearActiveHighlight();
    }

    function updateDraft(anchorId, text) {
      const trimmed = text.trim();
      if (!trimmed) {
        delete drafts[anchorId];
      } else {
        drafts[anchorId] = {
          text,
          updatedAt: nowIso()
        };
      }
      saveDrafts(storageKey, drafts);
      refreshExportPayload();
      updateSidebarButton();
      renderBubbles();
    }

    function lastContentRect(anchor) {
      const range = document.createRange();
      range.selectNodeContents(anchor);
      const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
      if (rects.length === 0) {
        return null;
      }
      return rects[rects.length - 1];
    }

    function bubblePosition(anchor, rootRect) {
      const bubbleWidth = 14;
      const bubbleHeight = 14;
      const contentRect = lastContentRect(anchor);
      const baseRect = contentRect || anchor.getBoundingClientRect();
      const gap = 3;
      const unclampedLeft = baseRect.right - rootRect.left + gap - 2;
      const unclampedTop = baseRect.top - rootRect.top + Math.max(0, (baseRect.height - bubbleHeight) / 2) - 5;
      return {
        left: Math.max(0, Math.min(unclampedLeft, rootRect.width - bubbleWidth)),
        top: Math.max(0, Math.min(unclampedTop, rootRect.height - bubbleHeight))
      };
    }

    function noteGeometry(rootRect, bubbleX) {
      const viewportPadding = 24;
      const preferredWidth = 352;
      const maxWidth = Math.max(260, window.innerWidth - rootRect.left - viewportPadding * 2);
      const width = Math.min(preferredWidth, maxWidth);
      const desiredLeft = bubbleX + 42;
      const maxLeft = Math.max(0, window.innerWidth - rootRect.left - viewportPadding - width);
      return {
        left: Math.max(0, Math.min(desiredLeft, maxLeft)),
        width
      };
    }

    function openNote(anchor, focusEditor) {
      if (!(anchor instanceof HTMLElement)) {
        return;
      }
      activeAnchor = anchor;
      clearActiveHighlight();
      anchor.classList.add("review-anchor-active");
      const anchorId = anchor.dataset.reviewAnchor;
      if (!anchorId) {
        throw new Error("review anchor is missing data-review-anchor");
      }
      const rootRect = root.getBoundingClientRect();
      const bubble = bubblePosition(anchor, rootRect);
      const geometry = noteGeometry(rootRect, bubble.left);
      const y = bubble.top;
      const note = document.createElement("div");
      note.className = "review-note";
      note.style.left = `${geometry.left}px`;
      note.style.top = `${y}px`;
      note.style.width = `${geometry.width}px`;
      note.innerHTML = `
        <div class="review-note-header">
          <div class="review-note-title">Note @${escapeHtml(anchorId)}</div>
          <button type="button" class="review-note-close" data-review-action="close" aria-label="Close note">×</button>
        </div>
        <div class="review-note-editor">
          <textarea placeholder="Add a review note...">${escapeHtml(drafts[anchorId]?.text || "")}</textarea>
        </div>
      `;
      noteLayer.replaceChildren(note);
      const textarea = note.querySelector("textarea");
      if (!(textarea instanceof HTMLTextAreaElement)) {
        throw new Error("missing review note textarea");
      }
      textarea.addEventListener("input", () => {
        updateDraft(anchorId, textarea.value);
      });
      textarea.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          closeNote();
        }
      });
      if (focusEditor) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }

    function renderBubbles() {
      bubbleLayer.replaceChildren();
      const anchors = buildAnchorMap();
      const rootRect = root.getBoundingClientRect();
      for (const [anchorId, anchor] of anchors) {
        if (!(anchor instanceof HTMLElement)) {
          continue;
        }
        if (!nonEmptyDraftText(anchorId)) {
          continue;
        }
        const bubblePos = bubblePosition(anchor, rootRect);
        const bubble = document.createElement("div");
        bubble.className = "review-bubble";
        bubble.style.left = `${bubblePos.left}px`;
        bubble.style.top = `${bubblePos.top}px`;
        bubble.title = `Open note @${anchorId}`;
        bubble.tabIndex = 0;
        bubble.setAttribute("role", "button");
        bubble.setAttribute("aria-label", `Open note @${anchorId}`);
        bubble.addEventListener("click", () => openNote(anchor, false));
        bubble.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openNote(anchor, false);
          }
        });
        bubbleLayer.append(bubble);
      }
    }

    function refreshAll() {
      refreshExportPayload();
      updateSidebarButton();
      renderBubbles();
    }

    function scheduleRefresh() {
      window.requestAnimationFrame(() => {
        renderBubbles();
        if (activeAnchor instanceof HTMLElement) {
          openNote(activeAnchor, false);
        }
      });
    }

    root.addEventListener("dblclick", (event) => {
      const anchor = findReviewAnchorFromEvent(event);
      if (!(anchor instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      openNote(anchor, true);
    });

    noteLayer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.dataset.reviewAction === "close") {
        event.preventDefault();
        event.stopPropagation();
        closeNote();
      }
    });

    function openExport() {
      refreshExportPayload();
      exportOverlay.classList.add("is-open");
    }

    if (sidebarButton instanceof HTMLButtonElement) {
      sidebarButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openExport();
      });
      sidebarButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
    }
    const sidebarRow = sidebarButton?.closest(".review-sidebar-row");
    if (sidebarRow instanceof HTMLElement) {
      sidebarRow.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openExport();
        }
      });
      sidebarRow.setAttribute("tabindex", "0");
      sidebarRow.setAttribute("role", "group");
      sidebarRow.setAttribute("aria-label", "Review notes");
    }
    closeExportButton.addEventListener("click", () => exportOverlay.classList.remove("is-open"));
    exportOverlay.addEventListener("click", (event) => {
      if (event.target === exportOverlay) {
        exportOverlay.classList.remove("is-open");
      }
    });
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(exportTextarea.value);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1200);
    });
    window.addEventListener("resize", scheduleRefresh);
    window.addEventListener("scroll", scheduleRefresh, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNote();
        exportOverlay.classList.remove("is-open");
      }
    });

    refreshAll();
  }

  document.addEventListener("DOMContentLoaded", initReviewComments, { once: true });
})();
