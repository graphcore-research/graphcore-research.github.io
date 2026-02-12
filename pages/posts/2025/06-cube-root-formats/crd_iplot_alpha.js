// Data

const DATA = [{ "alpha": 0.0833, "mse": 0.0853, "centroids": [-4.228, -2.649, -1.492, -0.484, 0.484, 1.492, 2.649, 4.228], "density": [0.0, 0.019, 0.142, 0.338, 0.338, 0.143, 0.019, 0.0] }, { "alpha": 0.125, "mse": 0.06, "centroids": [-3.452, -2.163, -1.218, -0.395, 0.395, 1.218, 2.163, 3.452], "density": [0.002, 0.043, 0.164, 0.29, 0.29, 0.165, 0.043, 0.002] }, { "alpha": 0.1667, "mse": 0.0476, "centroids": [-2.99, -1.873, -1.055, -0.342, 0.342, 1.055, 1.873, 2.99], "density": [0.008, 0.064, 0.171, 0.258, 0.257, 0.171, 0.064, 0.008] }, { "alpha": 0.2083, "mse": 0.0407, "centroids": [-2.674, -1.675, -0.944, -0.306, 0.306, 0.944, 1.675, 2.674], "density": [0.015, 0.08, 0.171, 0.234, 0.234, 0.171, 0.08, 0.015] }, { "alpha": 0.25, "mse": 0.0368, "centroids": [-2.441, -1.529, -0.861, -0.279, 0.279, 0.861, 1.529, 2.441], "density": [0.024, 0.093, 0.168, 0.216, 0.216, 0.168, 0.092, 0.024] }, { "alpha": 0.2917, "mse": 0.0349, "centroids": [-2.26, -1.416, -0.798, -0.259, 0.259, 0.798, 1.416, 2.26], "density": [0.033, 0.101, 0.165, 0.201, 0.201, 0.164, 0.101, 0.033] }, { "alpha": 0.3333, "mse": 0.0346, "centroids": [-2.114, -1.325, -0.746, -0.242, 0.242, 0.746, 1.325, 2.114], "density": [0.043, 0.107, 0.16, 0.189, 0.189, 0.16, 0.108, 0.043] }, { "alpha": 0.375, "mse": 0.0355, "centroids": [-1.993, -1.249, -0.703, -0.228, 0.228, 0.703, 1.249, 1.993], "density": [0.053, 0.112, 0.156, 0.179, 0.179, 0.156, 0.112, 0.053] }, { "alpha": 0.4167, "mse": 0.0373, "centroids": [-1.891, -1.185, -0.667, -0.216, 0.216, 0.667, 1.185, 1.891], "density": [0.062, 0.115, 0.152, 0.171, 0.17, 0.152, 0.115, 0.062] }, { "alpha": 0.4583, "mse": 0.0399, "centroids": [-1.803, -1.13, -0.636, -0.206, 0.206, 0.636, 1.13, 1.803], "density": [0.071, 0.117, 0.148, 0.163, 0.163, 0.148, 0.117, 0.071] }, { "alpha": 0.5, "mse": 0.043, "centroids": [-1.726, -1.081, -0.609, -0.198, 0.198, 0.609, 1.081, 1.726], "density": [0.08, 0.119, 0.144, 0.157, 0.156, 0.144, 0.119, 0.08] }, { "alpha": 0.5417, "mse": 0.0467, "centroids": [-1.659, -1.039, -0.585, -0.19, 0.19, 0.585, 1.039, 1.659], "density": [0.089, 0.12, 0.141, 0.151, 0.151, 0.141, 0.12, 0.089] }, { "alpha": 0.5833, "mse": 0.0507, "centroids": [-1.598, -1.001, -0.564, -0.183, 0.183, 0.564, 1.001, 1.598], "density": [0.097, 0.12, 0.137, 0.146, 0.145, 0.137, 0.12, 0.097] }, { "alpha": 0.625, "mse": 0.055, "centroids": [-1.544, -0.967, -0.545, -0.177, 0.177, 0.545, 0.967, 1.544], "density": [0.105, 0.12, 0.134, 0.141, 0.141, 0.134, 0.12, 0.105] }, { "alpha": 0.6667, "mse": 0.0596, "centroids": [-1.495, -0.937, -0.528, -0.171, 0.171, 0.528, 0.937, 1.495], "density": [0.112, 0.12, 0.131, 0.137, 0.136, 0.131, 0.12, 0.112] }, { "alpha": 0.7083, "mse": 0.0643, "centroids": [-1.45, -0.909, -0.512, -0.166, 0.166, 0.512, 0.909, 1.45], "density": [0.119, 0.12, 0.128, 0.133, 0.132, 0.129, 0.12, 0.119] }, { "alpha": 0.75, "mse": 0.0691, "centroids": [-1.409, -0.883, -0.497, -0.161, 0.161, 0.497, 0.883, 1.409], "density": [0.126, 0.119, 0.126, 0.129, 0.129, 0.126, 0.119, 0.126] }, { "alpha": 0.7917, "mse": 0.0741, "centroids": [-1.372, -0.859, -0.484, -0.157, 0.157, 0.484, 0.859, 1.372], "density": [0.132, 0.119, 0.123, 0.126, 0.126, 0.123, 0.119, 0.132] }, { "alpha": 0.8333, "mse": 0.0791, "centroids": [-1.337, -0.838, -0.472, -0.153, 0.153, 0.472, 0.838, 1.337], "density": [0.139, 0.118, 0.121, 0.123, 0.123, 0.121, 0.118, 0.139] }, { "alpha": 0.875, "mse": 0.0841, "centroids": [-1.305, -0.818, -0.46, -0.149, 0.149, 0.46, 0.818, 1.305], "density": [0.144, 0.117, 0.119, 0.12, 0.12, 0.119, 0.117, 0.144] }, { "alpha": 0.9167, "mse": 0.0892, "centroids": [-1.275, -0.799, -0.45, -0.146, 0.146, 0.45, 0.799, 1.275], "density": [0.15, 0.116, 0.116, 0.117, 0.117, 0.116, 0.116, 0.15] }, { "alpha": 0.9583, "mse": 0.0943, "centroids": [-1.247, -0.781, -0.44, -0.143, 0.143, 0.44, 0.781, 1.247], "density": [0.155, 0.116, 0.114, 0.115, 0.115, 0.114, 0.115, 0.155] }, { "alpha": 1.0, "mse": 0.0994, "centroids": [-1.221, -0.765, -0.431, -0.14, 0.14, 0.431, 0.765, 1.221], "density": [0.161, 0.115, 0.112, 0.112, 0.112, 0.113, 0.115, 0.161] }, { "alpha": 1.0417, "mse": 0.1044, "centroids": [-1.196, -0.749, -0.422, -0.137, 0.137, 0.422, 0.749, 1.196], "density": [0.165, 0.114, 0.111, 0.11, 0.11, 0.111, 0.114, 0.166] }, { "alpha": 1.0833, "mse": 0.1094, "centroids": [-1.173, -0.735, -0.414, -0.134, 0.134, 0.414, 0.735, 1.173], "density": [0.17, 0.113, 0.109, 0.108, 0.108, 0.109, 0.113, 0.17] }, { "alpha": 1.125, "mse": 0.1144, "centroids": [-1.151, -0.721, -0.406, -0.132, 0.132, 0.406, 0.721, 1.151], "density": [0.175, 0.112, 0.107, 0.106, 0.106, 0.107, 0.112, 0.175] }, { "alpha": 1.1667, "mse": 0.1194, "centroids": [-1.13, -0.708, -0.399, -0.129, 0.129, 0.399, 0.708, 1.13], "density": [0.179, 0.111, 0.106, 0.104, 0.104, 0.106, 0.111, 0.179] }, { "alpha": 1.2083, "mse": 0.1243, "centroids": [-1.11, -0.696, -0.392, -0.127, 0.127, 0.392, 0.696, 1.11], "density": [0.183, 0.11, 0.104, 0.103, 0.102, 0.104, 0.11, 0.183] }, { "alpha": 1.25, "mse": 0.1291, "centroids": [-1.092, -0.684, -0.385, -0.125, 0.125, 0.385, 0.684, 1.092], "density": [0.187, 0.109, 0.103, 0.101, 0.101, 0.103, 0.109, 0.187] }, { "alpha": 1.2917, "mse": 0.1339, "centroids": [-1.074, -0.673, -0.379, -0.123, 0.123, 0.379, 0.673, 1.074], "density": [0.191, 0.108, 0.101, 0.099, 0.099, 0.101, 0.108, 0.191] }, { "alpha": 1.3333, "mse": 0.1386, "centroids": [-1.057, -0.662, -0.373, -0.121, 0.121, 0.373, 0.662, 1.057], "density": [0.195, 0.107, 0.1, 0.098, 0.097, 0.1, 0.107, 0.195] }];

