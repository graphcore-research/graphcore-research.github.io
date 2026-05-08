    (() => {
      "use strict";
      console.log("sr-rosenbrock script starting");

      function reportStartupError(error) {
        const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        for (const element of document.querySelectorAll(".script-fallback, .sr-rounding-fallback")) {
          if (!(element instanceof HTMLElement)) {
            continue;
          }
          element.style.display = "block";
          element.textContent = `JavaScript failed: ${message}`;
        }
      }

      const FP6_MAX = 28.0;
      const X_MIN = -30.0;
      const X_MAX = 30.0;
      const Y_MIN = -10.0;
      const Y_MAX = 30.0;
      const DATA_ASPECT = (X_MAX - X_MIN) / (Y_MAX - Y_MIN);
      const CLASSIC_LIMIT = 1.5;
      const SCALE = Math.fround(FP6_MAX / CLASSIC_LIMIT);
      const ROSENBROCK_Y_SHIFT = Math.fround(8.0);
      const START = [Math.fround(-24.0), Math.fround(16.0)];
      const OPTIMUM = [SCALE, Math.fround(SCALE + ROSENBROCK_Y_SHIFT)];
      const DEFAULT_ADAM_LR = Math.fround(2.3);
      const DEFAULT_ADAM_BETA1 = Math.fround(0.9);
      const DEFAULT_ADAM_BETA2 = Math.fround(0.9);
      const ADAM_EPS = Math.fround(1e-8);
      const STEPS = 200;
      const SR_SEEDS = Array.from({ length: 16 }, (_, i) => i + 1);
      const SR_TRACE_COUNT = 10;
      const AUTO_RELOAD_POLL_MS = 1000;
      const fullSettings = {
        lr: DEFAULT_ADAM_LR,
        beta1: DEFAULT_ADAM_BETA1,
        beta2: DEFAULT_ADAM_BETA2
      };
      const fp6Settings = {
        lr: DEFAULT_ADAM_LR,
        beta1: DEFAULT_ADAM_BETA1,
        beta2: DEFAULT_ADAM_BETA2
      };
      const fp6SrSettings = {
        lr: DEFAULT_ADAM_LR,
        beta1: DEFAULT_ADAM_BETA1,
        beta2: DEFAULT_ADAM_BETA2
      };
      const viewSettings = {
        colormap: "plasma"
      };

      let demoRoot = null;
      let fullCanvas = null;
      let fullCtx = null;
      let fp6Canvas = null;
      let fp6Ctx = null;
      let fp6SrCanvas = null;
      let fp6SrCtx = null;
      let canvas = null;
      let ctx = null;
      let fullStat = null;
      let fp6Stat = null;
      let fp6SrStat = null;
      let runFull = null;
      let fullLrSlider = null;
      let fullBeta1Slider = null;
      let fullBeta2Slider = null;
      let lrSlider = null;
      let beta1Slider = null;
      let beta2Slider = null;
      let srLrSlider = null;
      let srBeta1Slider = null;
      let srBeta2Slider = null;
      let colormapSelect = null;
      let runRn = null;
      let runSrRn = null;
      let runSr = null;
      let runSrEnsemble = null;
      let fullLrValue = null;
      let fullBeta1Value = null;
      let fullBeta2Value = null;
      let lrValue = null;
      let beta1Value = null;
      let beta2Value = null;
      let srLrValue = null;
      let srBeta1Value = null;
      let srBeta2Value = null;

      const colors = {
        ink: "#15161a",
        muted: "#616774",
        blue: "#2459d6",
        green: "#16825b",
        sr: "#39d87a",
        srBand: "rgba(57, 216, 122, 0.18)",
        red: "#d04438",
        rtn: "#ffd21a",
        gold: "#d2a514",
        white: "#fffefa",
        slate: "#273044"
      };

      const curvePalettes = {
        cool: {
          rn: "#fffefa",
          rnHalo: "#050506",
          sr: "#050506",
          srHalo: "#fffefa",
          full: "#050506",
          fullHalo: "#fffefa"
        },
        coolwarm: {
          rn: "#050506",
          rnHalo: "#fffefa",
          sr: "#39d87a",
          srHalo: "#050506",
          full: "#fffefa",
          fullHalo: "#050506"
        },
        viridis: {
          rn: "#fffefa",
          rnHalo: "#050506",
          sr: "#ff5db1",
          srHalo: "#050506",
          full: "#050506",
          fullHalo: "#fffefa"
        },
        plasma: {
          rn: "#fffefa",
          rnHalo: "#050506",
          sr: "#2af5ff",
          srHalo: "#050506",
          full: "#050506",
          fullHalo: "#fffefa"
        },
        magma: {
          rn: "#fffefa",
          rnHalo: "#050506",
          sr: "#39d87a",
          srHalo: "#050506",
          full: "#050506",
          fullHalo: "#fffefa"
        },
        cividis: {
          rn: "#fffefa",
          rnHalo: "#050506",
          sr: "#ff4fa3",
          srHalo: "#050506",
          full: "#050506",
          fullHalo: "#fffefa"
        },
        gray: {
          rn: "#fffefa",
          rnHalo: "#050506",
          sr: "#050506",
          srHalo: "#fffefa",
          full: "#050506",
          fullHalo: "#fffefa"
        }
      };

      function expectElement(id, constructor, description) {
        const element = document.getElementById(id);
        if (!(element instanceof constructor)) {
          throw new Error(`missing ${description}`);
        }
        return element;
      }

      function optionalElement(id, constructor, description) {
        const element = document.getElementById(id);
        if (element === null) {
          return null;
        }
        if (!(element instanceof constructor)) {
          throw new Error(`${description} has wrong element type`);
        }
        return element;
      }

      function initializeRosenbrockElements() {
        demoRoot = document.getElementById("sr-rosenbrock-demo");
        if (demoRoot === null) {
          return false;
        }
        if (!(demoRoot instanceof HTMLElement)) {
          throw new Error("#sr-rosenbrock-demo is not an HTML element");
        }
        fullCanvas = expectElement("full-canvas", HTMLCanvasElement, "#full-canvas canvas element");
        fullCtx = fullCanvas.getContext("2d", { alpha: false });
        if (fullCtx === null) {
          throw new Error("could not create full canvas context");
        }
        fp6Canvas = expectElement("fp6-canvas", HTMLCanvasElement, "#fp6-canvas canvas element");
        fp6Ctx = fp6Canvas.getContext("2d", { alpha: false });
        if (fp6Ctx === null) {
          throw new Error("could not create FP6 canvas context");
        }
        fp6SrCanvas = optionalElement("fp6-sr-canvas", HTMLCanvasElement, "#fp6-sr-canvas canvas element");
        if (fp6SrCanvas !== null) {
          fp6SrCtx = fp6SrCanvas.getContext("2d", { alpha: false });
          if (fp6SrCtx === null) {
            throw new Error("could not create FP6 SR canvas context");
          }
        }
        canvas = fullCanvas;
        ctx = fullCtx;
        fullStat = expectElement("full-stat", HTMLElement, "#full-stat element");
        fp6Stat = expectElement("fp6-stat", HTMLElement, "#fp6-stat element");
        fp6SrStat = optionalElement("fp6-sr-stat", HTMLElement, "#fp6-sr-stat element");
        runFull = expectElement("run-full", HTMLButtonElement, "#run-full button");
        fullLrSlider = expectElement("full-lr-slider", HTMLInputElement, "#full-lr-slider input");
        fullBeta1Slider = expectElement("full-beta1-slider", HTMLInputElement, "#full-beta1-slider input");
        fullBeta2Slider = expectElement("full-beta2-slider", HTMLInputElement, "#full-beta2-slider input");
        lrSlider = expectElement("lr-slider", HTMLInputElement, "#lr-slider input");
        beta1Slider = expectElement("beta1-slider", HTMLInputElement, "#beta1-slider input");
        beta2Slider = expectElement("beta2-slider", HTMLInputElement, "#beta2-slider input");
        srLrSlider = optionalElement("sr-lr-slider", HTMLInputElement, "#sr-lr-slider input");
        srBeta1Slider = optionalElement("sr-beta1-slider", HTMLInputElement, "#sr-beta1-slider input");
        srBeta2Slider = optionalElement("sr-beta2-slider", HTMLInputElement, "#sr-beta2-slider input");
        colormapSelect = optionalElement("colormap-select", HTMLSelectElement, "#colormap-select select");
        runRn = expectElement("run-rn", HTMLButtonElement, "#run-rn button");
        runSrRn = optionalElement("run-sr-rn", HTMLButtonElement, "#run-sr-rn button");
        runSr = optionalElement("run-sr", HTMLButtonElement, "#run-sr button");
        runSrEnsemble = optionalElement("run-sr-ensemble", HTMLButtonElement, "#run-sr-ensemble button");
        fullLrValue = expectElement("full-lr-value", HTMLElement, "#full-lr-value element");
        fullBeta1Value = expectElement("full-beta1-value", HTMLElement, "#full-beta1-value element");
        fullBeta2Value = expectElement("full-beta2-value", HTMLElement, "#full-beta2-value element");
        lrValue = expectElement("lr-value", HTMLElement, "#lr-value element");
        beta1Value = expectElement("beta1-value", HTMLElement, "#beta1-value element");
        beta2Value = expectElement("beta2-value", HTMLElement, "#beta2-value element");
        srLrValue = optionalElement("sr-lr-value", HTMLElement, "#sr-lr-value element");
        srBeta1Value = optionalElement("sr-beta1-value", HTMLElement, "#sr-beta1-value element");
        srBeta2Value = optionalElement("sr-beta2-value", HTMLElement, "#sr-beta2-value element");
        for (const root of document.querySelectorAll(".sr-demo")) {
          if (root instanceof HTMLElement) {
            root.classList.add("js-ready");
          }
        }
        return true;
      }

      function assertFinite(value, name) {
        if (!Number.isFinite(value)) {
          throw new Error(`${name} is not finite: ${value}`);
        }
      }

      function f32(value) {
        const rounded = Math.fround(value);
        assertFinite(rounded, "FP32 value");
        return rounded;
      }

      function shouldAutoReload() {
        if (!["http:", "https:"].includes(window.location.protocol)) {
          return false;
        }
        const params = new URLSearchParams(window.location.search);
        if (params.get("watch") === "1") {
          return true;
        }
        if (params.get("watch") === "0") {
          return false;
        }
        return false;
      }

      function sourceUrl(cacheBusterName) {
        const url = new URL(window.location.href);
        url.searchParams.delete("_sr_poll");
        url.searchParams.delete("_sr_reloaded");
        url.searchParams.set(cacheBusterName, String(Date.now()));
        return url;
      }

      async function fetchSourceText() {
        const response = await fetch(sourceUrl("_sr_poll"), { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`auto-reload poll failed with HTTP ${response.status}`);
        }
        return response.text();
      }

      function startAutoReload() {
        if (!shouldAutoReload()) {
          return;
        }
        let baseline = null;
        let polling = false;
        async function poll() {
          if (polling) {
            return;
          }
          polling = true;
          try {
            const source = await fetchSourceText();
            if (baseline === null) {
              baseline = source;
            } else if (source !== baseline) {
              window.location.replace(sourceUrl("_sr_reloaded"));
            }
          } finally {
            polling = false;
          }
        }
        poll().catch((error) => {
          console.error(error);
        });
        window.setInterval(() => {
          poll().catch((error) => {
            console.error(error);
          });
        }, AUTO_RELOAD_POLL_MS);
      }

      function rosenbrock(theta) {
        const u = f32(theta[0] / SCALE);
        const v = f32(f32(theta[1] - ROSENBROCK_Y_SHIFT) / SCALE);
        const oneMinusU = f32(1.0 - u);
        const curveError = f32(v - f32(u * u));
        return f32(f32(oneMinusU * oneMinusU) + f32(100.0 * f32(curveError * curveError)));
      }

      function rosenbrockGrad(theta) {
        const u = f32(theta[0] / SCALE);
        const v = f32(f32(theta[1] - ROSENBROCK_Y_SHIFT) / SCALE);
        const curveError = f32(v - f32(u * u));
        const du = f32(f32(-2.0 * f32(1.0 - u)) - f32(400.0 * f32(u * curveError)));
        const dv = f32(200.0 * curveError);
        return [f32(du / SCALE), f32(dv / SCALE)];
      }

      function e3m2Lattice() {
        const values = [0.0];
        const exponentBias = 3;
        const mantissaBits = 2;
        for (let exponent = 0; exponent < 8; exponent += 1) {
          for (let mantissa = 0; mantissa < 4; mantissa += 1) {
            if (exponent === 0 && mantissa === 0) {
              continue;
            }
            const significand = exponent === 0
              ? mantissa / (1 << mantissaBits)
              : 1.0 + mantissa / (1 << mantissaBits);
            const value = significand * 2.0 ** (Math.max(exponent, 1) - exponentBias);
            values.push(value);
            values.push(-value);
          }
        }
        return Array.from(new Set(values)).sort((a, b) => a - b);
      }

      const FP6 = e3m2Lattice();

      function fp6MantissaIsEven(value) {
        const magnitude = Math.abs(value);
        if (magnitude === 0.0) {
          return true;
        }
        const exponentBias = 3;
        const mantissaBits = 2;
        for (let exponent = 0; exponent < 8; exponent += 1) {
          for (let mantissa = 0; mantissa < 4; mantissa += 1) {
            if (exponent === 0 && mantissa === 0) {
              continue;
            }
            const significand = exponent === 0
              ? mantissa / (1 << mantissaBits)
              : 1.0 + mantissa / (1 << mantissaBits);
            const represented = significand * 2.0 ** (Math.max(exponent, 1) - exponentBias);
            if (Math.abs(represented - magnitude) < 1e-12) {
              return mantissa % 2 === 0;
            }
          }
        }
        throw new Error(`value is not representable in FP6: ${value}`);
      }

      function lowerBound(values, x) {
        let lo = 0;
        let hi = values.length;
        while (lo < hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (values[mid] < x) {
            lo = mid + 1;
          } else {
            hi = mid;
          }
        }
        return lo;
      }

      function roundScalarFp6(x, mode, rng) {
        assertFinite(x, "roundScalarFp6 input");
        if (x <= FP6[0]) {
          return FP6[0];
        }
        if (x >= FP6[FP6.length - 1]) {
          return FP6[FP6.length - 1];
        }

        const idxHi = Math.min(Math.max(lowerBound(FP6, x), 0), FP6.length - 1);
        const idxLo = Math.min(Math.max(idxHi - 1, 0), FP6.length - 1);
        const lo = FP6[idxLo];
        const hi = FP6[idxHi];
        const width = hi - lo;

        if (mode === "rtn") {
          const midpoint = lo + 0.5 * width;
          if (x < midpoint) {
            return lo;
          }
          if (x > midpoint) {
            return hi;
          }
          const loEven = fp6MantissaIsEven(lo);
          const hiEven = fp6MantissaIsEven(hi);
          if (loEven === hiEven) {
            throw new Error(`RTNE tie has no unique even endpoint: ${lo}, ${hi}`);
          }
          return hiEven ? hi : lo;
        }
        if (mode === "sr") {
          if (rng === null) {
            throw new Error("SR requires an rng");
          }
          const probHi = width === 0 ? 0.0 : (x - lo) / width;
          return rng() < probHi ? hi : lo;
        }
        throw new Error(`unknown rounding mode: ${mode}`);
      }

      function roundFp6(theta, mode, rng) {
        return [
          f32(roundScalarFp6(theta[0], mode, rng)),
          f32(roundScalarFp6(theta[1], mode, rng))
        ];
      }

      function formatBeta(beta) {
        return beta.toFixed(2);
      }

      function mulberry32(seed) {
        let state = (seed + 0x6d2b79f5) >>> 0;
        return () => {
          state = (state + 0x6d2b79f5) >>> 0;
          let t = state;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      function initializeScalarRoundingPlot(root, instanceIndex) {
        if (!(root instanceof HTMLElement)) {
          throw new Error(".sr-rounding-demo root is not an HTML element");
        }
        function findInRoot(selector, fallbackId) {
          const local = root.querySelector(selector);
          if (local !== null) {
            return local;
          }
          if (fallbackId === null) {
            return null;
          }
          return document.getElementById(fallbackId);
        }
        const hideCurrentSample = root.dataset.hideSample === "true";
        const useLargeSnapshotFont = root.dataset.largeFont === "true";
        const hideRtnLegend = root.dataset.hideRtnLegend === "true";
        const hideRtnCurve = root.dataset.hideRtnCurve === "true";
        const hideYAxisLabel = root.dataset.hideYAxisLabel === "true";
        const centerPlot = root.dataset.centerPlot === "true";
        const roundingCanvas = findInRoot('[data-role="sr-rounding-canvas"]', "sr-rounding-canvas");
        if (!(roundingCanvas instanceof HTMLCanvasElement)) {
          throw new Error("missing scalar rounding canvas element");
        }
        const roundingCtx = roundingCanvas.getContext("2d", { alpha: false });
        if (roundingCtx === null) {
          throw new Error("could not create scalar rounding canvas context");
        }
        const rtnButton = findInRoot('[data-role="sr-rounding-rtn"]', "sr-rounding-rtn");
        if (!(rtnButton instanceof HTMLButtonElement)) {
          throw new Error("missing scalar rounding RTN button");
        }
        const sampleButton = findInRoot('[data-role="sr-rounding-sample"]', "sr-rounding-sample");
        if (!(sampleButton instanceof HTMLButtonElement)) {
          throw new Error("missing scalar rounding SR button");
        }
        const playButton = findInRoot('[data-role="sr-rounding-play"]', "sr-rounding-play");
        if (!(playButton instanceof HTMLButtonElement)) {
          throw new Error("missing scalar rounding play button");
        }
        const pauseButton = findInRoot('[data-role="sr-rounding-pause"]', "sr-rounding-pause");
        if (!(pauseButton instanceof HTMLButtonElement)) {
          throw new Error("missing scalar rounding pause button");
        }
        const ffwdButton = findInRoot('[data-role="sr-rounding-ffwd"]', "sr-rounding-ffwd");
        if (!(ffwdButton instanceof HTMLButtonElement)) {
          throw new Error("missing scalar rounding fast-forward button");
        }
        const resetButton = findInRoot('[data-role="sr-rounding-reset"]', "sr-rounding-reset");
        if (!(resetButton instanceof HTMLButtonElement)) {
          throw new Error("missing scalar rounding reset button");
        }
        const floorModeInput = findInRoot('[data-role="sr-rounding-mode-floor"]', "sr-rounding-mode-floor");
        if (!(floorModeInput instanceof HTMLInputElement)) {
          throw new Error("missing scalar rounding floor mode input");
        }
        const centeredModeInput = findInRoot('[data-role="sr-rounding-mode-centered"]', "sr-rounding-mode-centered");
        if (!(centeredModeInput instanceof HTMLInputElement)) {
          throw new Error("missing scalar rounding centered mode input");
        }
        const randomBitsInput = findInRoot('[data-role="sr-rounding-rbits"]', "sr-rounding-rbits");
        if (!(randomBitsInput instanceof HTMLInputElement)) {
          throw new Error("missing scalar rounding random bits input");
        }
        const seedReadout = findInRoot('[data-role="sr-rounding-seed"]', "sr-rounding-seed");
        if (!(seedReadout instanceof HTMLElement)) {
          throw new Error("missing scalar rounding seed readout");
        }
        floorModeInput.name = `sr-rounding-mode-${instanceIndex}`;
        centeredModeInput.name = `sr-rounding-mode-${instanceIndex}`;

        const xMin = 2.9;
        const xMax = 7.0;
        const yMin = 2.4;
        const yMax = 7.6;
        const lattice = [2.5, 3.0, 3.5, 4.0, 5.0, 6.0, 7.0];
        const xTicks = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0];
        const bf16Inputs = bf16ValuesInRange(xMin, xMax);
        const baseFrameMs = 50;
        const baseNominalFps = Math.round(1000 / baseFrameMs);
        const maxVisibleFps = 40;
        const maxFastVisibleFps = 120;
        const fastForwardBurst = 4;
        const baseRunSamples = 100;
        let seed = 1;
        let widthPx = 0;
        let heightPx = 0;
        let runTimer = null;
        let showRtn = !hideRtnCurve;
        let currentRoundedValues = [];
        let averageRoundedSums = [];
        let averageRunCount = 0;
        let meanVisible = false;
        let runSamplesRemaining = 0;
        let currentFrameMs = baseFrameMs;
        let currentSamplesPerFrame = 1;
        let nextRunTargetFps = baseNominalFps;
        let nextRunSampleBudget = baseRunSamples;
        let shouldKeepDoublingRunSamples = true;
        let currentRunTargetFps = 0;
        let currentRunSampleBudget = 0;
        let currentRunNominalMs = 0;
        let currentRunStartedAt = 0;
        let currentRunElapsedMs = 0;
        let playbackMode = null;

        function bf16ValuesInRange(lo, hi) {
          const values = [];
          const exponentBias = 127;
          const mantissaValues = 1 << 7;
          for (let exponent = 1; exponent < 255; exponent += 1) {
            const scale = 2.0 ** (exponent - exponentBias);
            for (let mantissa = 0; mantissa < mantissaValues; mantissa += 1) {
              const value = (1.0 + mantissa / mantissaValues) * scale;
              if (value >= lo && value <= hi) {
                values.push(value);
              }
            }
          }
          if (values.length === 0) {
            throw new Error(`no BF16 inputs in range [${lo}, ${hi}]`);
          }
          return values;
        }

        function scalarLowerBound(values, x) {
          let lo = 0;
          let hi = values.length;
          while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (values[mid] < x) {
              lo = mid + 1;
            } else {
              hi = mid;
            }
          }
          return lo;
        }

        function getRandomBits() {
          const value = Number.parseInt(randomBitsInput.value, 10);
          if (!Number.isInteger(value) || value < 0 || value > 24) {
            throw new Error(`SR random bits R must be an integer in [0, 24], got ${randomBitsInput.value}`);
          }
          return value;
        }

        function useCenteredSr() {
          return centeredModeInput.checked;
        }

        function currentSrAppearance() {
          if (useCenteredSr()) {
            return {
              sampleLine: "rgba(22, 130, 91, 0.22)",
              sampleFill: "#0a842f",
              meanStroke: "#18a45e",
              sampleLabel: "SR+, seed",
              meanLabel: "SR+, mean of"
            };
          }
          return {
            sampleLine: "rgba(108, 171, 222, 0.24)",
            sampleFill: "#6cabde",
            meanStroke: "#86bfe7",
            sampleLabel: "SR, seed",
            meanLabel: "SR, mean of"
          };
        }

        function roundStochasticLattice(x, rng, randomBits, centered) {
          if (x <= lattice[0]) {
            return lattice[0];
          }
          if (x >= lattice[lattice.length - 1]) {
            return lattice[lattice.length - 1];
          }
          const idxHi = scalarLowerBound(lattice, x);
          const lo = lattice[idxHi - 1];
          const hi = lattice[idxHi];
          const probHi = (x - lo) / (hi - lo);
          const levels = 2 ** randomBits;
          const randomInteger = Math.floor(rng() * levels);
          if (centered) {
            return randomInteger + 0.5 < probHi * levels ? hi : lo;
          }
          return randomInteger < probHi * levels ? hi : lo;
        }

        function sampleRoundedValues(sampleSeed) {
          const randomBits = getRandomBits();
          const centered = useCenteredSr();
          const rng = mulberry32(sampleSeed);
          return bf16Inputs.map((x) => roundStochasticLattice(x, rng, randomBits, centered));
        }

        function resetRunPacingState() {
          runSamplesRemaining = 0;
          currentFrameMs = baseFrameMs;
          currentSamplesPerFrame = 1;
          nextRunTargetFps = baseNominalFps;
          nextRunSampleBudget = baseRunSamples;
          shouldKeepDoublingRunSamples = true;
          currentRunTargetFps = 0;
          currentRunSampleBudget = 0;
          currentRunNominalMs = 0;
          currentRunStartedAt = 0;
          currentRunElapsedMs = 0;
          playbackMode = null;
        }

        function resetAverageState() {
          currentRoundedValues = [];
          averageRoundedSums = bf16Inputs.map(() => 0.0);
          averageRunCount = 0;
          meanVisible = false;
          resetRunPacingState();
        }

        function accumulateSeed(sampleSeed) {
          const values = sampleRoundedValues(sampleSeed);
          if (values.length !== bf16Inputs.length) {
            throw new Error(`rounded value count ${values.length} does not match BF16 input count ${bf16Inputs.length}`);
          }
          currentRoundedValues = values;
          for (let i = 0; i < values.length; i += 1) {
            averageRoundedSums[i] += values[i];
          }
          averageRunCount += 1;
        }

        function meanErrorStdevEstimate() {
          if (averageRunCount < 2) {
            return 0.0;
          }
          const normalizedErrors = [];
          for (let i = 0; i < bf16Inputs.length; i += 1) {
            const x = bf16Inputs[i];
            const scale = Math.floor(Math.log2(x));
            if (scale <= 0) {
              continue;
            }
            const mean = averageRoundedSums[i] / averageRunCount;
            normalizedErrors.push((mean - x) / scale);
          }
          if (normalizedErrors.length < 2) {
            return 0.0;
          }
          const meanError = normalizedErrors.reduce((acc, value) => acc + value, 0.0) / normalizedErrors.length;
          let variance = 0.0;
          for (const value of normalizedErrors) {
            variance += (value - meanError) * (value - meanError);
          }
          variance /= normalizedErrors.length;
          return Math.sqrt(Math.max(0.0, variance));
        }

        function formatBinaryScientific(value) {
          if (value === 0.0) {
            return "0.0 x 2^0";
          }
          if (value < 0.0) {
            throw new Error(`expected non-negative stdev, got ${value}`);
          }
          const exponent = Math.floor(Math.log2(value));
          const mantissa = value / (2 ** exponent);
          return `${mantissa.toFixed(1)} x 2^${exponent}`;
        }

        function draw() {
          const hasSr = currentRoundedValues.length === bf16Inputs.length;
          const hasMean = averageRunCount > 0;
          const showMean = meanVisible && hasMean;
          const srAppearance = currentSrAppearance();
          if (currentRoundedValues.length !== 0 && currentRoundedValues.length !== bf16Inputs.length) {
            throw new Error("scalar rounding plot has invalid current SR sample state");
          }
          if (averageRoundedSums.length !== 0 && averageRoundedSums.length !== bf16Inputs.length) {
            throw new Error("scalar rounding plot has invalid SR average state");
          }
          if (averageRunCount < 0) {
            throw new Error("scalar rounding plot average count cannot be negative");
          }
          if (hasMean && averageRoundedSums.length !== bf16Inputs.length) {
            throw new Error("scalar rounding plot average has invalid sum state");
          }
        const wrap = roundingCanvas.parentElement;
          if (wrap === null) {
            throw new Error("scalar rounding canvas has no parent");
          }
          const rect = wrap.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          widthPx = Math.max(1, rect.width || wrap.clientWidth || 420);
          heightPx = Math.max(1, rect.height || wrap.clientHeight || 420);
          roundingCanvas.width = Math.round(widthPx * dpr);
          roundingCanvas.height = Math.round(heightPx * dpr);
          roundingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

          const smallViewport = widthPx < 430;
          const fontScale = useLargeSnapshotFont ? 1.45 : 1.0;
          const tickFontPx = (smallViewport ? 13 : 12) * fontScale;
          const axisLabelFontPx = (smallViewport ? 13 : 12) * fontScale;
          const margins = smallViewport
            ? { left: 34, right: 16, top: 18, bottom: 50 }
            : { left: 58, right: 20, top: 22, bottom: 58 };
          const availableWidth = widthPx - margins.left - margins.right;
          const availableHeight = heightPx - margins.top - margins.bottom;
          const xRange = xMax - xMin;
          const yRange = yMax - yMin;
          const pixelsPerUnit = Math.min(availableWidth / xRange, availableHeight / yRange);
          const plotWidth = pixelsPerUnit * xRange;
          const plotHeight = pixelsPerUnit * yRange;
          const horizontalSlack = availableWidth - plotWidth;
          const left = margins.left + (centerPlot ? 0.5 * horizontalSlack : 0.0);
          const top = margins.top + 0.5 * (availableHeight - plotHeight);
          const bottom = top + plotHeight;

          function sx(x) {
            return left + ((x - xMin) / (xMax - xMin)) * plotWidth;
          }

          function sy(y) {
            return top + (1.0 - (y - yMin) / (yMax - yMin)) * plotHeight;
          }

          function line(x0, y0, x1, y1) {
            roundingCtx.beginPath();
            roundingCtx.moveTo(sx(x0), sy(y0));
            roundingCtx.lineTo(sx(x1), sy(y1));
            roundingCtx.stroke();
          }

          function dot(x, y, radius, fillStyle, strokeStyle, lineWidth) {
            roundingCtx.beginPath();
            roundingCtx.arc(sx(x), sy(y), radius, 0, Math.PI * 2);
            if (fillStyle !== null) {
              roundingCtx.fillStyle = fillStyle;
              roundingCtx.fill();
            }
            roundingCtx.strokeStyle = strokeStyle;
            roundingCtx.lineWidth = lineWidth;
            roundingCtx.stroke();
          }

          function plus(x, y, radius, strokeStyle, lineWidth) {
            const cx = sx(x);
            const cy = sy(y);
            roundingCtx.strokeStyle = strokeStyle;
            roundingCtx.lineWidth = lineWidth;
            roundingCtx.beginPath();
            roundingCtx.moveTo(cx - radius, cy);
            roundingCtx.lineTo(cx + radius, cy);
            roundingCtx.moveTo(cx, cy - radius);
            roundingCtx.lineTo(cx, cy + radius);
            roundingCtx.stroke();
          }

          roundingCtx.fillStyle = "#fffefa";
          roundingCtx.fillRect(0, 0, widthPx, heightPx);

          roundingCtx.save();
          roundingCtx.strokeStyle = "rgba(21, 22, 26, 0.11)";
          roundingCtx.lineWidth = 1;
          for (const tick of xTicks) {
            line(tick, yMin, tick, yMax);
          }
          for (const tick of lattice) {
            line(xMin, tick, xMax, tick);
          }
          roundingCtx.strokeStyle = "rgba(21, 22, 26, 0.82)";
          roundingCtx.lineWidth = 1.4;
          roundingCtx.beginPath();
          roundingCtx.moveTo(left, top);
          roundingCtx.lineTo(left, bottom);
          roundingCtx.lineTo(left + plotWidth, bottom);
          roundingCtx.stroke();
          roundingCtx.restore();

          roundingCtx.save();
          roundingCtx.fillStyle = "rgba(21, 22, 26, 0.78)";
          roundingCtx.font = `${tickFontPx}px ui-sans-serif, system-ui, sans-serif`;
          roundingCtx.textAlign = "center";
          roundingCtx.textBaseline = "top";
          for (const tick of xTicks) {
            roundingCtx.fillText(tick.toFixed(1), sx(tick), bottom + 8);
          }
          roundingCtx.textAlign = "right";
          roundingCtx.textBaseline = "middle";
          for (const tick of lattice) {
            roundingCtx.fillText(tick.toFixed(1), left - 8, sy(tick));
          }
          roundingCtx.textAlign = "center";
          roundingCtx.textBaseline = "bottom";
          roundingCtx.font = `${axisLabelFontPx}px ui-sans-serif, system-ui, sans-serif`;
          roundingCtx.fillText("Input BF16 value", left + plotWidth / 2, heightPx - 8);
          if (!hideYAxisLabel) {
            const yLabelX = left - (smallViewport ? 34 : 42);
            roundingCtx.save();
            roundingCtx.translate(yLabelX, top + plotHeight / 2);
            roundingCtx.rotate(-Math.PI / 2);
            roundingCtx.fillText("Value rounded to E3M2", 0, 0);
            roundingCtx.restore();
          }
          roundingCtx.restore();

          roundingCtx.save();
          roundingCtx.strokeStyle = "rgba(21, 22, 26, 0.82)";
          roundingCtx.lineWidth = 2.2;
          roundingCtx.beginPath();
          roundingCtx.moveTo(sx(xMin), sy(xMin));
          roundingCtx.lineTo(sx(xMax), sy(xMax));
          roundingCtx.stroke();
          roundingCtx.restore();

          if (showRtn) {
            roundingCtx.save();
            roundingCtx.strokeStyle = "#e85b9d";
            roundingCtx.lineWidth = 2.4;
            roundingCtx.lineJoin = "round";
            roundingCtx.lineCap = "butt";
            for (let i = 0; i < lattice.length; i += 1) {
              const rounded = lattice[i];
              const loEdge = i === 0 ? xMin : 0.5 * (lattice[i - 1] + rounded);
              const hiEdge = i === lattice.length - 1 ? xMax : 0.5 * (rounded + lattice[i + 1]);
              const lo = Math.max(xMin, loEdge);
              const hi = Math.min(xMax, hiEdge);
              if (lo < hi) {
                line(lo, rounded, hi, rounded);
              }
              if (i < lattice.length - 1) {
                const jump = hiEdge;
                if (jump > xMin && jump < xMax) {
                  const loEven = fp6MantissaIsEven(rounded);
                  const hiEven = fp6MantissaIsEven(lattice[i + 1]);
                  if (loEven === hiEven) {
                    throw new Error(`RTNE tie has no unique even endpoint: ${rounded}, ${lattice[i + 1]}`);
                  }
                  const tieChoosesHi = hiEven;
                  dot(jump, rounded, 3.8, tieChoosesHi ? "#fffefa" : "#e85b9d", "#e85b9d", tieChoosesHi ? 1.8 : 1.4);
                  dot(jump, lattice[i + 1], 3.8, tieChoosesHi ? "#e85b9d" : "#fffefa", "#e85b9d", tieChoosesHi ? 1.4 : 1.8);
                }
              }
            }
            roundingCtx.restore();
          }

          if (hasSr && !hideCurrentSample) {
            roundingCtx.save();
            roundingCtx.strokeStyle = srAppearance.sampleLine;
            roundingCtx.fillStyle = srAppearance.sampleFill;
            roundingCtx.lineWidth = 1.2;
            const srDotRadius = widthPx < 430 ? 1.4 : 1.8;
            for (let i = 0; i < bf16Inputs.length; i += 1) {
              const x = bf16Inputs[i];
              const rounded = currentRoundedValues[i];
              line(x, x, x, rounded);
              roundingCtx.beginPath();
              roundingCtx.arc(sx(x), sy(rounded), srDotRadius, 0, Math.PI * 2);
              roundingCtx.fill();
            }
            roundingCtx.restore();
          }

          if (showMean) {
            roundingCtx.save();
            roundingCtx.lineCap = "round";
            const meanPlusRadius = widthPx < 430 ? 2.7 : 3.3;
            const meanPlusWidth = widthPx < 430 ? 1.5 : 1.8;
            for (let i = 0; i < bf16Inputs.length; i += 1) {
              const x = bf16Inputs[i];
              const mean = averageRoundedSums[i] / averageRunCount;
              plus(x, mean, meanPlusRadius, srAppearance.meanStroke, meanPlusWidth);
            }
            roundingCtx.restore();
          }

          roundingCtx.save();
          const legendX = left + 12;
          let legendY = top + 14;
          const legendRowHeight = 22 * fontScale;
          const customMeanLegendLabel = root.dataset.meanLegendLabel || null;
          const legendLabels = ["True value"];
          if (showRtn && !hideRtnLegend) {
            legendLabels.push("RTNE");
          }
          if (hasSr && !hideCurrentSample) {
            legendLabels.push(`${srAppearance.sampleLabel} ${seed}`);
          }
          if (showMean) {
            legendLabels.push(customMeanLegendLabel ?? `${srAppearance.meanLabel} ${averageRunCount} samples`);
          }
          const legendFontPx = 12 * fontScale;
          roundingCtx.font = `${legendFontPx}px ui-sans-serif, system-ui, sans-serif`;
          const legendTextWidth = Math.max(...legendLabels.map((label) => roundingCtx.measureText(label).width));
          const legendWidth = Math.ceil(36 * fontScale + legendTextWidth + 12);
          const legendRowCount = legendLabels.length;
          const legendPadTop = 10;
          const legendPadBottom = 10;
          roundingCtx.fillStyle = "rgba(255, 254, 250, 0.86)";
          roundingCtx.strokeStyle = "rgba(21, 22, 26, 0.14)";
          roundingCtx.lineWidth = 1;
          const legendHeight = Math.ceil(legendPadTop + legendPadBottom + legendRowHeight * legendRowCount);
          roundingCtx.fillRect(legendX - 8, legendY - 10, legendWidth, legendHeight);
          roundingCtx.strokeRect(legendX - 8, legendY - 10, legendWidth, legendHeight);
          roundingCtx.textAlign = "left";
          roundingCtx.textBaseline = "middle";
          roundingCtx.strokeStyle = "rgba(21, 22, 26, 0.82)";
          roundingCtx.lineWidth = 2.2;
          roundingCtx.beginPath();
          roundingCtx.moveTo(legendX, legendY);
          roundingCtx.lineTo(legendX + 24, legendY);
          roundingCtx.stroke();
          roundingCtx.fillStyle = colors.ink;
          roundingCtx.fillText("True value", legendX + 36 * fontScale, legendY);
          if (showRtn && !hideRtnLegend) {
            legendY += legendRowHeight;
            roundingCtx.strokeStyle = "#e85b9d";
            roundingCtx.lineWidth = 2.4;
            roundingCtx.beginPath();
            roundingCtx.moveTo(legendX, legendY);
            roundingCtx.lineTo(legendX + 24, legendY);
            roundingCtx.stroke();
            roundingCtx.fillStyle = colors.ink;
            roundingCtx.fillText("RTNE", legendX + 36 * fontScale, legendY);
          }
          if (hasSr && !hideCurrentSample) {
            legendY += legendRowHeight;
            roundingCtx.fillStyle = srAppearance.sampleFill;
            roundingCtx.beginPath();
            roundingCtx.arc(legendX + 12, legendY, 3.0, 0, Math.PI * 2);
            roundingCtx.fill();
            roundingCtx.fillStyle = colors.ink;
            roundingCtx.fillText(`${srAppearance.sampleLabel} ${seed}`, legendX + 36 * fontScale, legendY);
          }
          if (showMean) {
            legendY += legendRowHeight;
            roundingCtx.lineCap = "round";
            roundingCtx.strokeStyle = srAppearance.meanStroke;
            roundingCtx.lineWidth = 1.6;
            roundingCtx.beginPath();
            roundingCtx.moveTo(legendX + 8, legendY);
            roundingCtx.lineTo(legendX + 16, legendY);
            roundingCtx.moveTo(legendX + 12, legendY - 4);
            roundingCtx.lineTo(legendX + 12, legendY + 4);
            roundingCtx.stroke();
            roundingCtx.fillStyle = colors.ink;
            roundingCtx.fillText(customMeanLegendLabel ?? `${srAppearance.meanLabel} ${averageRunCount} samples`, legendX + 36 * fontScale, legendY);
          }
          roundingCtx.restore();

          if (!hasSr) {
            seedReadout.textContent = showRtn ? "RTNE only" : "no SR yet";
          } else if (!showMean) {
            seedReadout.textContent = `seed ${seed}`;
          } else {
            seedReadout.textContent = `Samples: ${averageRunCount}, Stdev: ${formatBinaryScientific(meanErrorStdevEstimate())} ⌊log₂(x)⌋`;
          }
        }

        function updateButtons() {
          playButton.classList.toggle("is-active", runTimer !== null && playbackMode === "play");
          ffwdButton.classList.toggle("is-active", runTimer !== null && playbackMode === "ffwd");
          pauseButton.classList.toggle("is-active", runTimer === null);
          pauseButton.disabled = runTimer === null;
          rtnButton.classList.toggle("is-active", showRtn);
          rtnButton.setAttribute("aria-pressed", String(showRtn));
        }

        function configureCurrentRunPacing() {
          const visibleFpsCap = playbackMode === "ffwd" ? maxFastVisibleFps : maxVisibleFps;
          const visibleFps = Math.min(currentRunTargetFps, visibleFpsCap);
          currentFrameMs = 1000 / visibleFps;
          currentSamplesPerFrame = Math.max(1, Math.round(currentRunTargetFps / visibleFps));
          if (playbackMode === "ffwd") {
            currentSamplesPerFrame *= fastForwardBurst;
          }
        }

        function restartRunTimer() {
          if (runTimer !== null) {
            window.clearInterval(runTimer);
          }
          runTimer = window.setInterval(stepSeed, currentFrameMs);
        }

        function beginNewRun() {
          currentRunTargetFps = nextRunTargetFps;
          currentRunSampleBudget = nextRunSampleBudget;
          configureCurrentRunPacing();
          runSamplesRemaining = currentRunSampleBudget;
          currentRunNominalMs = 1000 * currentRunSampleBudget / currentRunTargetFps;
          currentRunElapsedMs = 0;
          currentRunStartedAt = performance.now();
        }

        function finalizeCompletedRun() {
          if (currentRunTargetFps === 0) {
            return;
          }
          nextRunTargetFps *= 2;
          if (shouldKeepDoublingRunSamples) {
            if (currentRunElapsedMs <= 1.5 * currentRunNominalMs) {
              nextRunSampleBudget *= 2;
            } else {
              shouldKeepDoublingRunSamples = false;
            }
          }
          currentRunTargetFps = 0;
          currentRunSampleBudget = 0;
          currentRunNominalMs = 0;
          currentRunStartedAt = 0;
          currentRunElapsedMs = 0;
          runSamplesRemaining = 0;
        }

        function completeRunAndMaybeContinue() {
          if (currentRunStartedAt !== 0) {
            currentRunElapsedMs += performance.now() - currentRunStartedAt;
            currentRunStartedAt = 0;
          }
          finalizeCompletedRun();
          if (playbackMode === null) {
            return false;
          }
          beginNewRun();
          restartRunTimer();
          updateButtons();
          return true;
        }

        function stepSeed() {
          if (runSamplesRemaining <= 0) {
            if (completeRunAndMaybeContinue()) {
              stepSeed();
            } else {
              stop();
            }
            return;
          }
          for (let i = 0; i < currentSamplesPerFrame; i += 1) {
            if (runSamplesRemaining <= 0) {
              break;
            }
            seed += 1;
            accumulateSeed(seed);
            runSamplesRemaining -= 1;
          }
          draw();
          if (runSamplesRemaining <= 0) {
            if (completeRunAndMaybeContinue()) {
              stepSeed();
            } else {
              stop();
            }
          }
        }

        function start(mode) {
          meanVisible = true;
          playbackMode = mode;
          if (runTimer !== null) {
            if (currentRunStartedAt !== 0) {
              currentRunElapsedMs += performance.now() - currentRunStartedAt;
            }
            configureCurrentRunPacing();
            currentRunStartedAt = performance.now();
            restartRunTimer();
            updateButtons();
            return;
          }
          if (runSamplesRemaining <= 0 || currentRunTargetFps === 0) {
            beginNewRun();
          } else {
            configureCurrentRunPacing();
            currentRunStartedAt = performance.now();
          }
          restartRunTimer();
          updateButtons();
          stepSeed();
        }

        function stop() {
          if (runTimer === null) {
            return;
          }
          if (currentRunStartedAt !== 0) {
            currentRunElapsedMs += performance.now() - currentRunStartedAt;
            currentRunStartedAt = 0;
          }
          const completedRun = currentRunTargetFps !== 0 && runSamplesRemaining <= 0;
          window.clearInterval(runTimer);
          runTimer = null;
          if (completedRun) {
            finalizeCompletedRun();
          }
          playbackMode = null;
          updateButtons();
          draw();
        }

        function reset() {
          stop();
          seed = 1;
          resetAverageState();
          draw();
        }

        rtnButton.addEventListener("click", () => {
          showRtn = !showRtn;
          updateButtons();
          draw();
        });
        sampleButton.addEventListener("click", () => {
          if (runTimer !== null) {
            stop();
          }
          seed += 1;
          accumulateSeed(seed);
          draw();
        });
        playButton.addEventListener("click", () => {
          start("play");
        });
        pauseButton.addEventListener("click", () => {
          stop();
        });
        ffwdButton.addEventListener("click", () => {
          start("ffwd");
        });
        resetButton.addEventListener("click", () => {
          reset();
        });
        randomBitsInput.addEventListener("change", () => {
          getRandomBits();
          reset();
        });
        floorModeInput.addEventListener("change", () => {
          reset();
        });
        centeredModeInput.addEventListener("change", () => {
          reset();
        });
        window.addEventListener("resize", draw);
        root.classList.add("js-ready");
        showRtn = !hideRtnCurve;
        updateButtons();
        resetAverageState();
        draw();
      }

      function runAdam(rounding, seed, adamSettings) {
        const rng = rounding === "sr" ? mulberry32(seed) : null;
        let theta = [f32(START[0]), f32(START[1])];
        let m = [f32(0.0), f32(0.0)];
        let v = [f32(0.0), f32(0.0)];
        const trajectory = [[theta[0], theta[1]]];
        const loss = [rosenbrock(theta)];

        for (let step = 1; step <= STEPS; step += 1) {
          const grad = rosenbrockGrad(theta);
          for (let i = 0; i < 2; i += 1) {
            m[i] = f32(f32(adamSettings.beta1 * m[i]) + f32(f32(1.0 - adamSettings.beta1) * grad[i]));
            v[i] = f32(
              f32(adamSettings.beta2 * v[i])
              + f32(f32(1.0 - adamSettings.beta2) * f32(grad[i] * grad[i]))
            );
          }
          const next = [f32(0.0), f32(0.0)];
          for (let i = 0; i < 2; i += 1) {
            const mHat = f32(m[i] / f32(1.0 - adamSettings.beta1 ** step));
            const vHat = f32(v[i] / f32(1.0 - adamSettings.beta2 ** step));
            const denom = f32(f32(Math.sqrt(vHat)) + ADAM_EPS);
            next[i] = f32(theta[i] - f32(adamSettings.lr * f32(mHat / denom)));
          }
          theta = rounding === null ? [f32(next[0]), f32(next[1])] : roundFp6(next, rounding, rng);
          trajectory.push([theta[0], theta[1]]);
          loss.push(rosenbrock(theta));
        }

        return { trajectory, loss };
      }

      function minValue(values) {
        return values.reduce((best, value) => Math.min(best, value), Infinity);
      }

      function median(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 1) {
          return sorted[mid];
        }
        return 0.5 * (sorted[mid - 1] + sorted[mid]);
      }

      let full = null;
      let fp6Rtn = null;
      let fp6SrRtn = null;
      let fp6Runs = [];
      let fp6TraceRuns = [];
      let fp6SrRuns = [];
      let fp6SrTraceRuns = [];
      let singleSrRun = null;
      let nextSingleSrSeed = 1;
      let singleSrPanelRun = null;
      let nextSingleSrPanelSeed = 1;
      let fp6BestByRun = [];
      let fp6MedianFinal = 0.0;
      let fp6MedianBest = 0.0;
      let fp6RtnBestLoss = 0.0;
      let fp6SrBetterCount = 0;

      function syncControlGroup(slider, readout, value, formatter) {
        slider.value = formatter(value);
        readout.textContent = formatter(value);
      }

      function syncAllControlGroups() {
        syncControlGroup(fullLrSlider, fullLrValue, fullSettings.lr, (value) => value.toFixed(1));
        syncControlGroup(fullBeta1Slider, fullBeta1Value, fullSettings.beta1, formatBeta);
        syncControlGroup(fullBeta2Slider, fullBeta2Value, fullSettings.beta2, formatBeta);
        syncControlGroup(lrSlider, lrValue, fp6Settings.lr, (value) => value.toFixed(1));
        syncControlGroup(beta1Slider, beta1Value, fp6Settings.beta1, formatBeta);
        syncControlGroup(beta2Slider, beta2Value, fp6Settings.beta2, formatBeta);
        if (srLrSlider !== null && srLrValue !== null) {
          syncControlGroup(srLrSlider, srLrValue, fp6SrSettings.lr, (value) => value.toFixed(1));
        }
        if (srBeta1Slider !== null && srBeta1Value !== null) {
          syncControlGroup(srBeta1Slider, srBeta1Value, fp6SrSettings.beta1, formatBeta);
        }
        if (srBeta2Slider !== null && srBeta2Value !== null) {
          syncControlGroup(srBeta2Slider, srBeta2Value, fp6SrSettings.beta2, formatBeta);
        }
      }

      function recomputeFullTrajectory() {
        full = runAdam(null, 0, fullSettings);
      }

      function recomputeFp6Trajectories() {
        fp6Rtn = runAdam("rtn", 0, fp6Settings);
        fp6Runs = SR_SEEDS.map((seed) => ({ seed, ...runAdam("sr", seed, fp6Settings) }));
        fp6TraceRuns = fp6Runs.slice(0, SR_TRACE_COUNT);
        fp6BestByRun = fp6Runs.map((run) => minValue(run.loss));
        fp6MedianFinal = median(fp6Runs.map((run) => run.loss[STEPS]));
        fp6MedianBest = median(fp6BestByRun);
        fp6RtnBestLoss = minValue(fp6Rtn.loss);
        fp6SrBetterCount = fp6BestByRun.filter((value) => value < fp6RtnBestLoss).length;
      }

      function recomputeFp6SrTrajectories() {
        fp6SrRtn = runAdam("rtn", 0, fp6SrSettings);
        fp6SrRuns = SR_SEEDS.map((seed) => ({ seed, ...runAdam("sr", seed, fp6SrSettings) }));
        fp6SrTraceRuns = fp6SrRuns.slice(0, SR_TRACE_COUNT);
      }

      function updateFullControls() {
        fullSettings.lr = f32(Number(fullLrSlider.value));
        fullSettings.beta1 = f32(Number(fullBeta1Slider.value));
        fullSettings.beta2 = f32(Number(fullBeta2Slider.value));
        syncControlGroup(fullLrSlider, fullLrValue, fullSettings.lr, (value) => value.toFixed(1));
        syncControlGroup(fullBeta1Slider, fullBeta1Value, fullSettings.beta1, formatBeta);
        syncControlGroup(fullBeta2Slider, fullBeta2Value, fullSettings.beta2, formatBeta);
        recomputeFullTrajectory();
        if (fullRunStarted) {
          fullRunStartedAt = performance.now() - FP6_ANIMATION_MS;
        }
        requestDraw();
      }

      function updateFp6Controls() {
        fp6Settings.lr = f32(Number(lrSlider.value));
        fp6Settings.beta1 = f32(Number(beta1Slider.value));
        fp6Settings.beta2 = f32(Number(beta2Slider.value));
        syncControlGroup(lrSlider, lrValue, fp6Settings.lr, (value) => value.toFixed(1));
        syncControlGroup(beta1Slider, beta1Value, fp6Settings.beta1, formatBeta);
        syncControlGroup(beta2Slider, beta2Value, fp6Settings.beta2, formatBeta);
        recomputeFp6Trajectories();
        const shownMode = fp6RunStarted ? fp6RunMode : null;
        const shownSeed = shownMode === "sr" && singleSrRun !== null ? singleSrRun.seed : null;
        if (shownMode === "sr") {
          if (shownSeed === null) {
            throw new Error("shown SR seed is missing");
          }
          singleSrRun = { seed: shownSeed, ...runAdam("sr", shownSeed, fp6Settings) };
          fp6RunStartedAt = performance.now() - FP6_ANIMATION_MS;
        } else if (shownMode === "rn") {
          fp6RunStartedAt = performance.now() - FP6_ANIMATION_MS;
        }
        requestDraw();
      }

      function updateFp6SrControls() {
        if (
          srLrSlider === null || srLrValue === null
          || srBeta1Slider === null || srBeta1Value === null
          || srBeta2Slider === null || srBeta2Value === null
        ) {
          throw new Error("FP6 SR controls are missing");
        }
        fp6SrSettings.lr = f32(Number(srLrSlider.value));
        fp6SrSettings.beta1 = f32(Number(srBeta1Slider.value));
        fp6SrSettings.beta2 = f32(Number(srBeta2Slider.value));
        syncControlGroup(srLrSlider, srLrValue, fp6SrSettings.lr, (value) => value.toFixed(1));
        syncControlGroup(srBeta1Slider, srBeta1Value, fp6SrSettings.beta1, formatBeta);
        syncControlGroup(srBeta2Slider, srBeta2Value, fp6SrSettings.beta2, formatBeta);
        recomputeFp6SrTrajectories();
        const shownMode = fp6SrRunStarted ? fp6SrRunMode : null;
        const shownSeed = shownMode === "sr" && singleSrPanelRun !== null ? singleSrPanelRun.seed : null;
        if (shownMode === "sr") {
          if (shownSeed === null) {
            throw new Error("shown SR panel seed is missing");
          }
          singleSrPanelRun = { seed: shownSeed, ...runAdam("sr", shownSeed, fp6SrSettings) };
          fp6SrRunStartedAt = performance.now() - FP6_ANIMATION_MS;
        } else if (shownMode === "rn") {
          fp6SrRunStartedAt = performance.now() - FP6_ANIMATION_MS;
        } else if (shownMode === "sr-ensemble") {
          fp6SrRunStartedAt = performance.now() - FP6_ANIMATION_MS;
        }
        requestDraw();
      }

      function applyColormapValue() {
        if (colormapSelect === null) {
          return;
        }
        viewSettings.colormap = colormapSelect.value;
        requestDraw();
      }

      const latticeXValues = [];
      for (const x of FP6) {
        if (x >= X_MIN && x <= X_MAX) {
          latticeXValues.push(x);
        }
      }
      const latticeYValues = [];
      for (const y of FP6) {
        if (y >= Y_MIN && y <= Y_MAX) {
          latticeYValues.push(y);
        }
      }
      const FP6_MINIMUM = findFp6Minimum();

      function findFp6Minimum() {
        let bestTheta = null;
        let bestLoss = Infinity;
        for (const x of latticeXValues) {
          for (const y of latticeYValues) {
            const loss = rosenbrock([x, y]);
            if (loss < bestLoss) {
              bestTheta = [x, y];
              bestLoss = loss;
            }
          }
        }
        if (bestTheta === null) {
          throw new Error("could not find FP6 lattice minimum");
        }
        return { theta: bestTheta, loss: bestLoss };
      }

      const FP6_ANIMATION_MS = 4300;
      let fullRunStarted = false;
      let fullRunStartedAt = 0;
      let fp6RunStarted = false;
      let fp6RunStartedAt = 0;
      let fp6RunMode = null;
      let fp6SrRunStarted = false;
      let fp6SrRunStartedAt = 0;
      let fp6SrRunMode = null;
      let width = 0;
      let height = 0;
      let plot = null;
      let backgroundCanvas = document.createElement("canvas");
      let animationFrame = null;

      function clamp(value, lo, hi) {
        return Math.max(lo, Math.min(hi, value));
      }

      function mix(a, b, t) {
        return a * (1.0 - t) + b * t;
      }

      const colorRamps = {
        cool: [
          [86, 255, 255],
          [112, 229, 255],
          [143, 198, 255],
          [176, 165, 255],
          [207, 134, 255],
          [232, 109, 255],
          [255, 86, 255]
        ],
        coolwarm: [
          [59, 76, 192],
          [103, 136, 238],
          [154, 180, 248],
          [221, 221, 221],
          [244, 154, 123],
          [220, 95, 75],
          [180, 4, 38]
        ],
        viridis: [
          [68, 1, 84],
          [72, 40, 120],
          [62, 74, 137],
          [49, 104, 142],
          [38, 130, 142],
          [31, 158, 137],
          [53, 183, 121],
          [109, 205, 89],
          [180, 222, 44],
          [253, 231, 37]
        ],
        plasma: [
          [13, 8, 135],
          [75, 3, 161],
          [125, 3, 168],
          [168, 34, 150],
          [203, 70, 121],
          [229, 107, 93],
          [248, 148, 65],
          [253, 195, 40],
          [240, 249, 33]
        ],
        magma: [
          [0, 0, 4],
          [28, 16, 68],
          [79, 18, 123],
          [129, 37, 129],
          [181, 54, 122],
          [229, 80, 100],
          [252, 137, 97],
          [254, 194, 135],
          [252, 253, 191]
        ],
        cividis: [
          [0, 32, 76],
          [39, 60, 110],
          [69, 86, 123],
          [96, 111, 131],
          [125, 137, 132],
          [157, 164, 126],
          [190, 193, 111],
          [224, 224, 93],
          [255, 255, 77]
        ],
        gray: [
          [248, 248, 248],
          [216, 216, 216],
          [180, 180, 180],
          [140, 140, 140],
          [96, 96, 96],
          [52, 52, 52],
          [12, 12, 12]
        ]
      };

      function colorRamp(t) {
        const ramp = colorRamps[viewSettings.colormap];
        if (ramp === undefined) {
          throw new Error(`unknown colormap: ${viewSettings.colormap}`);
        }
        const scaled = clamp(t, 0.0, 1.0) * (ramp.length - 1);
        const lo = Math.floor(scaled);
        const hi = Math.min(lo + 1, ramp.length - 1);
        const blend = scaled - lo;
        const c0 = ramp[lo];
        const c1 = ramp[hi];
        return [
          Math.round(mix(c0[0], c1[0], blend)),
          Math.round(mix(c0[1], c1[1], blend)),
          Math.round(mix(c0[2], c1[2], blend))
        ];
      }

      function curvePalette() {
        const palette = curvePalettes[viewSettings.colormap];
        if (palette === undefined) {
          throw new Error(`unknown curve palette: ${viewSettings.colormap}`);
        }
        return palette;
      }

      function screenX(x) {
        return plot.left + ((x - X_MIN) / (X_MAX - X_MIN)) * plot.width;
      }

      function screenY(y) {
        return plot.top + (1.0 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * plot.height;
      }

      function drawCircle(x, y, radius, fill, stroke, lineWidth) {
        ctx.beginPath();
        ctx.arc(screenX(x), screenY(y), radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke !== null) {
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = stroke;
          ctx.stroke();
        }
      }

      function roundedRectPath(x, y, rectWidth, rectHeight, radius) {
        const r = Math.min(radius, rectWidth / 2, rectHeight / 2);
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + rectWidth - r, y);
        ctx.arcTo(x + rectWidth, y, x + rectWidth, y + r, r);
        ctx.lineTo(x + rectWidth, y + rectHeight - r);
        ctx.arcTo(x + rectWidth, y + rectHeight, x + rectWidth - r, y + rectHeight, r);
        ctx.lineTo(x + r, y + rectHeight);
        ctx.arcTo(x, y + rectHeight, x, y + rectHeight - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
      }

      function drawStar(x, y, radius, fill, stroke) {
        const cx = screenX(x);
        const cy = screenY(y);
        ctx.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const angle = -Math.PI / 2 + (i * Math.PI) / 5;
          const r = i % 2 === 0 ? radius : radius * 0.42;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = stroke;
        ctx.stroke();
      }

      function starPathAt(cx, cy, radius) {
        ctx.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const angle = -Math.PI / 2 + (i * Math.PI) / 5;
          const r = i % 2 === 0 ? radius : radius * 0.42;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
      }

      function buildBackground() {
        if (plot.width <= 0 || plot.height <= 0) {
          throw new Error(`invalid plot size ${plot.width} x ${plot.height}`);
        }
        const bw = 320;
        const bh = Math.max(1, Math.round(bw * plot.height / plot.width));
        backgroundCanvas.width = bw;
        backgroundCanvas.height = bh;
        const bctx = backgroundCanvas.getContext("2d");
        if (bctx === null) {
          throw new Error("could not create background canvas context");
        }
        const image = bctx.createImageData(bw, bh);
        const data = image.data;
        const values = new Float32Array(bw * bh);
        let zMin = Infinity;
        let zMax = -Infinity;

        for (let py = 0; py < bh; py += 1) {
          const y = Y_MAX - (py / Math.max(1, bh - 1)) * (Y_MAX - Y_MIN);
          for (let px = 0; px < bw; px += 1) {
            const x = X_MIN + (px / Math.max(1, bw - 1)) * (X_MAX - X_MIN);
            const z = Math.log10(1.0 + rosenbrock([x, y]));
            const idx = py * bw + px;
            values[idx] = z;
            zMin = Math.min(zMin, z);
            zMax = Math.max(zMax, z);
          }
        }
        if (!(zMax > zMin)) {
          throw new Error(`invalid background value range [${zMin}, ${zMax}]`);
        }
        for (let py = 0; py < bh; py += 1) {
          for (let px = 0; px < bw; px += 1) {
            const z = values[py * bw + px];
            const t = (z - zMin) / (zMax - zMin);
            const color = colorRamp(t);
            const idx = 4 * (py * bw + px);
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
          }
        }
        bctx.putImageData(image, 0, 0);
      }

      function resize() {
        const wrap = canvas.parentElement;
        if (!(wrap instanceof HTMLElement)) {
          throw new Error("canvas has no HTMLElement parent");
        }
        const wrapRect = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const fallbackWidth = wrap.clientWidth || 640;
        const compact = (wrapRect.width || fallbackWidth) < 760;
        const margins = {
          left: compact ? 30 : 40,
          right: compact ? 10 : 14,
          top: compact ? 8 : 12,
          bottom: compact ? 34 : 28
        };
        const targetWidth = Math.max(1, wrapRect.width || fallbackWidth);
        const targetHeight = Math.ceil((targetWidth - margins.left - margins.right) / DATA_ASPECT + margins.top + margins.bottom);
        wrap.style.height = `${targetHeight}px`;

        const measuredRect = wrap.getBoundingClientRect();
        const fallbackHeight = wrap.clientHeight || targetHeight;
        width = Math.max(1, measuredRect.width || targetWidth);
        height = Math.max(1, measuredRect.height || fallbackHeight);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const availableWidth = width - margins.left - margins.right;
        const availableHeight = height - margins.top - margins.bottom;
        let plotWidth = availableWidth;
        let plotHeight = plotWidth / DATA_ASPECT;
        if (plotHeight > availableHeight) {
          plotHeight = availableHeight;
          plotWidth = plotHeight * DATA_ASPECT;
        }
        const horizontalSlack = availableWidth - plotWidth;
        const horizontalOffset = compact ? 0.18 * horizontalSlack : 0.5 * horizontalSlack;
        plot = {
          left: margins.left + horizontalOffset,
          right: margins.right + (horizontalSlack - horizontalOffset),
          top: margins.top + 0.5 * (availableHeight - plotHeight),
          bottom: margins.bottom + 0.5 * (availableHeight - plotHeight),
          width: plotWidth,
          height: plotHeight
        };
        buildBackground();
      }

      function setRenderTarget(targetCanvas, targetCtx) {
        canvas = targetCanvas;
        ctx = targetCtx;
        resize();
      }

      function drawError(error) {
        const message = error instanceof Error ? error.message : String(error);
        ctx.fillStyle = "#fffefa";
        ctx.fillRect(0, 0, Math.max(width, 1), Math.max(height, 1));
        ctx.fillStyle = colors.red;
        ctx.font = "700 15px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("Canvas render failed", 24, 34);
        ctx.fillStyle = colors.ink;
        ctx.font = "13px ui-monospace, SFMono-Regular, Consolas, monospace";
        ctx.fillText(message.slice(0, 90), 24, 60);
      }

      function drawBackground() {
        ctx.fillStyle = "#fffefa";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(backgroundCanvas, plot.left, plot.top, plot.width, plot.height);
      }

      function drawAxes() {
        ctx.save();
        ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = "rgba(8, 9, 12, 0.78)";

        const xTicks = [-28, -16, -8, -4, 0, 4, 8, 16, 28];
        ctx.textAlign = "center";
        ctx.strokeStyle = "rgba(8, 9, 12, 0.46)";
        ctx.lineWidth = 1;
        for (const tick of xTicks) {
          const x = screenX(tick);
          ctx.beginPath();
          ctx.moveTo(x, plot.top + plot.height);
          ctx.lineTo(x, plot.top + plot.height + 6);
          ctx.stroke();
          ctx.fillText(String(tick), x, plot.top + plot.height + 20);
        }

        const yTicks = [-8, -4, 0, 4, 8, 16, 28];
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (const tick of yTicks) {
          const y = screenY(tick);
          ctx.beginPath();
          ctx.moveTo(plot.left - 6, y);
          ctx.lineTo(plot.left, y);
          ctx.stroke();
          ctx.fillText(String(tick), plot.left - 10, y);
        }
        ctx.restore();
      }

      function drawValleyGuide() {
        ctx.save();
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 180; i += 1) {
          const u = -1.5 + (3.0 * i) / 180;
          const x = u * SCALE;
          const y = ROSENBROCK_Y_SHIFT + u * u * SCALE;
          if (y < Y_MIN || y > Y_MAX) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(screenX(x), screenY(y));
            started = true;
          } else {
            ctx.lineTo(screenX(x), screenY(y));
          }
        }
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
        ctx.stroke();
        ctx.restore();
      }

      function drawMarkers(showContinuousMinimum, showFp6Minimum) {
        drawCircle(START[0], START[1], 5.2, "rgba(255, 255, 255, 0.96)", colors.ink, 1.3);
        if (showContinuousMinimum) {
          drawStar(OPTIMUM[0], OPTIMUM[1], 9.0, colors.gold, colors.ink);
        }
        if (showFp6Minimum) {
          drawStar(FP6_MINIMUM.theta[0], FP6_MINIMUM.theta[1], 7.2, colors.white, colors.ink);
        }
      }

      function drawLattice(emphasis) {
        ctx.save();
        ctx.globalAlpha = 0.18 + 0.26 * emphasis;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = Math.max(0.35, 1.0 / (window.devicePixelRatio || 1));
        ctx.beginPath();
        for (const latticeX of latticeXValues) {
          const x = screenX(latticeX);
          ctx.moveTo(x, plot.top);
          ctx.lineTo(x, plot.top + plot.height);
        }
        for (const latticeY of latticeYValues) {
          const y = screenY(latticeY);
          ctx.moveTo(plot.left, y);
          ctx.lineTo(plot.left + plot.width, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      function interpolatedPoint(points, progress) {
        const step = clamp(Math.floor(progress), 0, points.length - 1);
        const nextStep = Math.min(step + 1, points.length - 1);
        const blend = clamp(progress - step, 0.0, 1.0);
        return [
          mix(points[step][0], points[nextStep][0], blend),
          mix(points[step][1], points[nextStep][1], blend)
        ];
      }

      function drawPath(points, maxStep, color, alpha, lineWidth) {
        const step = Math.min(Math.floor(maxStep), points.length - 1);
        if (step < 1) {
          return;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(screenX(points[0][0]), screenY(points[0][1]));
        for (let i = 1; i <= step; i += 1) {
          ctx.lineTo(screenX(points[i][0]), screenY(points[i][1]));
        }
        ctx.stroke();
        ctx.restore();
      }

      function drawContrastPath(points, maxStep, color, alpha, lineWidth, haloColor) {
        drawPath(points, maxStep, haloColor, 0.58, lineWidth + 2.6);
        drawPath(points, maxStep, color, alpha, lineWidth);
      }

      function drawComet(points, progress, color, options) {
        const tail = options.tail || 18;
        const lineWidth = options.lineWidth || 3;
        const trailColor = options.trailColor || color;
        const strokeColor = options.strokeColor || "rgba(255, 255, 255, 0.9)";
        const step = clamp(Math.floor(progress), 0, points.length - 1);
        const tailStart = Math.max(0, step - tail);

        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        for (let i = Math.max(1, tailStart + 1); i <= step; i += 1) {
          const alpha = 0.08 + 0.84 * ((i - tailStart) / Math.max(1, step - tailStart));
          ctx.strokeStyle = trailColor;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(screenX(points[i - 1][0]), screenY(points[i - 1][1]));
          ctx.lineTo(screenX(points[i][0]), screenY(points[i][1]));
          ctx.stroke();
        }

        const current = interpolatedPoint(points, progress);
        ctx.globalAlpha = 0.24;
        ctx.fillStyle = trailColor;
        ctx.beginPath();
        ctx.arc(screenX(current[0]), screenY(current[1]), 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = color;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(screenX(current[0]), screenY(current[1]), options.radius || 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      function logLoss(value) {
        return Math.log10(1.0 + value);
      }

      function drawLossLine(series, progress, box, color, alpha, lineWidth, yMin, yMax) {
        const stepLimit = Math.min(Math.floor(progress), series.length - 1);
        if (stepLimit < 1) {
          return;
        }
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i <= stepLimit; i += 1) {
          const x = box.x + (i / STEPS) * box.width;
          const y = box.y + box.height - ((logLoss(series[i]) - yMin) / (yMax - yMin)) * box.height;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      function drawContrastLossLine(series, progress, box, color, alpha, lineWidth, yMin, yMax, haloColor) {
        drawLossLine(series, progress, box, haloColor, 0.44, lineWidth + 2.2, yMin, yMax);
        drawLossLine(series, progress, box, color, alpha, lineWidth, yMin, yMax);
      }

      function drawLossInset(progress, mode) {
        const palette = curvePalette();
        const insetWidth = Math.min(220, plot.width * 0.34);
        const insetHeight = Math.min(68, plot.height * 0.20);
        const box = {
          x: plot.left + 14,
          y: plot.top + plot.height - insetHeight - 24,
          width: insetWidth,
          height: insetHeight
        };

        const values = [
          ...full.loss,
          ...fp6Rtn.loss,
          ...fp6Runs.flatMap((run) => run.loss)
        ].map(logLoss);
        const yMin = Math.min(...values);
        const yMax = Math.max(...values);

        ctx.save();
        ctx.fillStyle = "rgba(255, 254, 250, 0.74)";
        ctx.strokeStyle = "rgba(21, 22, 26, 0.16)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        roundedRectPath(box.x - 8, box.y - 22, box.width + 16, box.height + 31, 7);
        ctx.fill();
        ctx.stroke();

        ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = "rgba(21, 22, 26, 0.72)";
        ctx.fillText("log10(1 + f)", box.x, box.y - 8);
        ctx.strokeStyle = "rgba(21, 22, 26, 0.13)";
        for (let i = 0; i <= 2; i += 1) {
          const y = box.y + (i / 2) * box.height;
          ctx.beginPath();
          ctx.moveTo(box.x, y);
          ctx.lineTo(box.x + box.width, y);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(21, 22, 26, 0.18)";
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();

        if (mode === "sr") {
          for (const run of fp6TraceRuns) {
            drawLossLine(run.loss, progress, box, palette.srHalo, 0.18, 2.35, yMin, yMax);
            drawLossLine(run.loss, progress, box, palette.sr, 0.42, 1.25, yMin, yMax);
          }
          drawContrastLossLine(fp6Rtn.loss, progress, box, palette.rn, 0.92, 1.8, yMin, yMax, palette.rnHalo);
        } else if (mode === "rtn") {
          drawLossLine(full.loss, progress, box, palette.full, 0.55, 1.5, yMin, yMax);
          drawContrastLossLine(fp6Rtn.loss, progress, box, palette.rn, 1.0, 2.3, yMin, yMax, palette.rnHalo);
        } else {
          drawContrastLossLine(full.loss, progress, box, palette.rn, 1.0, 2.5, yMin, yMax, palette.rnHalo);
        }
      }

      function drawLatticeScene() {
        drawLattice(0.78);
      }

      function drawLegend(mode, panelRunMode = null, panelSingleSrRun = null) {
        const palette = curvePalette();
        const items = [];
        if (mode === "full") {
          items.push({ label: "FP32", color: palette.rn, marker: "dot" });
        } else if (mode === "fp6") {
          items.push({ label: "FP6 grid", color: "#000", marker: "dot" });
          if (panelRunMode === "sr") {
            const seed = panelSingleSrRun === null ? "?" : panelSingleSrRun.seed;
            items.push({ label: `SR seed ${seed}`, color: palette.sr, marker: "dot" });
          } else if (panelRunMode === "sr-ensemble") {
            items.push({ label: `${SR_TRACE_COUNT} SR runs`, color: palette.sr, marker: "dot" });
          } else if (panelRunMode === "rn") {
            items.push({ label: "FP6 RTNE", color: palette.rn, marker: "dot" });
          }
        } else if (mode === "rtn") {
          items.push({ label: "FP6 RTNE", color: palette.rn, marker: "dot" });
          items.push({ label: "FP32", color: palette.full, marker: "dot" });
        } else {
          items.push({ label: `${SR_TRACE_COUNT} SR runs`, color: palette.sr, marker: "dot" });
          items.push({ label: "FP6 RTNE", color: palette.rn, marker: "dot" });
        }
        if (mode === "full") {
          items.push({ label: "FP32 min", color: colors.gold, marker: "star" });
        } else {
          items.push({ label: "FP6 lattice min", color: colors.white, marker: "star" });
        }

        ctx.save();
        ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
        const x = plot.left + plot.width - 138;
        let y = plot.top + 17;
        for (const item of items) {
          ctx.fillStyle = "rgba(255, 254, 250, 0.88)";
          ctx.strokeStyle = "rgba(15, 18, 24, 0.18)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          roundedRectPath(x - 10, y - 13, 130, 23, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = item.color;
          if (item.marker === "star") {
            starPathAt(x, y - 1, 5.8);
          } else {
            ctx.beginPath();
            ctx.arc(x, y - 1, 4, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.strokeStyle = "rgba(15, 18, 24, 0.45)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.fillStyle = colors.ink;
          ctx.fillText(item.label, x + 10, y + 3);
          y += 27;
        }
        ctx.restore();
      }

      function queueDraw() {
        if (animationFrame !== null) {
          throw new Error("animation frame already queued");
        }
        animationFrame = requestAnimationFrame(drawFrame);
      }

      function requestDraw() {
        if (animationFrame !== null) {
          return;
        }
        queueDraw();
      }

      function resetFp6Run(resetSeed) {
        fp6RunStarted = false;
        fp6RunStartedAt = 0;
        fp6RunMode = null;
        singleSrRun = null;
        if (resetSeed) {
          nextSingleSrSeed = 1;
        }
      }

      function resetFp6SrRun(resetSeed) {
        fp6SrRunStarted = false;
        fp6SrRunStartedAt = 0;
        fp6SrRunMode = null;
        singleSrPanelRun = null;
        if (resetSeed) {
          nextSingleSrPanelSeed = 1;
        }
      }

      function startFp6Run(mode) {
        if (mode === "sr") {
          const seed = nextSingleSrSeed;
          singleSrRun = { seed, ...runAdam("sr", seed, fp6Settings) };
          nextSingleSrSeed += 1;
        } else {
          singleSrRun = null;
        }
        fp6RunStarted = true;
        fp6RunStartedAt = performance.now();
        fp6RunMode = mode;
        requestDraw();
      }

      function startFp6SrRun(mode) {
        if (mode === "sr") {
          const seed = nextSingleSrPanelSeed;
          singleSrPanelRun = { seed, ...runAdam("sr", seed, fp6SrSettings) };
          nextSingleSrPanelSeed += 1;
        } else {
          singleSrPanelRun = null;
        }
        fp6SrRunStarted = true;
        fp6SrRunStartedAt = performance.now();
        fp6SrRunMode = mode;
        requestDraw();
      }

      function startFullRun() {
        fullRunStarted = true;
        fullRunStartedAt = performance.now();
        requestDraw();
      }

      function fullProgress(now) {
        if (!fullRunStarted) {
          return STEPS;
        }
        return clamp(((now - fullRunStartedAt) / FP6_ANIMATION_MS) * STEPS, 0, STEPS);
      }

      function fp6Progress(now) {
        if (!fp6RunStarted) {
          return 0;
        }
        return clamp(((now - fp6RunStartedAt) / FP6_ANIMATION_MS) * STEPS, 0, STEPS);
      }

      function fp6SrProgress(now) {
        if (!fp6SrRunStarted) {
          return 0;
        }
        return clamp(((now - fp6SrRunStartedAt) / FP6_ANIMATION_MS) * STEPS, 0, STEPS);
      }

      function drawFullFigure(progress) {
        setRenderTarget(fullCanvas, fullCtx);
        const palette = curvePalette();
        drawBackground();
        drawAxes();
        drawContrastPath(full.trajectory, progress, palette.rn, 0.96, 2.2, palette.rnHalo);
        if (progress < STEPS) {
          drawComet(full.trajectory, progress, palette.rn, {
            tail: 22,
            lineWidth: 3.2,
            radius: 5.8,
            trailColor: palette.rn,
            strokeColor: palette.rnHalo
          });
        }
        drawLossInset(progress, "full");
        drawMarkers(true, false);
        drawLegend("full");
        const step = clamp(Math.floor(progress), 0, STEPS);
        fullStat.textContent = `f=${full.loss[step].toFixed(4)}`;
      }

      function drawFp6LossInset(progress, runMode, singleRun, rtnRun, panelRuns, panelTraceRuns) {
        const palette = curvePalette();
        const insetWidth = Math.min(220, plot.width * 0.34);
        const insetHeight = Math.min(68, plot.height * 0.20);
        const box = {
          x: plot.left + 14,
          y: plot.top + plot.height - insetHeight - 24,
          width: insetWidth,
          height: insetHeight
        };
        const srLossRuns = runMode === "sr" && singleRun !== null ? [singleRun] : panelRuns;
        const values = [
          ...rtnRun.loss,
          ...srLossRuns.flatMap((run) => run.loss)
        ].map(logLoss);
        const yMin = Math.min(...values);
        const yMax = Math.max(...values);

        ctx.save();
        ctx.fillStyle = "rgba(255, 254, 250, 0.74)";
        ctx.strokeStyle = "rgba(21, 22, 26, 0.16)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        roundedRectPath(box.x - 8, box.y - 22, box.width + 16, box.height + 31, 7);
        ctx.fill();
        ctx.stroke();
        ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = "rgba(21, 22, 26, 0.72)";
        ctx.fillText("log10(1 + f)", box.x, box.y - 8);
        ctx.strokeStyle = "rgba(21, 22, 26, 0.13)";
        for (let i = 0; i <= 2; i += 1) {
          const y = box.y + (i / 2) * box.height;
          ctx.beginPath();
          ctx.moveTo(box.x, y);
          ctx.lineTo(box.x + box.width, y);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(21, 22, 26, 0.18)";
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();

        if (runMode === "sr") {
          if (singleRun === null) {
            throw new Error("single SR run is missing");
          }
          const run = singleRun;
          drawLossLine(run.loss, progress, box, palette.srHalo, 0.18, 2.35, yMin, yMax);
          drawLossLine(run.loss, progress, box, palette.sr, 0.72, 1.7, yMin, yMax);
        } else if (runMode === "sr-ensemble") {
          for (const run of panelTraceRuns) {
            drawLossLine(run.loss, progress, box, palette.srHalo, 0.18, 2.35, yMin, yMax);
            drawLossLine(run.loss, progress, box, palette.sr, 0.42, 1.25, yMin, yMax);
          }
        }
        if (runMode === "rn") {
          drawContrastLossLine(rtnRun.loss, progress, box, palette.rn, 0.92, 1.8, yMin, yMax, palette.rnHalo);
        }
      }

      function drawFp6FigureOn(targetCanvas, targetCtx, statElement, runStarted, runMode, progress, singleRun, rtnRun, panelRuns, panelTraceRuns) {
        setRenderTarget(targetCanvas, targetCtx);
        const palette = curvePalette();
        drawBackground();
        drawAxes();
        drawLatticeScene();
        if (runStarted && (runMode === "sr" || runMode === "sr-ensemble")) {
          if (runMode === "sr" && singleRun === null) {
            throw new Error("single SR run is missing");
          }
          const visibleSrRuns = runMode === "sr" ? [singleRun] : panelTraceRuns;
          for (const run of visibleSrRuns) {
            drawPath(run.trajectory, progress, palette.srHalo, 0.32, runMode === "sr" ? 3.6 : 3.0);
          }
          for (const run of visibleSrRuns) {
            drawPath(run.trajectory, progress, palette.sr, runMode === "sr" ? 0.82 : 0.52, runMode === "sr" ? 2.3 : 1.8);
          }
          ctx.save();
          ctx.fillStyle = palette.sr;
          ctx.strokeStyle = palette.srHalo;
          ctx.globalAlpha = 0.78;
          ctx.lineWidth = 1.2;
          for (const run of visibleSrRuns) {
            const current = interpolatedPoint(run.trajectory, progress);
            ctx.beginPath();
            ctx.arc(screenX(current[0]), screenY(current[1]), 3.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        }
        if (runStarted && runMode === "rn") {
          drawContrastPath(rtnRun.trajectory, progress, palette.rn, 0.96, 2.2, palette.rnHalo);
          drawComet(rtnRun.trajectory, progress, palette.rn, {
            tail: 22,
            lineWidth: 3.2,
            radius: 5.8,
            trailColor: palette.rn,
            strokeColor: palette.rnHalo
          });
        }
        if (runStarted && runMode !== null) {
          drawFp6LossInset(progress, runMode, singleRun, rtnRun, panelRuns, panelTraceRuns);
        }
        drawMarkers(false, true);
        drawLegend("fp6", runMode, singleRun);
        if (!runStarted) {
          statElement.textContent = `${FP6.length} values per axis   ready`;
        } else {
          const step = clamp(Math.floor(progress), 0, STEPS);
          const label = runMode === "rn" ? "RTNE" : runMode === "sr" ? `SR seed ${singleRun.seed}` : "SR ensemble";
          statElement.textContent = `${label}   step ${step} / ${STEPS}`;
        }
      }

      function drawFrame(now) {
        animationFrame = null;
        try {
          const fullStepProgress = fullProgress(now);
          drawFullFigure(fullStepProgress);
          const fp6StepProgress = fp6Progress(now);
          drawFp6FigureOn(
            fp6Canvas,
            fp6Ctx,
            fp6Stat,
            fp6RunStarted,
            fp6RunMode,
            fp6StepProgress,
            singleSrRun,
            fp6Rtn,
            fp6Runs,
            fp6TraceRuns
          );
          let fp6SrStepProgress = 0;
          if (fp6SrCanvas !== null && fp6SrCtx !== null && fp6SrStat !== null) {
            fp6SrStepProgress = fp6SrProgress(now);
            drawFp6FigureOn(
              fp6SrCanvas,
              fp6SrCtx,
              fp6SrStat,
              fp6SrRunStarted,
              fp6SrRunMode,
              fp6SrStepProgress,
              singleSrPanelRun,
              fp6SrRtn,
              fp6SrRuns,
              fp6SrTraceRuns
            );
          }
          if (
            (fullRunStarted && fullStepProgress < STEPS)
            || (fp6RunStarted && fp6StepProgress < STEPS)
            || (fp6SrRunStarted && fp6SrStepProgress < STEPS)
          ) {
            queueDraw();
          }
        } catch (error) {
          drawError(error);
          throw error;
        }
      }

      try {
      document.querySelectorAll(".sr-rounding-demo").forEach((root, index) => {
        initializeScalarRoundingPlot(root, index);
      });
        if (!initializeRosenbrockElements()) {
          startAutoReload();
          return;
        }

        fullLrSlider.addEventListener("input", updateFullControls);
        fullBeta1Slider.addEventListener("input", updateFullControls);
        fullBeta2Slider.addEventListener("input", updateFullControls);
        lrSlider.addEventListener("input", updateFp6Controls);
        beta1Slider.addEventListener("input", updateFp6Controls);
        beta2Slider.addEventListener("input", updateFp6Controls);
        if (srLrSlider !== null) {
          srLrSlider.addEventListener("input", updateFp6SrControls);
        }
        if (srBeta1Slider !== null) {
          srBeta1Slider.addEventListener("input", updateFp6SrControls);
        }
        if (srBeta2Slider !== null) {
          srBeta2Slider.addEventListener("input", updateFp6SrControls);
        }
        runFull.addEventListener("click", () => {
          startFullRun();
        });
        runRn.addEventListener("click", () => {
          startFp6Run("rn");
        });
        if (runSrRn !== null) {
          runSrRn.addEventListener("click", () => {
            startFp6SrRun("rn");
          });
        }
        if (runSr !== null) {
          runSr.addEventListener("click", () => {
            startFp6SrRun("sr");
          });
        }
        if (runSrEnsemble !== null) {
          runSrEnsemble.addEventListener("click", () => {
            startFp6SrRun("sr-ensemble");
          });
        }
        if (colormapSelect !== null) {
          colormapSelect.addEventListener("change", applyColormapValue);
        }

        syncAllControlGroups();
        recomputeFullTrajectory();
        recomputeFp6Trajectories();
        recomputeFp6SrTrajectories();
        window.addEventListener("resize", () => {
          requestDraw();
        });
        queueDraw();
        startAutoReload();

        console.log({
          scale: SCALE,
          fullLr: fullSettings.lr,
          fullBeta1: fullSettings.beta1,
          fullBeta2: fullSettings.beta2,
          fp6Lr: fp6Settings.lr,
          fp6Beta1: fp6Settings.beta1,
          fp6Beta2: fp6Settings.beta2,
          fp6SrLr: fp6SrSettings.lr,
          fp6SrBeta1: fp6SrSettings.beta1,
          fp6SrBeta2: fp6SrSettings.beta2,
          start: START,
          optimum: OPTIMUM,
          fp6Minimum: FP6_MINIMUM,
          fp6Values: FP6.length,
          fullFinal: full.trajectory[STEPS],
          fullFinalLoss: full.loss[STEPS],
          rnFinal: fp6Rtn.trajectory[STEPS],
          rnBestLoss: fp6RtnBestLoss,
          srMedianFinal: fp6MedianFinal,
          srMedianBest: fp6MedianBest,
          srRunsBeatingRn: `${fp6SrBetterCount}/${fp6Runs.length}`
        });
      } catch (error) {
        reportStartupError(error);
        throw error;
      }
    })();
