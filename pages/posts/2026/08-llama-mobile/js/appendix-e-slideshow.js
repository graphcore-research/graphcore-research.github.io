(() => {
  "use strict";

  const ROOT_ID = "appendix-e-slideshow";
  const DATA_URL = "/posts/2026/08-llama-mobile/data/appendix-e/index.json";

  const CSS = `
#appendix-e-slideshow {
  margin: 1.2rem 0 1.8rem;
}

#appendix-e-slideshow .appendix-e-panel {
  padding: 0.7rem;
  border: 1px solid #dedede;
  border-left: 0.18rem solid rgba(255, 109, 129, 0.65);
  border-radius: 0.25rem;
  background: #fafafa;
  color: #444;
}

#appendix-e-slideshow .appendix-e-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem 0.8rem;
  margin-bottom: 0.65rem;
}

#appendix-e-slideshow .appendix-e-title {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.2;
}

#appendix-e-slideshow .appendix-e-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

#appendix-e-slideshow .appendix-e-tab:hover {
  border-color: rgba(255, 109, 129, 0.8);
}

#appendix-e-slideshow .appendix-e-tab:focus-visible {
  outline: 2px solid #ff6d81;
  outline-offset: 2px;
}

#appendix-e-slideshow .appendix-e-tabs {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #d6d6d6;
  border-radius: 0.24rem;
  background: #fff;
}

#appendix-e-slideshow .appendix-e-tab {
  appearance: none;
  margin: 0;
  padding: 0.27rem 0.52rem;
  border: 0;
  border-right: 1px solid #d6d6d6;
  background: transparent;
  color: #666;
  cursor: pointer;
  font: inherit;
  font-size: 0.74rem;
  line-height: 1.15;
}

#appendix-e-slideshow .appendix-e-tab:last-child {
  border-right: 0;
}

#appendix-e-slideshow .appendix-e-tab[aria-selected="true"] {
  background: #ffedf1;
  box-shadow: inset 0 -0.11rem 0 #ff6d81;
  color: #c93f54;
  font-weight: 700;
}

#appendix-e-slideshow .appendix-e-body {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 0.75rem;
  align-items: stretch;
}

#appendix-e-slideshow .appendix-e-media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 17rem;
  min-height: 12rem;
  margin: 0;
  border: 1px solid #e4e4e4;
  border-radius: 0.18rem;
  background: #fff;
  overflow: hidden;
}

#appendix-e-slideshow .appendix-e-media img {
  display: block;
  width: auto !important;
  height: auto !important;
  max-width: 100%;
  max-height: 100%;
  margin: 0 !important;
}

#appendix-e-slideshow .appendix-e-copy {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.55rem;
  min-width: 0;
}

#appendix-e-slideshow .appendix-e-prompt {
  height: 4.8rem;
  padding: 0.52rem 0.58rem;
  border: 1px solid #e6e1e3;
  border-radius: 0.18rem;
  background: #fff;
  overflow: auto;
}

#appendix-e-slideshow .appendix-e-question {
  margin: 0;
  color: #4b4b4b;
  font-size: 0.78rem;
  line-height: 1.38;
  white-space: pre-wrap;
}

#appendix-e-slideshow .appendix-e-outputs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  min-height: 0;
}

#appendix-e-slideshow .appendix-e-output {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  border: 1px solid #e2e2e2;
  border-radius: 0.18rem;
  background: #fff;
  overflow: hidden;
}

#appendix-e-slideshow .appendix-e-output-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.45rem;
  padding: 0.42rem 0.52rem;
  border-bottom: 1px solid #ececec;
  background: #f7f7f7;
}

#appendix-e-slideshow .appendix-e-output-label {
  color: #333;
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.2;
}

#appendix-e-slideshow .appendix-e-metrics {
  color: #777;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: right;
}

#appendix-e-slideshow .appendix-e-score-ok {
  color: #2f7d4b;
}

#appendix-e-slideshow .appendix-e-score-bad {
  color: #9b3535;
}

#appendix-e-slideshow .appendix-e-output-text {
  height: 9.7rem;
  margin: 0;
  padding: 0.5rem 0.56rem;
  overflow: auto;
  color: #4b4b4b;
  font-family: inherit;
  font-size: 0.7rem;
  line-height: 1.4;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

#appendix-e-slideshow .appendix-e-error {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
}

@media (max-width: 760px) {
  #appendix-e-slideshow .appendix-e-body,
  #appendix-e-slideshow .appendix-e-outputs {
    grid-template-columns: 1fr;
  }

  #appendix-e-slideshow .appendix-e-header {
    align-items: flex-start;
  }

  #appendix-e-slideshow .appendix-e-controls,
  #appendix-e-slideshow .appendix-e-tabs {
    width: 100%;
  }

  #appendix-e-slideshow .appendix-e-tabs {
    flex: 1;
  }

  #appendix-e-slideshow .appendix-e-tab {
    flex: 1;
    padding-inline: 0.3rem;
  }

  #appendix-e-slideshow .appendix-e-media {
    height: 13rem;
  }

  #appendix-e-slideshow .appendix-e-prompt {
    height: 4.8rem;
  }

  #appendix-e-slideshow .appendix-e-output-text {
    height: 7rem;
  }
}
`;

  function injectStyle() {
    if (document.querySelector("#appendix-e-slideshow-style")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "appendix-e-slideshow-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function setText(element, text) {
    element.textContent = text || "";
  }

  function accuracyMark(metrics) {
    for (const metricName of ["accuracy", "accuracy_relaxed"]) {
      const match = metrics.match(new RegExp(`(?:^|, )${metricName}=([^,]+)`));
      if (match) {
        return Number(match[1]) > 0 ? "✓" : "✕";
      }
    }
    return "";
  }

  function renderOutput(container, output) {
    const label = container.querySelector("[data-output-label]");
    const metrics = container.querySelector("[data-output-metrics]");
    const text = container.querySelector("[data-output-text]");
    setText(label, output.label);
    const score = output.metrics ? accuracyMark(output.metrics) : "";
    metrics.classList.remove("appendix-e-score-ok", "appendix-e-score-bad");
    if (score) {
      metrics.classList.add(score === "✓" ? "appendix-e-score-ok" : "appendix-e-score-bad");
      metrics.setAttribute("aria-label", score === "✓" ? "correct" : "incorrect");
    } else {
      metrics.removeAttribute("aria-label");
    }
    setText(metrics, score);
    setText(text, output.output);
  }

  function renderComponent(root, slides) {
    root.innerHTML = `
      <section class="appendix-e-panel" aria-label="Example outputs">
        <div class="appendix-e-header">
          <p class="appendix-e-title">Example outputs</p>
          <div class="appendix-e-controls">
            <div class="appendix-e-tabs" role="tablist" aria-label="Example outputs"></div>
          </div>
        </div>
        <div class="appendix-e-body">
          <figure class="appendix-e-media">
            <img data-image alt="">
          </figure>
          <div class="appendix-e-copy">
            <div class="appendix-e-prompt">
              <p class="appendix-e-question" data-question></p>
            </div>
            <div class="appendix-e-outputs">
              <section class="appendix-e-output">
                <div class="appendix-e-output-head">
                  <span class="appendix-e-output-label" data-output-label></span>
                  <span class="appendix-e-metrics" data-output-metrics></span>
                </div>
                <pre class="appendix-e-output-text" data-output-text></pre>
              </section>
              <section class="appendix-e-output">
                <div class="appendix-e-output-head">
                  <span class="appendix-e-output-label" data-output-label></span>
                  <span class="appendix-e-metrics" data-output-metrics></span>
                </div>
                <pre class="appendix-e-output-text" data-output-text></pre>
              </section>
              <section class="appendix-e-output">
                <div class="appendix-e-output-head">
                  <span class="appendix-e-output-label" data-output-label></span>
                  <span class="appendix-e-metrics" data-output-metrics></span>
                </div>
                <pre class="appendix-e-output-text" data-output-text></pre>
              </section>
            </div>
          </div>
        </div>
      </section>
    `;

    const tabs = root.querySelector(".appendix-e-tabs");
    const image = root.querySelector("[data-image]");
    const question = root.querySelector("[data-question]");
    const outputContainers = root.querySelectorAll(".appendix-e-output");

    let index = 0;

    slides.forEach((slide, slideIndex) => {
      const tab = document.createElement("button");
      tab.className = "appendix-e-tab";
      tab.type = "button";
      tab.id = `appendix-e-tab-${slide.key}`;
      tab.setAttribute("role", "tab");
      tab.textContent = slide.task;
      tab.addEventListener("click", () => {
        index = slideIndex;
        render();
      });
      tabs.appendChild(tab);
    });

    function render() {
      const slide = slides[index];
      image.src = slide.image;
      image.alt = slide.image_alt;
      setText(question, slide.question);
      renderOutput(outputContainers[0], {
        label: "Reference",
        metrics: "",
        output: slide.answers
      });
      renderOutput(outputContainers[1], slide.bf16);
      renderOutput(outputContainers[2], slide.s3d8);

      tabs.querySelectorAll(".appendix-e-tab").forEach((tab, tabIndex) => {
        tab.setAttribute("aria-selected", tabIndex === index ? "true" : "false");
        tab.tabIndex = tabIndex === index ? 0 : -1;
      });
    }

    render();
  }

  async function init() {
    const roots = document.querySelectorAll(`#${ROOT_ID}`);
    if (!roots.length) {
      return;
    }
    injectStyle();
    for (const root of roots) {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        renderComponent(root, data.slides);
      } catch (error) {
        root.innerHTML = `<p class="appendix-e-error">Example outputs could not be loaded.</p>`;
        console.error(error);
      }
    }
  }

  init();
})();
