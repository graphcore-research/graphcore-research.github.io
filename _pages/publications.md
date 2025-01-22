---
title: "Our Papers"
permalink: /publications/
toc: false
---

<style>
h1 {
    text-align: center;
    margin-bottom: 1em;
}
</style>
<script>
function filterPapersByArea(area) {
    let showing = 0;
    let total = 0;
    document.querySelectorAll(".paper-entry-link").forEach((e) => {
        if (area === null || e.dataset.paperAreas.split(",").includes(area)) {
            e.style.display = "block";
            showing++;
        } else {
            e.style.display = "none";
        }
        total++;
    });
    document.querySelector(".paper-area-showing").innerText = `Showing ${showing}/${total}`;
}
window.addEventListener("load", () => {
    const paperFilters = document.querySelectorAll(".paper-area-filter");
    paperFilters.forEach((e) => {
        e.addEventListener("click", () => {
            if (e.classList.contains("active")) {
                e.classList.remove("active");
                filterPapersByArea(null);
            } else {
                // Only one filter may be active
                paperFilters.forEach((o) => {
                    o.classList.remove("active");
                });
                e.classList.add("active");
                filterPapersByArea(e.dataset.paperArea);
            }
        });
    });
    filterPapersByArea(null);
});
</script>

<aside class="sidebar__right sticky">
    <nav class="toc">
        <header>
            <h4 class="nav__title"><i class="fas fa-book"></i> Research Area</h4>
        </header>
        <ul class="toc__menu">
        {% for area in site.data.publications.areas %}
            <li><a class="paper-area-filter" data-paper-area="{{area[0]}}">{{ area[1] }}</a></li>
        {% endfor %}
            <li class="paper-area-showing"></li>
        </ul>
    </nav>
</aside>

<div>
    {% for paper in site.data.publications.papers %}
    <a href="{{ paper.url }}" target="_blank" class="paper-entry-link" data-paper-areas="{{ paper.area | join: "," }}">
        <div class="paper-entry">
            <h3>{{ paper.title }}</h3>
            <div class="abstract">{{ paper.abstract }}</div>
            <div class="authors">{{ paper.authors }}</div>
            <div class="published">{{ paper.date | date: "%B %Y" }}; {{ paper.published }}</div>
        </div>
    </a>
    {% endfor %}
</div>
