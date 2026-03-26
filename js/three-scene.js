/**
 * js/three-scene.js
 * Three.js particle network for the hero background.
 * Spec: ~200 floating particles, connected by cyan lines,
 *       mouse tilt, 80 particles on mobile.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Setup ────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 200;

  // ── Particle count (fewer on mobile) ────────────────
  const isMobile   = window.innerWidth < 768;
  const COUNT      = isMobile ? 80 : 200;
  const CONNECT_D  = 60;   // max distance for lines
  const SPEED      = 0.15; // drift speed multiplier

  // ── Particle data ────────────────────────────────────
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];

  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 300;
    const z = (Math.random() - 0.5) * 200;
    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    velocities.push({
      x: (Math.random() - 0.5) * SPEED,
      y: (Math.random() - 0.5) * SPEED,
      z: (Math.random() - 0.5) * SPEED * 0.3,
    });
  }

  // ── Dots ─────────────────────────────────────────────
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));

  const pointsMat = new THREE.PointsMaterial({
    color:       0xE8E8F0,
    size:        2.0,
    sizeAttenuation: true,
    transparent: true,
    opacity:     0.8,
  });

  const points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  // ── Lines (built each frame) ─────────────────────────
  let linesMesh = null;

  function buildLines(pos) {
    const verts = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = pos[i * 3]     - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECT_D) {
          verts.push(pos[i*3], pos[i*3+1], pos[i*3+2]);
          verts.push(pos[j*3], pos[j*3+1], pos[j*3+2]);
        }
      }
    }
    return new Float32Array(verts);
  }

  const lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.12 })
  );
  scene.add(lineMat);

  // ── Mouse influence ───────────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animate ───────────────────────────────────────────
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const pos = pointsGeo.attributes.position.array;

    for (let i = 0; i < COUNT; i++) {
      // Sinusoidal drift
      pos[i * 3]     += velocities[i].x + Math.sin(frame * 0.005 + i) * 0.02;
      pos[i * 3 + 1] += velocities[i].y + Math.cos(frame * 0.007 + i) * 0.02;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce off bounds
      if (Math.abs(pos[i * 3])     > 210) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 160) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 110) velocities[i].z *= -1;
    }

    pointsGeo.attributes.position.needsUpdate = true;

    // Rebuild lines every 2 frames (performance trade-off)
    if (frame % 2 === 0) {
      const lineVerts = buildLines(pos);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
    }

    // Subtle camera tilt following mouse
    scene.rotation.x += (-mouseY * 0.04 - scene.rotation.x) * 0.03;
    scene.rotation.y += ( mouseX * 0.04 - scene.rotation.y) * 0.03;

    renderer.render(scene, camera);
  }

  animate();
})();
