(function () {
  const roots = document.querySelectorAll("#s3d8-decoding-animation");
  if (!roots.length) {
    return;
  }

  if (!document.querySelector("#s3d8-decoding-animation-style")) {
    const style = document.createElement("style");
    style.id = "s3d8-decoding-animation-style";
    style.textContent = `
      .s3d8-decode {
        --s3d8-decode-fg: #151515;
        --s3d8-decode-muted: #666;
        --s3d8-decode-line: #ccc;
        --s3d8-decode-fill: #fff;
        --s3d8-decode-hot: #fff3bf;
        --s3d8-decode-index: #dbeafe;
        width: min(920px, 100%);
        margin: 0 0 1.4rem;
        color: var(--s3d8-decode-fg);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .s3d8-decode * {
        box-sizing: border-box;
      }

      .s3d8-decode-stage {
        display: grid;
        grid-template-columns: max-content minmax(270px, 1fr);
        gap: 12px;
        align-items: start;
        min-width: 0;
      }

      .s3d8-decode-panel {
        width: max-content;
        max-width: 100%;
        border: 1px solid var(--s3d8-decode-line);
        background: var(--s3d8-decode-fill);
        padding: 10px;
      }

      .s3d8-decode-panel.s3d8-decode-lookup,
      .s3d8-decode-table-wrap.s3d8-decode-lookup {
        outline: 3px solid #777;
        outline-offset: 4px;
      }

      .s3d8-decode-label,
      .s3d8-decode caption {
        margin: 0 0 6px;
        color: var(--s3d8-decode-muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .s3d8-decode-payload {
        display: flex;
        gap: 6px;
        align-items: center;
        margin-bottom: 8px;
      }

      .s3d8-decode-box {
        position: relative;
        min-width: 58px;
        height: 50px;
        padding: 20px 8px 6px;
        border: 1px solid var(--s3d8-decode-line);
        background: var(--s3d8-decode-fill);
        text-align: center;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 14px;
      }

      .s3d8-decode-box-wide {
        min-width: 118px;
      }

      .s3d8-decode-bits {
        position: absolute;
        top: 5px;
        left: 7px;
        color: var(--s3d8-decode-muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 11px;
        line-height: 1;
      }

      .s3d8-decode-hot {
        background: var(--s3d8-decode-hot);
        border-color: #d6a400;
      }

      .s3d8-decode-payload-masked {
        opacity: 0.35;
        background: #eee;
      }

      .s3d8-decode-pos {
        color: #166534;
      }

      .s3d8-decode-neg {
        color: #991b1b;
      }

      .s3d8-decode-op-viz {
        width: max-content;
        margin: 0 0 12px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
      }

      .s3d8-decode-op-row,
      .s3d8-decode-op-under {
        display: grid;
        grid-template-columns: 58px 58px 118px 58px;
        gap: 6px;
      }

      .s3d8-decode-op-cell,
      .s3d8-decode-op-result {
        border: 1px solid var(--s3d8-decode-line);
        padding: 5px 6px;
        text-align: center;
        background: var(--s3d8-decode-fill);
      }

      .s3d8-decode-op-result {
        margin-top: 6px;
        min-height: 31px;
        visibility: hidden;
      }

      .s3d8-decode-op-cell.s3d8-decode-grey {
        opacity: 0.35;
        background: #eee;
      }

      .s3d8-decode-op-result.s3d8-decode-on {
        visibility: visible;
        background: var(--s3d8-decode-index);
        border-color: #80a8e8;
      }

      .s3d8-decode-decoded {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        width: 322px;
        height: 58px;
        max-width: 100%;
      }

      .s3d8-decode-temp {
        min-width: 0;
        height: 58px;
        border: 1px solid var(--s3d8-decode-line);
        padding: 8px 10px;
        background: var(--s3d8-decode-fill);
        overflow: hidden;
      }

      .s3d8-decode-temp.s3d8-decode-hot {
        background: var(--s3d8-decode-hot);
        border-color: #d6a400;
      }

      .s3d8-decode-temp strong,
      .s3d8-decode-value {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .s3d8-decode-temp strong {
        display: block;
        margin-bottom: 2px;
        line-height: 1.1;
      }

      .s3d8-decode-value {
        display: block;
        min-height: 1.2em;
        line-height: 1.2;
        color: var(--s3d8-decode-muted);
      }

      .s3d8-decode-tables {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        align-items: start;
        min-width: 0;
      }

      .s3d8-decode-table-wrap {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .s3d8-decode-table-size {
        color: var(--s3d8-decode-muted);
        font-size: 11px;
        line-height: 1;
      }

      .s3d8-decode .s3d8-decode-table {
        display: table;
        width: 100%;
        min-width: 0;
        margin: 0;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 12px;
        background: var(--s3d8-decode-fill);
        overflow: visible;
      }

      .s3d8-decode caption {
        padding-bottom: 6px;
        text-align: left;
      }

      .s3d8-decode th,
      .s3d8-decode td {
        height: 24px;
        border: 1px solid var(--s3d8-decode-line);
        padding: 3px 4px;
        text-align: left;
        white-space: nowrap;
      }

      .s3d8-decode th {
        background: #f1f1f1;
        font-weight: 600;
      }

      .s3d8-decode td {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .s3d8-decode th:first-child,
      .s3d8-decode td:first-child {
        background: #eee;
      }

      .s3d8-decode tr.s3d8-decode-hot td:first-child {
        background: var(--s3d8-decode-hot);
      }

      .s3d8-decode-step-name {
        margin: 12px 0 6px 10px;
        color: var(--s3d8-decode-fg);
        font-size: 15px;
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .s3d8-decode-controls {
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        gap: 8px;
        align-items: center;
        margin-top: 6px;
      }

      .s3d8-decode button {
        min-width: 38px;
        min-height: 32px;
        border: 1px solid var(--s3d8-decode-line);
        background: var(--s3d8-decode-fill);
        color: var(--s3d8-decode-fg);
        cursor: pointer;
        font-size: 16px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        line-height: 1;
      }

      .s3d8-decode button:disabled {
        color: #aaa;
        cursor: default;
      }

      .s3d8-decode input[type="range"] {
        width: 100%;
        height: 6px;
        accent-color: #888;
      }

      @media (max-width: 660px) {
        .s3d8-decode-stage {
          grid-template-columns: 1fr;
        }

        .s3d8-decode-tables {
          grid-template-columns: 1fr;
        }

        .s3d8-decode-payload {
          flex-wrap: wrap;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const frames = [
    {
      name: "0/8: starting state",
      decoded: {}
    },
    {
      name: "1/8: mask I0",
      panel: true,
      op: {
        grey: ["bit7", "bit6"],
        payloadGrey: ["bit7", "bit6"],
        result: ["3 / 5", "I0 = 0x27"]
      },
      decoded: {}
    },
    {
      name: "2/8: lookup V0",
      rows: ["t0-neg"],
      table: "t0",
      values: ["V0"],
      op: {
        grey: ["bit7", "bit6"],
        payloadGrey: ["bit7", "bit6"],
        result: ["3 / 5", "I0 = 0x27"]
      },
      decoded: { V0: "-42" }
    },
    {
      name: "3-4/8: shift and mask for I1",
      panel: true,
      op: {
        grey: ["bit7", "bit0"],
        payloadGrey: ["bit7", "bit0"],
        result: ["2 / 4", "I1 = 0x33"]
      },
      decoded: { V0: "-42" }
    },
    {
      name: "5/8: lookup V1",
      rows: ["t1-neg"],
      table: "t1",
      values: ["V1"],
      op: {
        grey: ["bit7", "bit0"],
        payloadGrey: ["bit7", "bit0"],
        result: ["2 / 4", "I1 = 0x33"]
      },
      decoded: { V0: "-42", V1: "-17" }
    },
    {
      name: "6-7/8: shift and EOR for I2",
      panel: true,
      op: {
        grey: ["bit6"],
        payloadGrey: ["bit6"],
        result: ["1 / 5", "I2 = (X >> 7) EOR I0 = 0x26"]
      },
      decoded: { V0: "-42", V1: "-17" }
    },
    {
      name: "8/8: lookup V2",
      rows: ["t2-pos"],
      table: "t2",
      values: ["V2"],
      op: {
        grey: ["bit6"],
        payloadGrey: ["bit6"],
        result: ["1 / 5", "I2 = 0x26"]
      },
      decoded: { V0: "-42", V1: "-17", V2: "+93" }
    }
  ];

  function renderComponent(root) {
    root.classList.add("s3d8-decode");
    root.innerHTML = `
      <section class="s3d8-decode-stage">
        <div class="s3d8-decode-panel" data-panel>
          <p class="s3d8-decode-label">payload</p>
          <div class="s3d8-decode-payload">
            <div class="s3d8-decode-box" data-payload="bit7"><span class="s3d8-decode-bits">1 bit</span>1</div>
            <div class="s3d8-decode-box" data-payload="bit6"><span class="s3d8-decode-bits">1 bit</span>1</div>
            <div class="s3d8-decode-box s3d8-decode-box-wide" data-payload="bits5-1"><span class="s3d8-decode-bits">5 bits</span>0x13</div>
            <div class="s3d8-decode-box" data-payload="bit0"><span class="s3d8-decode-bits">1 bit</span>1</div>
          </div>

          <div class="s3d8-decode-op-viz" aria-hidden="true">
            <div class="s3d8-decode-op-row">
              <div class="s3d8-decode-op-cell" data-bit="bit7">bit 7</div>
              <div class="s3d8-decode-op-cell" data-bit="bit6">bit 6</div>
              <div class="s3d8-decode-op-cell" data-bit="bits5-1">bits 5-1</div>
              <div class="s3d8-decode-op-cell" data-bit="bit0">bit 0</div>
            </div>
            <div class="s3d8-decode-op-under">
              <div class="s3d8-decode-op-result" data-op-result></div>
            </div>
          </div>

          <div class="s3d8-decode-decoded" data-decoded></div>
        </div>

        <div class="s3d8-decode-tables">
          <div class="s3d8-decode-table-wrap" data-table="t0">
            <table class="s3d8-decode-table">
              <caption>T0, sign-minor</caption>
              <thead><tr><th>index</th><th>value</th></tr></thead>
              <tbody>
                <tr><td>...</td><td>...</td></tr>
                <tr data-row="t0-pos"><td>0x26</td><td class="s3d8-decode-pos">+42</td></tr>
                <tr data-row="t0-neg"><td>0x27</td><td class="s3d8-decode-neg">-42</td></tr>
                <tr><td>...</td><td>...</td></tr>
              </tbody>
            </table>
            <div class="s3d8-decode-table-size">64 x INT8</div>
          </div>

          <div class="s3d8-decode-table-wrap" data-table="t1">
            <table class="s3d8-decode-table">
              <caption>T1, sign-major</caption>
              <thead><tr><th>index</th><th>value</th></tr></thead>
              <tbody>
                <tr><td>...</td><td>...</td></tr>
                <tr data-row="t1-pos"><td>0x13</td><td class="s3d8-decode-pos">+17</td></tr>
                <tr><td>...</td><td>...</td></tr>
                <tr data-row="t1-neg"><td>0x33</td><td class="s3d8-decode-neg">-17</td></tr>
                <tr><td>...</td><td>...</td></tr>
              </tbody>
            </table>
            <div class="s3d8-decode-table-size">64 x INT8</div>
          </div>

          <div class="s3d8-decode-table-wrap" data-table="t2">
            <table class="s3d8-decode-table">
              <caption>T2, sign-minor</caption>
              <thead><tr><th>index</th><th>value</th></tr></thead>
              <tbody>
                <tr><td>...</td><td>...</td></tr>
                <tr data-row="t2-pos"><td>0x26</td><td class="s3d8-decode-pos">+93</td></tr>
                <tr data-row="t2-neg"><td>0x27</td><td class="s3d8-decode-neg">-93</td></tr>
                <tr><td>...</td><td>...</td></tr>
              </tbody>
            </table>
            <div class="s3d8-decode-table-size">64 x INT8</div>
          </div>
        </div>
      </section>

      <div class="s3d8-decode-step-name" data-step-name></div>
      <div class="s3d8-decode-controls">
        <button data-play type="button" aria-label="Play">&#9654;</button>
        <button data-back type="button" aria-label="Previous frame">&lt;</button>
        <input data-progress type="range" min="0" max="6" value="0" step="1" aria-label="Frame progress">
        <button data-forward type="button" aria-label="Next frame">&gt;</button>
      </div>
    `;

    const progress = root.querySelector("[data-progress]");
    const play = root.querySelector("[data-play]");
    const back = root.querySelector("[data-back]");
    const forward = root.querySelector("[data-forward]");
    const stepName = root.querySelector("[data-step-name]");
    const panel = root.querySelector("[data-panel]");
    const decoded = root.querySelector("[data-decoded]");
    const opResult = root.querySelector("[data-op-result]");

    let frame = 0;
    let timer = null;

    function clearHighlights() {
      root
        .querySelectorAll(".s3d8-decode-hot,.s3d8-decode-lookup,.s3d8-decode-payload-masked")
        .forEach((element) => {
          element.classList.remove(
            "s3d8-decode-hot",
            "s3d8-decode-lookup",
            "s3d8-decode-payload-masked"
          );
        });
    }

    function pause() {
      clearInterval(timer);
      timer = null;
      play.textContent = "\u25b6";
      play.setAttribute("aria-label", "Play");
    }

    function start() {
      play.textContent = "\u25a0";
      play.setAttribute("aria-label", "Pause");
      timer = setInterval(() => {
        frame = frame === frames.length - 1 ? 0 : frame + 1;
        render();
      }, 3000);
    }

    function render() {
      const current = frames[frame];
      clearHighlights();
      panel.classList.toggle("s3d8-decode-lookup", Boolean(current.panel));
      root.querySelectorAll(".s3d8-decode-op-cell").forEach((element) => {
        element.classList.remove("s3d8-decode-grey");
      });
      opResult.classList.remove("s3d8-decode-on");
      opResult.textContent = "";
      opResult.style.gridColumn = "1 / 2";

      if (current.op) {
        for (const bit of current.op.grey || []) {
          root.querySelector(`[data-bit="${bit}"]`).classList.add("s3d8-decode-grey");
        }
        for (const bit of current.op.payloadGrey || []) {
          root
            .querySelector(`[data-payload="${bit}"]`)
            .classList.add("s3d8-decode-payload-masked");
        }
        if (current.op.result) {
          opResult.style.gridColumn = current.op.result[0];
          opResult.textContent = current.op.result[1];
          opResult.classList.add("s3d8-decode-on");
        }
      }

      decoded.innerHTML = "";
      for (const name of ["V0", "V1", "V2"]) {
        const card = document.createElement("div");
        card.className = "s3d8-decode-temp";
        if ((current.values || []).includes(name)) {
          card.classList.add("s3d8-decode-hot");
        }
        card.innerHTML = `<strong>${name}</strong><span class="s3d8-decode-value">${
          current.decoded[name] || ""
        }</span>`;
        decoded.appendChild(card);
      }

      for (const key of current.rows || []) {
        root.querySelector(`[data-row="${key}"]`).classList.add("s3d8-decode-hot");
      }
      if (current.table) {
        root.querySelector(`[data-table="${current.table}"]`).classList.add("s3d8-decode-lookup");
      }

      stepName.textContent = current.name;
      progress.value = frame;
      progress.max = frames.length - 1;
      back.disabled = frame === 0;
      forward.textContent = frame === frames.length - 1 ? "\u21ba" : ">";
      forward.setAttribute(
        "aria-label",
        frame === frames.length - 1 ? "Reset animation" : "Next frame"
      );
    }

    play.addEventListener("click", () => {
      if (timer) {
        pause();
        return;
      }
      start();
    });

    back.addEventListener("click", () => {
      pause();
      frame = Math.max(0, frame - 1);
      render();
    });

    forward.addEventListener("click", () => {
      pause();
      frame = frame === frames.length - 1 ? 0 : frame + 1;
      render();
    });

    progress.addEventListener("input", () => {
      pause();
      frame = Number(progress.value);
      render();
    });

    render();
    start();
  }

  roots.forEach(renderComponent);
})();