function findAlphaEntry(alpha) {
    let minDistance = Infinity;
    let closest = null;
    for (const d of DATA) {
        const distance = Math.abs(d.alpha - alpha);
        if (distance < minDistance) {
            minDistance = distance;
            closest = d;
        }
    }
    return closest;
}

// Draw

const MAX_DENSITY = 0.4;
const MAX_CENTROID = 2.5;
const ALPHA_LIM = [0, 1.4];
const ERROR_LIM = [0.03, 0.15];

class Element {
    constructor(element) {
        this.element = element;
    }
    getf(attribute) {
        return parseFloat(this.element.getAttribute(attribute));
    }
    set(attribute, value) {
        this.element.setAttribute(attribute, value);
    }
}

class Svg {
    constructor(container, width, height) {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.classList.add("crd-svg");
        this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        container.appendChild(this.svg);
        this.width = width;
        this.height = height;
    }

    rect(x, y, width, height, fill) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        e.setAttribute("x", x);
        e.setAttribute("y", y);
        e.setAttribute("width", width);
        e.setAttribute("height", height);
        e.setAttribute("fill", fill);
        this.svg.appendChild(e);
        return new Element(e);
    }

    circle(x, y, radius, fill) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        e.setAttribute("cx", x);
        e.setAttribute("cy", y);
        e.setAttribute("r", radius);
        e.setAttribute("fill", fill);
        this.svg.appendChild(e);
        return new Element(e);
    }

    line(x0, y0, x1, y1, width, color) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", "line");
        e.setAttribute("x1", x0);
        e.setAttribute("y1", y0);
        e.setAttribute("x2", x1);
        e.setAttribute("y2", y1);
        e.setAttribute("stroke-width", width);
        e.setAttribute("stroke", color);
        this.svg.appendChild(e);
        return new Element(e);
    }

    text(x, y, size, angle, color, text) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", "text");
        e.setAttribute("x", x);
        e.setAttribute("y", y);
        e.setAttribute("font-size", size);
        e.setAttribute("text-anchor", "middle");
        e.setAttribute("fill", color);
        if (angle) {
            e.setAttribute("transform", `rotate(${angle}, ${x}, ${y})`);
        }
        e.innerHTML = text;
        this.svg.appendChild(e);
        return new Element(e);
    }
}

