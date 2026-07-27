import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './BlackHoleButton.css';

const PAD = 28;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;     // pill center, px (gl coords)
uniform vec2 uHalfSize;   // pill half size, px
uniform float uRadius;    // pill corner radius, px
uniform vec2 uHole;       // singularity center, px
uniform float uTime;
uniform float uHover;     // 0..1 smoothed proximity
uniform float uShock;     // 0..1 click shockwave progress (<0 = idle)
uniform float uPx;        // device pixel ratio
uniform float uMotion;    // 0 = reduced motion, 1 = full motion

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 starLayer(vec2 p, float cell, float t, float bright) {
  vec2 g = floor(p / cell);
  vec2 f = fract(p / cell);
  float h = hash21(g);
  vec2 sp = vec2(hash21(g + 1.7), hash21(g + 9.3)) * 0.8 + 0.1;
  float d = length(f - sp);
  float size = 0.05 + 0.13 * h;
  float tw = 0.7 + 0.3 * sin(t * (1.0 + 2.0 * h) + h * 43.0);
  float core = smoothstep(size, 0.0, d);
  float glow = exp(-d * d * 26.0) * 0.35;
  float s = (core + glow) * step(0.5, h) * tw * bright;
  return vec3(0.90, 0.92, 0.97) * s;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  float t = uTime * uMotion;

  float sd = sdRoundedRect(p - uCenter, uHalfSize, uRadius);

  vec2 rel = p - uHole;
  float d = max(length(rel), 1e-3);
  vec2 dir = rel / d;

  float rh = 17.0 * uPx;            // event horizon radius
  float photonR = rh * 1.5;

  // click shockwave: expanding ring that displaces space and glows
  float shockGlow = 0.0;
  vec2 shockPush = vec2(0.0);
  if (uShock >= 0.0) {
    float prog = 1.0 - pow(1.0 - uShock, 2.5);
    float ringR = mix(rh, length(uHalfSize) * 2.2, prog);
    float g = exp(-pow((d - ringR) / (16.0 * uPx), 2.0));
    shockPush = dir * g * 14.0 * uPx * (1.0 - uShock);
    shockGlow = g * (1.0 - uShock) * 0.8;
  }

  // gravitational lensing: pull sampled space toward the hole
  float lensK = (1500.0 + 900.0 * uHover) * uPx * uPx;
  float lens = lensK / (d + 26.0 * uPx);
  // frame dragging: swirl the sampled space around the hole
  float swirl = (uMotion * (140.0 + 80.0 * uHover) * uPx) / (d + 30.0 * uPx);
  float cs = cos(swirl), sn = sin(swirl);
  vec2 rq = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);
  // constant slow orbit so space is always alive, even far from the hole
  float orbit = t * 0.07;
  float oc = cos(orbit), os = sin(orbit);
  vec2 orel = rel;
  orel = vec2(orel.x * oc - orel.y * os, orel.x * os + orel.y * oc);
  vec2 sp = uHole + normalize(vec2(rq.x * oc - rq.y * os, rq.x * os + rq.y * oc)) * max(d - lens, 0.5) + shockPush;

  // lensed starfield, three depths
  vec3 col = vec3(0.0);
  col += starLayer(sp + vec2(t * 7.0, t * 2.5), 30.0 * uPx, t, 1.15);
  col += starLayer(sp * 1.7 + vec2(-t * 4.0, t * 5.0), 21.0 * uPx, t + 7.0, 0.75);
  col += starLayer(sp * 2.6 + vec2(t * 2.0, -t * 3.0), 14.0 * uPx, t + 13.0, 0.45);

  // silver nebula haze so the window never reads as flat black
  float neb = vnoise(sp * 0.012 / uPx + vec2(t * 0.015, 0.0)) * vnoise(sp * 0.03 / uPx + 5.0);
  col += vec3(0.30, 0.32, 0.38) * neb * 0.35;
  col += vec3(0.02, 0.021, 0.026);

  // accretion disk: edge-on ellipse around the hole
  float rEll = length(rel * vec2(1.0, 2.6));
  float angEll = atan(rel.y * 2.6, rel.x);
  float diskR = rh * 2.5;
  float band = exp(-pow((rEll - diskR) / (11.0 * uPx), 2.0));
  float hotEdge = exp(-pow((rEll - (diskR - 6.0 * uPx)) / (3.5 * uPx), 2.0));
  float bloom = exp(-pow((rEll - diskR) / (34.0 * uPx), 2.0));
  float streaks = 0.6 + 0.4 * sin(angEll * 5.0 - t * 2.6 + rEll * 0.13 / uPx);
  float doppler = 1.0 + 0.85 * cos(angEll - 0.4);
  float boost = 0.9 + 0.9 * uHover;
  col += vec3(1.0, 0.98, 0.94) * band * streaks * doppler * 1.7 * boost;
  col += vec3(1.0, 1.0, 1.0) * hotEdge * doppler * 0.9 * boost;
  col += vec3(0.75, 0.78, 0.85) * bloom * doppler * 0.30 * boost;

  // photon ring: razor-thin light circle hugging the horizon
  float photon = exp(-pow((d - photonR) / (1.8 * uPx), 2.0)) * (1.5 + 1.0 * uHover);
  col += vec3(1.0, 0.99, 0.96) * photon;
  col += vec3(0.9, 0.92, 0.97) * exp(-pow((d - photonR) / (7.0 * uPx), 2.0)) * 0.35;

  // shock flash
  col += vec3(0.95, 0.97, 1.0) * shockGlow;

  // event horizon: absolute black, hard edge
  col *= smoothstep(rh - 1.5 * uPx, rh + 1.5 * uPx, d);

  // soft glass rim on the pill edge
  float rim = exp(-pow(sd / (1.4 * uPx), 2.0)) * 0.35;
  col += vec3(0.9, 0.92, 0.95) * rim;

  // clip to pill with a soft edge
  float alpha = smoothstep(1.5 * uPx, -1.5 * uPx, sd);
  fragColor = vec4(col * alpha, alpha);
}
`;

const BlackHoleButton = ({ children = 'Enter the Void', onActivate, className = '' }) => {
  const btnRef = useRef(null);
  const fxRef = useRef(null);
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, dpr, preserveDrawingBuffer: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uHole: { value: [0, 0] },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uShock: { value: -1 },
        uPx: { value: dpr },
        uMotion: { value: reduced ? 0 : 1 }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });
    fx.appendChild(gl.canvas);

    const size = { w: 1, h: 1 };
    let holeShift = { x: 0, y: 0 };
    let hover = 0;
    let hoverTarget = 0;
    let shockStart = -1;
    let raf = 0;
    let running = false;
    let visible = false;
    let start = performance.now();

    const layout = () => {
      const rect = btn.getBoundingClientRect();
      size.w = rect.width;
      size.h = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      const cx = (PAD + rect.width / 2) * dpr;
      const cy = (PAD + rect.height / 2) * dpr;
      program.uniforms.uCenter.value = [cx, cy];
      program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
      program.uniforms.uRadius.value = (rect.height / 2) * dpr;
      if (!running) renderOnce();
    };

    const renderOnce = () => {
      const cx = program.uniforms.uCenter.value[0] + holeShift.x * dpr;
      const cy = program.uniforms.uCenter.value[1] - holeShift.y * dpr;
      program.uniforms.uHole.value = [cx, cy];
      renderer.render({ scene: mesh });
    };

    const frame = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      hover += (hoverTarget - hover) * 0.08;
      program.uniforms.uTime.value = (now - start) / 1000;
      program.uniforms.uHover.value = hover;
      if (shockStart >= 0) {
        const prog = (now - shockStart) / 700;
        program.uniforms.uShock.value = prog >= 1 ? -1 : prog;
        if (prog >= 1) shockStart = -1;
      }
      renderOnce();
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);
      const t = Math.max(0, 1 - dist / 220);
      hoverTarget = t * t * (3 - 2 * t);
      // the singularity leans toward the cursor, capped to a few px
      const lx = (e.clientX - cx) / (rect.width / 2);
      const ly = (cy - e.clientY) / (rect.height / 2);
      holeShift.x = Math.max(-1, Math.min(1, lx)) * 6 * hoverTarget;
      holeShift.y = Math.max(-1, Math.min(1, ly)) * 4 * hoverTarget;
    };
    if (!reduced) window.addEventListener('pointermove', onPointerMove);

    const ro = new ResizeObserver(layout);
    ro.observe(btn);
    layout();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (reduced) renderOnce();
        else startLoop();
      } else {
        stopLoop();
      }
    });
    io.observe(btn);

    const onClick = () => {
      if (reduced) {
        onActivateRef.current?.();
        return;
      }
      // fire the shockwave, then let the caller open the void
      shockStart = performance.now();
      startLoop();
      setTimeout(() => onActivateRef.current?.(), 380);
    };
    btn.addEventListener('click', onClick);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      btn.removeEventListener('click', onClick);
      if (!reduced) window.removeEventListener('pointermove', onPointerMove);
      if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      className={`blackhole-button${className ? ` ${className}` : ''}`}
      aria-label={typeof children === 'string' ? children : 'Enter the void'}
    >
      <span ref={fxRef} className="blackhole-button__fx" aria-hidden="true" />
      <span className="blackhole-button__label">{children}</span>
    </button>
  );
};

export default BlackHoleButton;
