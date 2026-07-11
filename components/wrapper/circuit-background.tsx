"use client"

import { useEffect, useRef } from "react"

// Frozen circuit-fractal shapes (derived from Shadertoy 3lyBWz) revealed by a
// noise-driven pulsing glow (derived from Shadertoy ttVfzR). Neither the UV
// nor the pattern is translated over time, so only the glow moves — no
// scrolling/drifting. The glow field also masks the pattern's visibility, so
// the board only surfaces where the pulse currently sits.
const VERT_SRC = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG_SRC = `
  #extension GL_OES_standard_derivatives : enable
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 uSeed;

  vec3 c1 = vec3(2.0, 2.5, 1.4);

  vec2 triangle_wave(vec2 a, float scale) {
    return abs(fract((a + c1.xy + uSeed) * scale) - 0.5);
  }

  float Hash31(in vec3 p) {
    vec3 p3 = fract(p * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }

  float snoise(in vec3 p) {
    vec3 c = floor(p);
    vec3 l = fract(p);
    l *= l * (3.0 - 2.0 * l);
    float ldb = Hash31(c);
    float rdb = Hash31(c + vec3(1.0, 0.0, 0.0));
    float lub = Hash31(c + vec3(0.0, 1.0, 0.0));
    float rub = Hash31(c + vec3(1.0, 1.0, 0.0));
    float ldf = Hash31(c + vec3(0.0, 0.0, 1.0));
    float rdf = Hash31(c + vec3(1.0, 0.0, 1.0));
    float luf = Hash31(c + vec3(0.0, 1.0, 1.0));
    float ruf = Hash31(c + 1.0);
    return mix(mix(mix(ldb, rdb, l.x), mix(lub, rub, l.x), l.y),
               mix(mix(ldf, rdf, l.x), mix(luf, ruf, l.x), l.y), l.z);
  }

  float hnoise(in vec3 p, in float scale) {
    p *= scale;
    float value = 0.0;
    float nscale = 1.0;
    float tscale = 0.0;
    for (int o = 0; o < 5; o++) {
      p.xz *= mat2(-0.48406725864, -0.87503079323, 0.87503079323, -0.48406725864);
      p.yz *= mat2(0.15022546991, -0.98865176285, 0.98865176285, 0.15022546991);
      value += abs(snoise(p) * 2.0 - 1.0) * nscale;
      tscale += nscale;
      nscale *= 0.25;
      p *= 2.0;
    }
    return value / tscale;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    // Tuned constants (locked in from the approved demo).
    float uSpeed = 0.1;
    float uDepth = 2.9;
    float uZoom = 2.2;
    float uGlowScale = 15.3;
    float uGlowContrast = 5.75;
    float uBgMask = 5.5;

    // Static camera: uv is NOT translated by iTime, so the fractal never drifts.
    vec2 uvBase = (fragCoord - iResolution.xy) / iResolution.y / uZoom / 2.0;

    vec3 col = vec3(0.0);
    vec2 uv = uvBase;
    float offset = 0.16;
    float scale2 = 1.05;

    for (int c = 0; c < 3; c++) {
      float scale = c1.z;
      for (int i = 0; i < 9; i++) {
        uv = triangle_wave(uv + offset, scale) + triangle_wave(uv.yx, scale);
        uv = triangle_wave(uv + col.xy, scale);
        scale /= scale2 + col.x;
        offset *= scale2;
        uv.y /= -1.0;
      }
      col[c] = fract(uv.x - uv.y);
    }

    // Breathing brightness field: 3D noise walked along iTime. It only
    // modulates intensity, never the shapes' position.
    float breathe = pow(1.0 - hnoise(vec3(uvBase * uGlowScale, iTime * uSpeed), 1.0), uDepth) * 2.2;

    float m = clamp(col.g + col.b * 0.4, 0.0, 1.0);
    float mask = pow(m, uGlowContrast);

    vec3 acid = vec3(0.22, 0.62, 0.4);

    // The glow field doubles as a visibility mask for the whole board: the
    // pattern only surfaces where the pulse is currently bright.
    float glowMask = pow(clamp(breathe / 2.2, 0.0, 1.0), uBgMask);

    vec3 finalColor = acid * mask * breathe * 0.75 * glowMask;

    // Slim traced lines along the circuit contours, built from the local
    // rate-of-change of the mask (its edges), added independently of the
    // contrast mask so they stay lit even when contrast crushes the fill.
    float edge = fwidth(m);
    float thinLine = smoothstep(0.0, 0.09, edge) * (1.0 - smoothstep(0.35, 0.9, edge));
    finalColor += acid * 1.8 * thinLine * (0.35 + 0.65 * breathe) * glowMask;

    finalColor += vec3(0.0, 0.008, 0.004);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return
    gl.getExtension("OES_standard_derivatives")

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC)
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vertShader || !fragShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, "a_pos")
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const iResolution = gl.getUniformLocation(program, "iResolution")
    const iTime = gl.getUniformLocation(program, "iTime")
    const uSeed = gl.getUniformLocation(program, "uSeed")

    // Fresh circuit layout every page load.
    const seed: [number, number] = [Math.random() * 20 - 10, Math.random() * 20 - 10]

    function resize() {
      if (!canvas || !gl) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const start = performance.now()
    let frameId: number

    function frame(now: number) {
      if (!gl || !canvas) return
      const t = (now - start) / 1000
      gl.uniform2f(iResolution, canvas.width, canvas.height)
      gl.uniform1f(iTime, t)
      gl.uniform2f(uSeed, seed[0], seed[1])
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frameId)
      gl.deleteProgram(program)
      gl.deleteShader(vertShader)
      gl.deleteShader(fragShader)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