function crdCreatePlot(root) {
    const slider = root.querySelector(".crd-alpha");

    const plotX = 16;
    // const plotW = 128 - plotX;
    const plotH = 118;

    const barPlot = new Svg(root.querySelector(".crd-freq"), 128, 128);
    barPlot.line(plotX, plotH, 128, plotH, 1, "#000000");
    barPlot.text(68, 127, 8, 0, "#000000", "Quantisation Bins");
    barPlot.line(plotX, plotH, plotX, 0, 1, "#000000");
    barPlot.text(10, 64, 8, -90, "#000000", "Count");
    const s = (128 - plotX) / 8;
    const bars = Array.from({ length: 8 }, (_, i) =>
        barPlot.rect(plotX + 0.5 + i * s, 0, s * 0.8, 0, "#1b9e77"));

    const errorPlot = new Svg(root.querySelector(".crd-error"), 128, 128);
    errorPlot.line(plotX, plotH, 128, plotH, 1, "#000000");
    errorPlot.text(68, 127, 8, 0, "#000000", "alpha").set("font-family", "monospace");
    errorPlot.line(plotX, plotH, plotX, 0, 1, "#000000");
    errorPlot.text(10, 64, 8, -90, "#000000", "MSE");

    const errors = DATA.map((d) => {
        const c = errorPlot.circle(
            plotX + (d.alpha - ALPHA_LIM[0]) / (ALPHA_LIM[1] - ALPHA_LIM[0]) * (128 - plotX),
            plotH - (d.mse - ERROR_LIM[0]) / (ERROR_LIM[1] - ERROR_LIM[0]) * plotH,
            2, "#888888"
        );
        c.element.dataset.alpha = d.alpha;
        return c;
    });
    const errorText = errorPlot.text(0, 0, 7, 0, "#1b9e77", "");
    errorText.set("font-weight", "bold");

    const centroidsPlot = new Svg(root.querySelector(".crd-centroids"), 128, 8);
    // centroidsPlot.rect(0, 0, 128, 16, "#f2f2f2");
    centroidsPlot.line(0, 5.5, 128, 5.5, 1/4, "#000000");
    centroidsPlot.line(64, 3, 64, 8, 1/4, "#000000");
    centroidsPlot.text(7.5, 3, 3.5, 0, "#000000", "Centroids");
    const centroids = Array.from({ length: 8 }, () => centroidsPlot.circle(0, 5.5, 1.5, "#1b9e77"));

    function draw() {
        const data = findAlphaEntry(parseFloat(slider.value));
        data.density.forEach((d, i) => {
            const h = (plotH - 0.5) * d / MAX_DENSITY;
            bars[i].set("height", h);
            bars[i].set("y", plotH - 0.5 - h);
        });
        data.centroids.forEach((c, i) => {
            const x = (0.5 * c / MAX_CENTROID + 0.5) * centroidsPlot.width;
            centroids[i].set("cx", x);
        });
        errors.forEach((e) => {
            if (e.element.dataset.alpha == data.alpha) {
                e.set("fill", "#1b9e77");
                e.set("fill-opacity", "1.0");
                e.set("r", "3");
                errorText.set("x", e.getf("cx"));
                errorText.set("y", e.getf("cy") - 8);
                errorText.element.textContent = data.mse.toFixed(4);
            } else {
                e.set("fill", "#000000");
                e.set("fill-opacity", "0.25");
                e.set("r", "2");
            }
        });
    }

    draw();
    slider.addEventListener("input", draw);
}

