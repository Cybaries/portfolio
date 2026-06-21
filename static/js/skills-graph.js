import * as THREE from 'three';

const wrap = document.getElementById('skills-graph-wrap');
const label = document.getElementById('skills-graph-label');
const dataEl = document.getElementById('skills-data');

if (wrap && dataEl) {
  const skills = JSON.parse(dataEl.textContent);

  if (skills.length > 0) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    wrap.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Cluster skills by category around category "hub" points ---
    const categories = [...new Set(skills.map(s => s.category))];
    const hubRadius = 6;
    const hubs = {};
    categories.forEach((cat, i) => {
      const angle = (i / categories.length) * Math.PI * 2;
      hubs[cat] = new THREE.Vector3(
        Math.cos(angle) * hubRadius,
        Math.sin(angle) * hubRadius * 0.6,
        (Math.random() - 0.5) * 2
      );
    });

    // --- Build a node per skill, scattered near its category hub ---
    const nodeMeshes = [];
    const sphereGeo = new THREE.SphereGeometry(0.14, 12, 12);

    const colorByCategory = {
      language: 0x00ff9c,
      backend: 0x4ad9ff,
      frontend: 0xffd24a,
      database: 0xff8a4a,
      tool: 0xb98aff,
      core: 0xff6b9c,
    };

    skills.forEach((skill) => {
      const hub = hubs[skill.category] || new THREE.Vector3(0, 0, 0);
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 2.4
      );
      const pos = hub.clone().add(offset);

      const color = colorByCategory[skill.category] || 0x00ff9c;
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.copy(pos);
      mesh.userData = { skill, baseScale: 1 };
      group.add(mesh);
      nodeMeshes.push(mesh);

      // edge to hub
      const edgeGeo = new THREE.BufferGeometry().setFromPoints([hub, pos]);
      const edgeMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.12 });
      group.add(new THREE.Line(edgeGeo, edgeMat));
    });

    // Hub nodes themselves (slightly bigger, dimmer)
    categories.forEach((cat) => {
      const hubGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const hubMat = new THREE.MeshBasicMaterial({
        color: colorByCategory[cat] || 0xffffff,
        transparent: true,
        opacity: 0.35,
      });
      const hubMesh = new THREE.Mesh(hubGeo, hubMat);
      hubMesh.position.copy(hubs[cat]);
      group.add(hubMesh);
    });

    // --- Interaction: drag to rotate, hover to label ---
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotVelX = 0, rotVelY = 0;

    wrap.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });
    window.addEventListener('pointerup', () => { isDragging = false; });
    window.addEventListener('pointermove', (e) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        rotVelY = dx * 0.005;
        rotVelX = dy * 0.005;
        group.rotation.y += rotVelY;
        group.rotation.x += rotVelX;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    });

    // Hover detection via raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    wrap.addEventListener('pointermove', (e) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    wrap.addEventListener('pointerleave', () => {
      hovered = null;
      label.classList.remove('visible');
    });

    // --- Resize ---
    function onResize() {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate() {
      requestAnimationFrame(animate);

      if (!prefersReducedMotion && !isDragging) {
        group.rotation.y += 0.0015;
        rotVelX *= 0.94;
        rotVelY *= 0.94;
      }

      // Raycast for hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        if (hovered !== mesh) {
          hovered = mesh;
          const { skill } = mesh.userData;
          label.innerHTML = `<span class="cat">${skill.category_label}</span>${skill.name}`;
          label.classList.add('visible');
        }
        mesh.scale.setScalar(1.8);
      } else {
        nodeMeshes.forEach(m => { if (m !== hovered) m.scale.setScalar(1); });
        if (hovered) {
          hovered.scale.setScalar(1);
          hovered = null;
          label.classList.remove('visible');
        }
      }

      renderer.render(scene, camera);
    }

    animate();
  }
}
