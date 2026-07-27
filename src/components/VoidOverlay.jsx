import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uZoom;
uniform float uSpeed;
uniform float uMotion;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  uv *= uZoom;
  float r = length(uv);
  float a = atan(uv.y, uv.x) / 6.2831853 + 0.5;
  float t = uTime * uMotion;

  vec3 col = vec3(0.0);

  // three depth layers of stars streaming out of the void
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float lanes = 100.0 + fi * 60.0;
    float inv = 0.35 / (r + 0.015);
    float z = inv + t * uSpeed * (0.9 + fi * 0.4) + fi * 7.31;
    vec2 g = vec2(a * lanes, z);
    vec2 cell = floor(g);
    vec2 f = fract(g);
    float h = hash21(cell + fi * 13.7);
    if (h > 0.78) {
      vec2 sp = vec2(hash21(cell + 1.7), hash21(cell + 9.3)) * 0.6 + 0.2;
      float dx = abs(f.x - sp.x);
      float dz = abs(f.y - sp.y);
      float streak = 0.35 + uSpeed * 0.25;
      float s = smoothstep(0.10, 0.0, dx) * smoothstep(streak, 0.0, dz);
      float tw = 0.75 + 0.25 * sin(t * (1.0 + h * 3.0) + h * 41.0);
      float depthFade = smoothstep(0.02, 0.30, r);
      col += mix(vec3(0.88, 0.92, 1.0), vec3(1.0, 0.97, 0.90), h) * s * tw * depthFade * (1.0 - fi * 0.22);
    }
  }

  // the mouth of the void: faint ring around the infinite center
  col += vec3(0.70, 0.75, 0.92) * exp(-pow((r - 0.055) / 0.018, 2.0)) * 0.55;

  // vignette
  col *= 1.0 - 0.35 * smoothstep(0.75, 1.35, r);

  fragColor = vec4(col, 1.0);
}
`;

const STAGES = {
  q1: { text: 'Are you sure?', yes: 'Yes', no: 'No, take me back' },
  q2: { text: 'Sure na?', yes: 'Oo, sure na!', no: 'Wait—' },
  q3: { text: 'Then okay.', yes: '👍', no: null }
};

const VoidOverlay = ({ onClose }) => {
  const mountRef = useRef(null);
  const [stage, setStage] = useState('none'); // none -> q1 -> q2 -> q3 -> rick

  // starfield engine
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new Renderer({ alpha: false, antialias: false, dpr, preserveDrawingBuffer: true });
    const gl = renderer.gl;

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uRes: { value: [1, 1] },
        uTime: { value: 0 },
        uZoom: { value: 1 },
        uSpeed: { value: 1.1 },
        uMotion: { value: reduced ? 0 : 1 }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });
    mount.appendChild(gl.canvas);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    renderer.render({ scene: mesh });
    window.addEventListener('resize', resize);

    // scroll wheel = zoom in/out through the stars
    let zoom = 1;
    const onWheel = (e) => {
      e.preventDefault();
      zoom = Math.min(Math.max(zoom * Math.exp(e.deltaY * 0.0012), 0.35), 3.5);
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    let raf = 0;
    const start = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      program.uniforms.uTime.value = (now - start) / 1000;
      program.uniforms.uZoom.value += (zoom - program.uniforms.uZoom.value) * 0.08;
      renderer.render({ scene: mesh });
    };
    if (reduced) {
      renderer.render({ scene: mesh });
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', onWheel);
      if (gl.canvas.parentNode === mount) mount.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  // lock page scroll; Escape exits the void; stage the first question
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const timer = setTimeout(() => setStage('q1'), 1600);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, [onClose]);

  const advance = () => {
    setStage((s) => (s === 'q1' ? 'q2' : s === 'q2' ? 'q3' : 'rick'));
  };

  const dialog = STAGES[stage];

  return (
    <div className="fixed inset-0 z-[100] bg-black" role="dialog" aria-modal="true" aria-label="The void">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-light/40 text-[11px] uppercase tracking-[0.3em] pointer-events-none">
        scroll to zoom
      </p>

      <button
        onClick={onClose}
        aria-label="Leave the void"
        className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-light/70 hover:text-light text-xl leading-none z-10"
      >
        &times;
      </button>

      {dialog && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass rounded-2xl px-8 py-7 text-center pointer-events-auto max-w-[90vw]">
            <p className="text-light text-xl md:text-2xl font-semibold mb-6 tracking-wide">{dialog.text}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                autoFocus
                onClick={advance}
                className="px-6 py-2.5 rounded-full bg-silver text-dark text-sm font-semibold hover:bg-silver-light transition-colors"
              >
                {dialog.yes}
              </button>
              {dialog.no && (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full border border-light/25 text-light/75 text-sm hover:border-silver/60 hover:text-silver transition-colors"
                >
                  {dialog.no}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {stage === 'rick' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4">
          <p className="text-light text-2xl md:text-3xl font-bold tracking-wide">
            okay trolled <span aria-hidden="true">&#128514;</span>
          </p>
          <div className="glass rounded-2xl p-2 w-[min(92vw,640px)]">
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="never gonna give you up"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-7 py-3 rounded-full border border-light/25 text-light/80 text-sm hover:border-silver/60 hover:text-silver transition-colors"
          >
            Get me out of here
          </button>
        </div>
      )}
    </div>
  );
};

export default VoidOverlay;
