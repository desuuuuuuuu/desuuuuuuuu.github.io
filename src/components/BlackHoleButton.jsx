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

vec3 starLayer(vec2 p, float cell, float t, float bright) {
  vec2 g = floor(p / cell);
  vec2 f = fract(p / cell);
  float h = hash21(g);
  vec2 sp = vec2(hash21(g + 1.7), hash21(g + 9.3)) * 0.8 + 0.1;
  float d = length(f - sp);
  float size = 0.03 + 0.09 * h;
  float tw = 0.65 + 0.35 * sin(t * (1.0 + 2.0 * h) + h * 43.0);
  float s = smoothstep(size, 0.0, d) * step(0.72, h) * tw * bright;
  return vec3(0.88, 0.90, 0.95) * s;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  float t = uTime * uMotion;

  float sd = sdRoundedRect(p - uCenter, uHalfSize, uRadius);

  vec2 rel = p - uHole;
  float d = max(length(rel), 1e-3);
  vec2 dir = rel / d;

  float rh = 20.0 * uPx;            // event horizon radius
  float photonR = rh * 1.45;

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
  vec2 sp = uHole + normalize(rq) * max(d - lens, 0.5) + shockPush;

  // lensed starfield, two depths drifting slowly
  vec3 col = vec3(0.0);
  col += starLayer(sp + vec2(t * 6.0, t * 2.0), 34.0 * uPx, t, 0.9);
  col += starLayer(sp * 1.9 + vec2(-t * 3.5, t * 4.5), 23.0 * uPx, t + 7.0, 0.55);

  // deep space base tint so the pill reads as a window, not a cutout
  col += vec3(0.012, 0.013, 0.016);

  // accretion disk: edge-on ellipse around the hole
  float rEll = length(rel * vec2(1.0, 2.6));
  float angEll = atan(rel.y * 2.6, rel.x);
  float diskR = rh * 2.35;
  float band = exp(-pow((rEll - diskR) / (7.5 * uPx), 2.0));
  float streaks = 0.55 + 0.45 * sin(angEll * 5.0 - t * 2.4 + rEll * 0.11 / uPx);
  float doppler = 1.0 + 0.8 * cos(angEll - 0.4);
  float diskI = band * streaks * doppler * (0.65 + 0.85 * uHover);
  col += vec3(1.0, 0.97, 0.92) * diskI * 1.15;

  // photon ring: razor-thin light circle hugging the horizon
  float photon = exp(-pow((d - photonR) / (1.6 * uPx), 2.0)) * (1.0 + 0.9 * uHover);
  col += vec3(1.0, 0.99, 0.96) * photon;

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

const BlackHoleButton = ({ children = 'Enter the Void', onNavigate, targetId = 'contact', className = '' }) => {
  const btnRef = useRef(null);
  const fxRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, dpr });
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
      if (!reduced) {
        shockStart = performance.now();
        startLoop();
      }
      const target = document.getElementById(targetId);
      if (!target) return;
      if (reduced) {
        target.scrollIntoView();
        return;
      }
      // gravity pull: accelerating fall toward the target section
      const startY = window.scrollY;
      const endY = target.getBoundingClientRect().top + startY - 80;
      const t0 = performance.now();
      const D = 950;
      const fall = (now) => {
        const u = Math.min((now - t0) / D, 1);
        const eased = u < 0.75 ? Math.pow(u / 0.75, 2.4) * 0.92 : 0.92 + 0.08 * ((u - 0.75) / 0.25);
        window.scrollTo(0, startY + (endY - startY) * eased);
        if (u < 1) requestAnimationFrame(fall);
      };
      requestAnimationFrame(fall);
      onNavigate?.();
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
  }, [targetId, onNavigate]);

  return (
    <button
      ref={btnRef}
      type="button"
      className={`blackhole-button${className ? ` ${className}` : ''}`}
      aria-label={`${children} — go to ${targetId} section`}
    >
      <span ref={fxRef} className="blackhole-button__fx" aria-hidden="true" />
      <span className="blackhole-button__label">{children}</span>
    </button>
  );
};

export default BlackHoleButton;
