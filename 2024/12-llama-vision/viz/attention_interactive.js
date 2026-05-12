// Copyright (c) 2024 Graphcore Ltd. All rights reserved.

const S = {
    nTiles: 4,
    nPatch: 40,
    patchSize: 14
}

async function attnLoadImage(src) {
    return new Promise((resolve) => {
        const img = new Image()
        img.addEventListener("load", () => {
            resolve(img)
        })
        img.src = src
    })
}

function attnDraw(ctx, img, attn, offset, boost) {
    ctx.globalAlpha = 1.0
    ctx.drawImage(img, 0, 0)
    ctx.fillStyle = "#000000"
    for (let ky = 0; ky < S.nPatch; ++ky) {
        for (let kx = 0; kx < S.nPatch; ++kx) {
            const a = attn[offset + ky * S.nPatch + kx]
            const div = Math.log((boost || 1) * S.nTiles * S.nPatch * S.nPatch)
            ctx.globalAlpha = Math.min(1, -Math.log(a) / div)
            ctx.fillRect(kx * S.patchSize, ky * S.patchSize, S.patchSize, S.patchSize)
        }
    }
}

// Self attention

function attnSelfAttnDraw(ctx, img, attn, q) {
    const offset = q[1] * S.nPatch ** 3 + q[0] * S.nPatch ** 2
    attnDraw(ctx, img, attn, offset)
    ctx.globalAlpha = 1.0
    ctx.strokeStyle = "#ff0000"
    ctx.strokeRect(q[0] * S.patchSize, q[1] * S.patchSize, S.patchSize, S.patchSize)
}

async function attnSelfAttnInit() {
    const img = await attnLoadImage("/2024/12-llama-vision/viz/attention_tile.png")
    const attnResponse = await fetch("/2024/12-llama-vision/viz/attention.bin")
    const attn = new Float32Array(await attnResponse.arrayBuffer())

    const canvas = document.getElementById("attention-interactive")
    const ctx = canvas.getContext("2d")
    canvas.width = img.width
    canvas.height = img.height

    const qDefault = [16, 20]
    let q = qDefault
    attnSelfAttnDraw(ctx, img, attn, q)
    canvas.addEventListener("mousemove", (e) => {
        const bounds = e.target.getBoundingClientRect()
        let px = Math.floor((e.clientX - bounds.left) / bounds.width * S.nPatch)
        let py = Math.floor((e.clientY - bounds.top) / bounds.height * S.nPatch)
        if (px !== q[0] || py !== q[1]) {
            q = [px, py]
            attnSelfAttnDraw(ctx, img, attn, q)
        }
    })
    canvas.addEventListener("mouseout", (e) => {
        q = qDefault
        attnSelfAttnDraw(ctx, img, attn, q)
    })
}
window.addEventListener("load", attnSelfAttnInit)

// Cross attention

function attnCrossAttnDraw(ctx, divTokens, img, attn, idx) {
    attnDraw(ctx, img, attn, idx * S.nPatch * S.nPatch, /*boost*/4)
    Array.from(divTokens.children).forEach((e, i) => {
        if (i === idx) {
            e.style = "background-color: #f88;"
        } else {
            e.style = ""
        }
    })
}

async function attnCrossAttnInit() {
    const img = await attnLoadImage("/2024/12-llama-vision/viz/attention_tile.png")
    const attnResponse = await fetch("/2024/12-llama-vision/viz/cross_attention.bin")
    const attn = new Float32Array(await attnResponse.arrayBuffer())
    const attnJsonReponse = await fetch("/posts/2024/12-llama-vision/viz/cross_attention.json")
    const attnJson = await attnJsonReponse.json()
    // console.log("layer", attnJson["layer"])

    const divTokens = document.getElementById("cross-attention-tokens")
    const canvas = document.getElementById("cross-attention-interactive")
    const ctx = canvas.getContext("2d")
    canvas.width = img.width
    canvas.height = img.height

    let attnIdx = 0
    attnJson["tokens"].forEach((token, idx) => {
        const span = document.createElement("span")
        span.innerText = token
        divTokens.appendChild(span)
        span.addEventListener("mousemove", (e) => {
            if (attnIdx !== idx) {
                attnIdx = idx
                attnCrossAttnDraw(ctx, divTokens, img, attn, attnIdx)
            }
        })
    })
    attnCrossAttnDraw(ctx, divTokens, img, attn, attnIdx)
}
window.addEventListener("load", attnCrossAttnInit)