// Document

const CSS = `
#crd-iplot-alpha {
    width: 32em;
    padding: 1em 1em 0.5em 1em;
    border: 0.5px solid #888;
    margin-bottom: 2em;
}
.crd-svg {
    width: 100%;
}
.crd-row {
    display: flex;
}
.crd-row>* {
    flex: 1;
    margin-right: 1em;
}
.crd-centroids {
    margin-top: 1em;
}
.crd-alpha {
    margin-top: 1em;
}
.crd-alpha-ticklabels {
    display: flex;
    justify-content: space-between;
    font-size: small;
}
.crd-alpha-label {
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-family: monospace;
}
`;

const HTML = `
<div class="crd-row">
    <div class="crd-freq"></div>
    <div class="crd-error"></div>
</div>
<div class="crd-centroids"></div>

<div style="position: relative; width: 100%">
    <input type="range" class="crd-alpha" min="0" max="1.333" value="0.333" step="any"
    list="crd-alpha-markers"
    style="width: 100%" />
    <div class="crd-alpha-ticklabels">
    <span>&nbsp;&nbsp;0</span><span>1/3</span><span>2/3</span><span>1</span><span>4/3</span>
    </div>
    <div class="crd-alpha-label">alpha</div>
</div>
<datalist id="crd-alpha-markers">
    <option value="0"></option>
    <option value="0.333"></option>
    <option value="0.667"></option>
    <option value="1"></option>
    <option value="1.333"></option>
</datalist>
`

window.addEventListener("load", () => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const plot = document.getElementById("crd-iplot-alpha");
    plot.innerHTML = HTML;
    crdCreatePlot(plot);
});
