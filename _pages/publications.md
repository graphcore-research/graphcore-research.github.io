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
    let showingYears = new Set();
    document.querySelectorAll(".paper-entry-link").forEach((e) => {
        if (area === null || e.dataset.paperAreas.split(",").includes(area)) {
            e.style.display = "block";
            showing++;
            showingYears.add(e.dataset.paperYear);
        } else {
            e.style.display = "none";
        }
        total++;
    });
    console.log(showingYears);
    document.querySelectorAll(".paper-sep-year").forEach((e) => {
        if (showingYears.has(e.innerText)) {
            e.style.display = "block";
        } else {
            e.style.display = "none";
        }
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
    {% for year in site.data.publications.papers %}
        <div class="paper-sep-year">{{ year[0]  }}</div>
        <!-- A mess - to handle empty `conference:` or `workshop:` blocks -->
        {% assign empty_array = "" | split: "," %}
        {% assign year_conference = year[1].conference | default: empty_array %}
        {% assign year_workshop = year[1].workshop | default: empty_array %}
        {% assign year_papers = year_conference | concat: year_workshop %}
        {% for paper in year_papers %}
        <a href="{{ paper.url }}" target="_blank" class="paper-entry-link" data-paper-areas="{{ paper.area | join: "," }}" data-paper-year="{{ year[0] }}">
            <div class="paper-entry">
                <h3>{% if paper.icon %}<i class="fas {{ paper.icon }}"></i>{% endif %} {{ paper.title }}</h3>
                <div class="abstract">{{ paper.abstract }}</div>
                <div class="authors">{{ paper.authors }}</div>
                <div class="published">{{ paper.published }}</div>
            </div>
        </a>
        {% endfor %}
    {% endfor %}
</div>
