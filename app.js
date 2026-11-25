document.addEventListener("DOMContentLoaded", () => {
  const expandAllBtn = document.getElementById("expandAllBtn");
  const collapseAllBtn = document.getElementById("collapseAllBtn");
  const searchInput = document.getElementById("searchInput");
  const searchStatus = document.getElementById("searchStatus");
  const allDetails = Array.from(document.querySelectorAll("details"));
  const unitBlocks = Array.from(document.querySelectorAll("details.unit-block"));
  const indexLinks = Array.from(document.querySelectorAll(".index-list a"));

  expandAllBtn.addEventListener("click", () => {
    allDetails.forEach((d) => {
      if (!d.classList.contains("hidden-by-search")) {
        d.open = true;
      }
    });
  });

  collapseAllBtn.addEventListener("click", () => {
    allDetails.forEach((d) => {
      d.open = false;
    });
  });

  indexLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl && targetEl.tagName.toLowerCase() === "details") {
        targetEl.open = true;
      }
    });
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      unitBlocks.forEach((unit) => {
        unit.classList.remove("hidden-by-search");
        const subs = unit.querySelectorAll("details.subtopic-block");
        subs.forEach((s) => s.classList.remove("hidden-by-search"));
      });
      searchStatus.textContent = "";
      return;
    }

    let matchCount = 0;

    unitBlocks.forEach((unit) => {
      const subtopics = Array.from(unit.querySelectorAll("details.subtopic-block"));
      const unitSummaryText = unit.querySelector("summary").textContent.toLowerCase();
      const unitOverviewEl = unit.querySelector(".unit-overview");
      const unitOverviewText = unitOverviewEl ? unitOverviewEl.textContent.toLowerCase() : "";

      if (subtopics.length === 0) {
        const fullUnitText = unit.textContent.toLowerCase();
        if (fullUnitText.includes(query)) {
          unit.classList.remove("hidden-by-search");
          unit.open = true;
          matchCount++;
        } else {
          unit.classList.add("hidden-by-search");
        }
        return;
      }

      let unitHasVisibleSubtopic = false;

      subtopics.forEach((sub) => {
        const subText = sub.textContent.toLowerCase();
        if (subText.includes(query)) {
          sub.classList.remove("hidden-by-search");
          sub.open = true;
          unitHasVisibleSubtopic = true;
          matchCount++;
        } else {
          sub.classList.add("hidden-by-search");
        }
      });

      const matchesUnit = [
        unitHasVisibleSubtopic,
        unitSummaryText.includes(query),
        unitOverviewText.includes(query)
      ].some(Boolean);

      if (matchesUnit) {
        unit.classList.remove("hidden-by-search");
        unit.open = true;
        if (!unitHasVisibleSubtopic) {
          subtopics.forEach((s) => s.classList.remove("hidden-by-search"));
          matchCount++;
        }
      } else {
        unit.classList.add("hidden-by-search");
      }
    });

    searchStatus.textContent = matchCount === 0
      ? "No se encontraron coincidencias para tu búsqueda."
      : `Se encontraron ${matchCount} sección(es) relacionada(s).`;
  });
});