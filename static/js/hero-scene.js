import * as THREE from 'three';

const wrap = document.getElementById('hero-canvas-wrap');
if (wrap) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  wrap.appendChild(renderer.domElement);

  // --- Node graph: points = "servers", lines = "connections" ---
  const NODE_COUNT = 46;
  const nodes = [];
  const radius = 9;

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(new THREE.Vector3(
      (Math.random() - 0.5) * radius * 2.2,
      (Math.random() - 0.5) * radius * 1.3,
      (Math.random() - 0.5) * 6
    ));
  }

  // Points (nodes)
  const pointsGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  const pointsMat = new THREE.PointsMaterial({
    color: 0x00ff9c,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  scene.add(pointCloud);

  // Connections (edges) — connect nodes within a distance threshold
  const edgePositions = [];
  const maxDist = 3.4;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < maxDist) {
        edgePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
        edgePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x00ff9c,
    transparent: true,
    opacity: 0.08,
  });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);
  scene.add(edges);

  const group = new THREE.Group();
  group.add(pointCloud);
  group.add(edges);
  scene.add(group);

  // --- Mouse parallax ---
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // --- Resize ---
  function onResize() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // --- Reduced motion respect ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 1;

    if (!prefersReducedMotion) {
      group.rotation.y += 0.0009;
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetY, 0.02);
      group.rotation.y = group.rotation.y + (targetX * 0.0006);
    }

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
}
