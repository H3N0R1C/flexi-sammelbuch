function loadSTL(url) {
  const container = document.getElementById("viewer");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const loader = new THREE.STLLoader();
  loader.load(url, geometry => {
    const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    mesh.position.sub(center);

    camera.position.z = 100;

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    if (flexi.stl) {
  loadSTL(flexi.stl);
}

  });
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const title = document.getElementById("detail-title");
const nameEl = document.getElementById("detail-name");
const imgEl = document.getElementById("detail-image");
const rarityEl = document.getElementById("detail-rarity");
const categoryEl = document.getElementById("detail-category");
const descEl = document.getElementById("detail-description");

fetch("data/flexis.json")
    .then(res => res.json())
    .then(data => {
        const flexi = data[id];

        if (!flexi) {
            title.textContent = "Flexi nicht gefunden";
            return;
        }

        title.textContent = flexi.name;
        nameEl.textContent = flexi.name;
        imgEl.src = flexi.image;
        rarityEl.textContent = flexi.rarity;
        categoryEl.textContent = flexi.category || "Keine Kategorie";
        descEl.textContent = flexi.description;
    });

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// gespeichertes Theme laden
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.getElementById("pet-name").textContent = flexi.name;
document.getElementById("pet-source").textContent = flexi.source;
document.getElementById("pet-year").textContent = flexi.year;
document.getElementById("pet-count").textContent = flexi.count;
document.getElementById("pet-first").textContent = flexi.firstFound;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

fetch("flexis.json")
    .then(res => res.json())
    .then(data => {
        const flexi = data[id];

        document.getElementById("pet-title").textContent = flexi.name;
        document.getElementById("pet-name").textContent = flexi.name;
        document.getElementById("pet-rarity").textContent = flexi.rarity;
        document.getElementById("pet-source").textContent = flexi.source;
        document.getElementById("pet-year").textContent = flexi.year;
        document.getElementById("pet-count").textContent = flexi.count || 0;
        document.getElementById("pet-first").textContent = flexi.firstFound || "—";
        document.getElementById("pet-description").textContent = flexi.description;

        document.getElementById("pet-model").setAttribute("src", flexi.model);
    });

    const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const container = document.getElementById("detail-container");
    container.classList.add("detail-exit");

    setTimeout(() => {
        window.location.href = backBtn.href;
    }, 250); // gleiche Zeit wie Animation
});
