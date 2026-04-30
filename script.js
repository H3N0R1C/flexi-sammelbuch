let allFlexis = [];
const container = document.getElementById("flexi-container");
const searchInput = document.getElementById("search-input");
const rarityFilter = document.getElementById("rarity-filter");
const clearBtn = document.getElementById("clear-filters");
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function renderList(list) {
    const container = document.getElementById("flexi-container");
    container.innerHTML = "";

    list.forEach(flexi => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Seltenheit als CSS-Klasse hinzufügen (common, rare, epic, legendary)
        if (flexi.rarity) {
            card.classList.add(flexi.rarity.toLowerCase().replace(/\s+/g, "_"));
        }

card.innerHTML = `
    <a href="detail.html?id=${allFlexis.indexOf(flexi)}" class="card-link">
        <div class="card-front ${flexi.collected ? "" : "locked"}">
            <img src="${flexi.image}" alt="${flexi.name}">
            <div class="hover-info">
                <h3>${flexi.name}</h3>
                <p>${flexi.source || "Unbekanntes Ei/Event"}</p>
            </div>
        </div>
    </a>
`;

        container.appendChild(card);
    });
    // Kategorie-Buttons aktivieren
document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        // aktive Klasse setzen
        document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selected = btn.dataset.category;

        // Liste filtern
        const filtered = allFlexis.filter(f => f.category.toLowerCase() === selected);

        renderList(filtered);
    });
});

}

function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const rarity = rarityFilter.value;

  const filtered = allFlexis.filter(item => {
    const matchesRarity = rarity === "all" ? true : item.rarity === rarity;
    const matchesQuery = q === "" ? true :
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));
    return matchesRarity && matchesQuery;
  });

  renderList(filtered);
}

const debouncedApply = debounce(applyFilters, 200);
searchInput.addEventListener("input", debouncedApply);
rarityFilter.addEventListener("change", applyFilters);
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  rarityFilter.value = "all";
  applyFilters();
});

fetch("data/flexis.json")
  .then(res => res.json())
  .then(data => {
    allFlexis = data;
    renderList(allFlexis);
  })
  .catch(err => {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#c00;">Fehler beim Laden der Daten.</p>`;
    console.error(err);
  });




