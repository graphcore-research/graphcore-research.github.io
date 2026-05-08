(() => {
  "use strict";

  const PLOTLY_SRC = "https://cdn.plot.ly/plotly-3.5.0.min.js";
  const DEFAULT_TRAINING_X_MIN = 50;
  const DEFAULT_TRAINING_X_MAX = 3000;
  let plotlyPromise = null;

  function loadPlotly() {
    if (window.Plotly) {
      return Promise.resolve(window.Plotly);
    }
    if (plotlyPromise !== null) {
      return plotlyPromise;
    }
    plotlyPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-plotly-loader="mlp"]');
      if (existing instanceof HTMLScriptElement) {
        existing.addEventListener("load", () => resolve(window.Plotly), { once: true });
        existing.addEventListener("error", () => reject(new Error("failed to load Plotly")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = PLOTLY_SRC;
      script.async = true;
      script.dataset.plotlyLoader = "mlp";
      script.addEventListener("load", () => {
        if (!window.Plotly) {
          reject(new Error("Plotly loaded without window.Plotly"));
          return;
        }
        resolve(window.Plotly);
      }, { once: true });
      script.addEventListener("error", () => reject(new Error(`failed to load Plotly from ${PLOTLY_SRC}`)), { once: true });
      document.head.appendChild(script);
    });
    return plotlyPromise;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function setFallback(root, message) {
    const fallback = root.querySelector(".mlp-plot-fallback");
    if (fallback instanceof HTMLElement) {
      fallback.textContent = message;
    }
  }

  function setLimitedFallback(root, message) {
    const fallback = root.querySelector(".limited-plot-fallback");
    if (fallback instanceof HTMLElement) {
      fallback.textContent = message;
    }
  }

  function parseDefaultBoolean(root, attributeName, fallback) {
    const raw = root.dataset[attributeName];
    if (raw === undefined) {
      return fallback;
    }
    if (raw === "true") {
      return true;
    }
    if (raw === "false") {
      return false;
    }
    throw new Error(`expected data-${attributeName} to be "true" or "false", got ${raw}`);
  }

  function parseOptionalNumber(root, attributeName) {
    const raw = root.dataset[attributeName];
    if (raw === undefined) {
      return null;
    }
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      throw new Error(`expected data-${attributeName} to be numeric, got ${raw}`);
    }
    return value;
  }

  function applyVisibleState(traces, state) {
    for (const trace of traces) {
      const legendgroup = trace.legendgroup;
      if (legendgroup === "MLP FP8-RTN" || legendgroup === "MLP FP6-RTN") {
        trace.visible = state.rtn;
      } else if (
        legendgroup === "MLP FP8-SR" ||
        legendgroup === "MLP FP6-SR" ||
        legendgroup === "MLP FP8-SR16" ||
        legendgroup === "MLP FP6-SR16"
      ) {
        trace.visible = state.sr;
      } else {
        trace.visible = true;
      }
    }
  }

  function applyTraceStyling(traces) {
    for (const trace of traces) {
      const legendgroup = trace.legendgroup;
      if (legendgroup === "BF16/default") {
        trace.line = Object.assign({}, trace.line, {
          color: "#111111",
          dash: "solid"
        });
        trace.marker = Object.assign({}, trace.marker, {
          color: "#111111"
        });
      }
      if (
        legendgroup === "MLP FP8-RTN" ||
        legendgroup === "MLP FP6-RTN" ||
        legendgroup === "FP8-RTN" ||
        legendgroup === "FP6-RTN"
      ) {
        trace.line = Object.assign({}, trace.line, {
          color: "#6cabde",
          dash: "solid"
        });
        trace.marker = Object.assign({}, trace.marker, {
          color: "#6cabde"
        });
      }
      if (
        legendgroup === "MLP FP8-SR" ||
        legendgroup === "MLP FP6-SR" ||
        legendgroup === "FP8-SR" ||
        legendgroup === "FP6-SR"
      ) {
        if (legendgroup === "MLP FP8-SR") {
          trace.name = "MLP FP8-SR16";
          trace.legendgroup = "MLP FP8-SR16";
        } else if (legendgroup === "MLP FP6-SR") {
          trace.name = "MLP FP6-SR16";
          trace.legendgroup = "MLP FP6-SR16";
        } else if (legendgroup === "FP8-SR") {
          trace.name = "FP8-SR16";
          trace.legendgroup = "FP8-SR16";
        } else if (legendgroup === "FP6-SR") {
          trace.name = "FP6-SR16";
          trace.legendgroup = "FP6-SR16";
        }
        trace.line = Object.assign({}, trace.line, {
          color: "#e85b9d",
          dash: "solid"
        });
        trace.marker = Object.assign({}, trace.marker, {
          color: "#e85b9d"
        });
      }
      if (legendgroup === "FP8-SR4 floor" || legendgroup === "FP6-SR4 floor") {
        trace.line = Object.assign({}, trace.line, {
          color: "#d8a11d",
          dash: "solid"
        });
        trace.marker = Object.assign({}, trace.marker, {
          color: "#d8a11d"
        });
      }
      if (legendgroup === "FP8-SR4 mid" || legendgroup === "FP6-SR4 mid") {
        trace.name = trace.name.replace("mid", "centered");
        trace.legendgroup = trace.legendgroup.replace("mid", "centered");
        trace.line = Object.assign({}, trace.line, {
          color: "#2aa876",
          dash: "solid"
        });
        trace.marker = Object.assign({}, trace.marker, {
          color: "#2aa876"
        });
      }
    }
  }

  function buildMetricTraces(allTraces, state) {
    const wantValidation = state.metric === "val";
    const metricTraces = allTraces
      .filter((trace) => {
        const isValidationTrace = trace.yaxis === "y";
        return wantValidation ? isValidationTrace : !isValidationTrace;
      })
      .map((trace) => {
        const clone = deepClone(trace);
        clone.xaxis = "x";
        clone.yaxis = "y";
        return clone;
      });
    const seenLegendGroups = new Set();
    for (const trace of metricTraces) {
      const legendgroup = trace.legendgroup || trace.name;
      if (seenLegendGroups.has(legendgroup)) {
        trace.showlegend = false;
        continue;
      }
      trace.showlegend = true;
      seenLegendGroups.add(legendgroup);
    }
    return metricTraces;
  }

  function computeVisibleYRange(traces, xMin, xMax, axisType) {
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const trace of traces) {
      if (!Array.isArray(trace.x) || !Array.isArray(trace.y)) {
        continue;
      }
      for (let i = 0; i < trace.x.length && i < trace.y.length; i += 1) {
        const x = trace.x[i];
        const y = trace.y[i];
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          continue;
        }
        if (x < xMin || x > xMax) {
          continue;
        }
        if (y < yMin) {
          yMin = y;
        }
        if (y > yMax) {
          yMax = y;
        }
      }
    }
    if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
      throw new Error(`could not determine y-range in x window [${xMin}, ${xMax}]`);
    }
    if (axisType === "log") {
      if (!(yMin > 0.0) || !(yMax > 0.0)) {
        throw new Error(`log y-axis requires positive values, got [${yMin}, ${yMax}]`);
      }
      const logMin = Math.log10(yMin);
      const logMax = Math.log10(yMax);
      if (logMin === logMax) {
        const pad = 0.08;
        return [logMin - pad, logMax + pad];
      }
      const pad = (logMax - logMin) * 0.08;
      return [logMin - pad, logMax + pad];
    }
    if (yMin === yMax) {
      const pad = Math.abs(yMin) * 0.05 || 0.05;
      return [yMin - pad, yMax + pad];
    }
    const pad = (yMax - yMin) * 0.08;
    return [yMin - pad, yMax + pad];
  }

  function buildMetricLayout(baseLayout, state, metricTraces) {
    const xMin = DEFAULT_TRAINING_X_MIN;
    const xMax = DEFAULT_TRAINING_X_MAX;
    const wantValidation = state.metric === "val";
    const sourceYAxis = wantValidation ? deepClone(baseLayout.yaxis) : deepClone(baseLayout.yaxis2);
    const yAxisType = sourceYAxis.type || "linear";
    const yRange = computeVisibleYRange(metricTraces, xMin, xMax, yAxisType);
    const layout = {
      autosize: true,
      paper_bgcolor: "#fffefa",
      plot_bgcolor: "#eef2f7",
      hovermode: "x unified",
      showlegend: true,
      legend: Object.assign({}, baseLayout.legend, {
        orientation: "v",
        yanchor: "top",
        y: 0.98,
        xanchor: "right",
        x: 0.985,
        bgcolor: "rgba(255, 254, 250, 0.88)",
        bordercolor: "rgba(21, 22, 26, 0.14)",
        borderwidth: 1
      }),
      margin: Object.assign({}, baseLayout.margin, {
        l: 68,
        r: 32,
        t: 18,
        b: 54
      }),
      xaxis: deepClone(baseLayout.xaxis2),
      yaxis: sourceYAxis
    };
    delete layout.xaxis.anchor;
    delete layout.xaxis.domain;
    delete layout.xaxis.matches;
    delete layout.xaxis.showticklabels;
    delete layout.yaxis.anchor;
    delete layout.yaxis.domain;
    layout.xaxis.title = { text: "step + 1" };
    layout.xaxis.range = [Math.log10(xMin), Math.log10(xMax)];
    layout.yaxis.range = yRange;
    delete layout.yaxis.autorange;
    layout.annotations = [];
    return layout;
  }

  function syncButtons(root, state) {
    for (const button of root.querySelectorAll("[data-curve-toggle]")) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }
      const key = button.dataset.curveToggle;
      const active = key === "rtn" ? state.rtn : state.sr;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function syncMetricRadios(root, state) {
    for (const input of root.querySelectorAll('.mlp-plot-mode input[type="radio"]')) {
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }
      input.checked = input.value === state.metric;
    }
  }

  function limitedPrecisionPrefix(root) {
    const raw = root.dataset.targetPrecision;
    if (raw === undefined) {
      return null;
    }
    return raw.toUpperCase();
  }

  function matchesLimitedPrecision(root, legendgroup) {
    if (legendgroup === "BF16/default") {
      return true;
    }
    const prefix = limitedPrecisionPrefix(root);
    if (prefix === null) {
      return true;
    }
    return typeof legendgroup === "string" && legendgroup.startsWith(prefix);
  }

  function applyLimitedVisibleState(root, traces, state) {
    for (const trace of traces) {
      const legendgroup = trace.legendgroup;
      if (!matchesLimitedPrecision(root, legendgroup)) {
        trace.visible = false;
      } else if (legendgroup === "BF16/default") {
        trace.visible = true;
      } else if (legendgroup === "FP8-RTN" || legendgroup === "FP6-RTN") {
        trace.visible = state.rtn;
      } else if (
        legendgroup === "FP8-SR" ||
        legendgroup === "FP6-SR" ||
        legendgroup === "FP8-SR16" ||
        legendgroup === "FP6-SR16"
      ) {
        trace.visible = state.sr;
      } else if (legendgroup === "FP8-SR4 floor" || legendgroup === "FP6-SR4 floor") {
        trace.visible = state.srf;
      } else if (
        legendgroup === "FP8-SR4 mid" ||
        legendgroup === "FP6-SR4 mid" ||
        legendgroup === "FP8-SR4 centered" ||
        legendgroup === "FP6-SR4 centered"
      ) {
        trace.visible = state.src;
      } else {
        trace.visible = true;
      }
    }
  }

  function syncLimitedButtons(root, state) {
    for (const button of root.querySelectorAll("[data-limited-curve-toggle]")) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }
      const key = button.dataset.limitedCurveToggle;
      const active = state[key];
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function buildLimitedMetricTraces(root, allTraces, state) {
    const wantValidation = state.metric === "val";
    const sourceAxis = wantValidation ? "y" : "y3";
    const metricTraces = allTraces
      .filter((trace) => trace.yaxis === sourceAxis && matchesLimitedPrecision(root, trace.legendgroup))
      .map((trace) => {
        const clone = deepClone(trace);
        clone.xaxis = "x";
        clone.yaxis = "y";
        return clone;
      });
    const seenLegendGroups = new Set();
    for (const trace of metricTraces) {
      const legendgroup = trace.legendgroup || trace.name;
      if (seenLegendGroups.has(legendgroup)) {
        trace.showlegend = false;
        continue;
      }
      trace.showlegend = true;
      seenLegendGroups.add(legendgroup);
    }
    return metricTraces;
  }

  function buildLimitedMetricLayout(root, baseLayout, state, metricTraces) {
    const wantValidation = state.metric === "val";
    const sourceXAxis = wantValidation ? deepClone(baseLayout.xaxis) : deepClone(baseLayout.xaxis3);
    const sourceYAxis = wantValidation ? deepClone(baseLayout.yaxis) : deepClone(baseLayout.yaxis3);
    const yAxisType = sourceYAxis.type || "linear";
    const xMin = DEFAULT_TRAINING_X_MIN;
    const xMax = DEFAULT_TRAINING_X_MAX;
    const yRange = computeVisibleYRange(metricTraces, xMin, xMax, yAxisType);
    const cappedYMax = parseOptionalNumber(root, "yMax");
    if (cappedYMax !== null) {
      if (yAxisType === "log") {
        yRange[1] = Math.log10(cappedYMax);
      } else {
        yRange[1] = cappedYMax;
      }
    }
    const layout = {
      autosize: true,
      paper_bgcolor: "#fffefa",
      plot_bgcolor: "#eef2f7",
      hovermode: "x unified",
      showlegend: true,
      legend: Object.assign({}, baseLayout.legend, {
        orientation: "v",
        yanchor: "top",
        y: 0.98,
        xanchor: "right",
        x: 0.985,
        bgcolor: "rgba(255, 254, 250, 0.88)",
        bordercolor: "rgba(21, 22, 26, 0.14)",
        borderwidth: 1
      }),
      margin: Object.assign({}, baseLayout.margin, {
        l: 68,
        r: 32,
        t: 18,
        b: 54
      }),
      xaxis: sourceXAxis,
      yaxis: sourceYAxis,
      annotations: []
    };
    delete layout.xaxis.anchor;
    delete layout.xaxis.domain;
    delete layout.xaxis.matches;
    delete layout.xaxis.showticklabels;
    delete layout.yaxis.anchor;
    delete layout.yaxis.domain;
    layout.xaxis.title = { text: "step + 1" };
    if (sourceXAxis.type === "log") {
      layout.xaxis.range = [Math.log10(xMin), Math.log10(xMax)];
    }
    layout.yaxis.range = yRange;
    delete layout.yaxis.autorange;
    return layout;
  }

  function buildLimitedLayout(baseLayout) {
    const layout = deepClone(baseLayout);
    delete layout.title;
    delete layout.height;
    layout.autosize = true;
    layout.paper_bgcolor = "#fffefa";
    layout.plot_bgcolor = "#eef2f7";
    layout.legend = Object.assign({}, layout.legend, {
      orientation: "v",
      yanchor: "top",
      y: 0.98,
      xanchor: "right",
      x: 0.985,
      bgcolor: "rgba(255, 254, 250, 0.88)",
      bordercolor: "rgba(21, 22, 26, 0.14)",
      borderwidth: 1
    });
    layout.margin = Object.assign({}, layout.margin, {
      l: 62,
      r: 32,
      t: 38,
      b: 42
    });
    return layout;
  }

  async function initializeLimitedPlot(root) {
    const target = root.querySelector(".limited-plot-target");
    if (!(target instanceof HTMLElement)) {
      throw new Error("missing .limited-plot-target");
    }
    const jsonUrl = root.dataset.plotlyJson;
    if (!jsonUrl) {
      throw new Error("missing plotly json url");
    }

    setLimitedFallback(root, "Loading limited-randomness curves: waiting for Plotly JS and chart data...");

    setLimitedFallback(root, "Loading limited-randomness curves: waiting for Plotly JS...");
    const plotlyPromise = loadPlotly();

    setLimitedFallback(root, `Loading limited-randomness curves: fetching chart data from ${jsonUrl} ...`);
    const responsePromise = fetch(jsonUrl, { credentials: "same-origin" });

    const [Plotly, response] = await Promise.all([plotlyPromise, responsePromise]);
    if (!response.ok) {
      throw new Error(`failed to fetch plot data: ${response.status}`);
    }

    setLimitedFallback(root, "Loading limited-randomness curves: decoding chart data...");
    const payload = await response.json();
    const traces = deepClone(payload.data);
    const layout = buildLimitedLayout(payload.layout);
    const config = Object.assign({}, payload.config, {
      responsive: true,
      displaylogo: false
    });

    const state = {
      metric: "val",
      rtn: parseDefaultBoolean(root, "defaultRtn", false),
      sr: parseDefaultBoolean(root, "defaultSr", false),
      srf: parseDefaultBoolean(root, "defaultSrf", true),
      src: parseDefaultBoolean(root, "defaultSrc", true)
    };
    applyTraceStyling(traces);
    applyLimitedVisibleState(root, traces, state);
    syncLimitedButtons(root, state);
    syncMetricRadios(root, state);

    const initialMetricTraces = buildLimitedMetricTraces(root, traces, state);
    setLimitedFallback(root, "Loading limited-randomness curves: rendering Plotly figure...");
    await Plotly.newPlot(target, initialMetricTraces, buildLimitedMetricLayout(root, layout, state, initialMetricTraces), config);
    root.classList.add("is-ready");

    const resizeObserver = new ResizeObserver(() => {
      Plotly.Plots.resize(target);
    });
    resizeObserver.observe(target);

    for (const button of root.querySelectorAll("[data-limited-curve-toggle]")) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }
      button.addEventListener("click", async () => {
        const key = button.dataset.limitedCurveToggle;
        if (!(key in state)) {
          return;
        }
        state[key] = !state[key];
        syncLimitedButtons(root, state);
        applyLimitedVisibleState(root, traces, state);
        const metricTraces = buildLimitedMetricTraces(root, traces, state);
        await Plotly.react(target, metricTraces, buildLimitedMetricLayout(root, layout, state, metricTraces), config);
      });
    }

    for (const input of root.querySelectorAll('.mlp-plot-mode input[type="radio"]')) {
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }
      input.addEventListener("change", async () => {
        if (!input.checked) {
          return;
        }
        state.metric = input.value === "train" ? "train" : "val";
        syncMetricRadios(root, state);
        const metricTraces = buildLimitedMetricTraces(root, traces, state);
        await Plotly.react(target, metricTraces, buildLimitedMetricLayout(root, layout, state, metricTraces), config);
      });
    }
  }

  async function initializeMlpPlot(root) {
    const target = root.querySelector(".mlp-plot-target");
    if (!(target instanceof HTMLElement)) {
      throw new Error("missing .mlp-plot-target");
    }
    const jsonUrl = root.dataset.plotlyJson;
    if (!jsonUrl) {
      throw new Error("missing plotly json url");
    }

    setFallback(root, "Loading MLP FP6 plot: waiting for Plotly JS and chart data...");

    setFallback(root, "Loading MLP FP6 plot: waiting for Plotly JS...");
    const plotlyPromise = loadPlotly();

    setFallback(root, `Loading MLP FP6 plot: fetching chart data from ${jsonUrl} ...`);
    const responsePromise = fetch(jsonUrl, { credentials: "same-origin" });

    const [Plotly, response] = await Promise.all([plotlyPromise, responsePromise]);
    if (!response.ok) {
      throw new Error(`failed to fetch plot data: ${response.status}`);
    }

    setFallback(root, "Loading MLP FP6 plot: decoding chart data...");
    const payload = await response.json();
    const traces = deepClone(payload.data);
    const layout = deepClone(payload.layout);
    const config = Object.assign({}, payload.config, {
      responsive: true,
      displaylogo: false
    });

    delete layout.title;
    delete layout.height;

    const state = {
      metric: "val",
      rtn: parseDefaultBoolean(root, "defaultRtn", true),
      sr: parseDefaultBoolean(root, "defaultSr", true)
    };
    applyTraceStyling(traces);
    applyVisibleState(traces, state);
    syncButtons(root, state);
    syncMetricRadios(root, state);

    const initialMetricTraces = buildMetricTraces(traces, state);
    setFallback(root, "Loading MLP FP6 plot: rendering Plotly figure...");
    await Plotly.newPlot(target, initialMetricTraces, buildMetricLayout(layout, state, initialMetricTraces), config);
    root.classList.add("is-ready");

    const resizeObserver = new ResizeObserver(() => {
      Plotly.Plots.resize(target);
    });
    resizeObserver.observe(target);

    for (const button of root.querySelectorAll("[data-curve-toggle]")) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }
      button.addEventListener("click", async () => {
        const key = button.dataset.curveToggle;
        if (key === "rtn") {
          state.rtn = !state.rtn;
        } else if (key === "sr") {
          state.sr = !state.sr;
        } else {
          return;
        }
        syncButtons(root, state);
        applyVisibleState(traces, state);
        const metricTraces = buildMetricTraces(traces, state);
        await Plotly.react(target, metricTraces, buildMetricLayout(layout, state, metricTraces), config);
      });
    }

    for (const input of root.querySelectorAll('.mlp-plot-mode input[type="radio"]')) {
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }
      input.addEventListener("change", async () => {
        if (!input.checked) {
          return;
        }
        state.metric = input.value === "train" ? "train" : "val";
        syncMetricRadios(root, state);
        const metricTraces = buildMetricTraces(traces, state);
        await Plotly.react(target, metricTraces, buildMetricLayout(layout, state, metricTraces), config);
      });
    }
  }

  for (const root of document.querySelectorAll(".mlp-plot-demo")) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }
    initializeMlpPlot(root).catch((error) => {
      setFallback(root, `JavaScript failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
    });
  }

  for (const root of document.querySelectorAll(".limited-plot-demo")) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }
    initializeLimitedPlot(root).catch((error) => {
      setLimitedFallback(root, `JavaScript failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
    });
  }
})();
