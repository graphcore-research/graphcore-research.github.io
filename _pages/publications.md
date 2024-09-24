---
title: "Our Papers"
permalink: /publications/
toc: true
toc_sticky: true
toc_label: "Research Area"
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<style>
h1 {
    text-align: center;
}
.toc {
    margin: 1em 0 2em 0;
}
</style>

<script>
function expandPapers(category, toggle) {
    var categoryDiv = document.querySelector(`[data-category-name="${category}"]`);
    if (categoryDiv) {
        var morePapers = categoryDiv.querySelector(".more-papers");
        var toggleLink = categoryDiv.querySelector(".toggle-link a");
        var toggleIcon = toggleLink.querySelector('i');
        if (!toggle || !morePapers.classList.contains('expanded')) {
            morePapers.style.maxHeight = morePapers.scrollHeight + 'px';
            morePapers.classList.add('expanded');
            toggleIcon.className = 'fas fa-chevron-up';
            setTimeout(function() {
                morePapers.style.maxHeight = 'none';
            }, 500); // Match transition duration
        } else {
            morePapers.style.maxHeight = morePapers.scrollHeight + 'px';
            morePapers.classList.remove('expanded');
            morePapers.style.maxHeight = '0';
            toggleIcon.className = 'fas fa-chevron-down';
        }
    }
}
window.addEventListener("load", (e) => {
    expandPapers(decodeURI(URL.parse(window.location.href).hash.replace("#", "")), false);
});
navigation.addEventListener("navigate", (e) => {
    expandPapers(decodeURI(URL.parse(e.destination.url).hash.replace("#", "")), true);
});
</script>

{% for category_name in site.data.publications %}
<div class="publications-wrapper">
    <h2 id="{{ category_name[0] }}">{{ category_name[0] }}</h2>
    <div class="category-papers" data-category-name="{{ category_name[0] }}">
        {% assign paper = category_name[1][0] %}
        <a href="{{ paper.url }}" target="_blank" class="paper-entry-link">
            <div class="paper-entry">
                <h3>{{ paper.title }}</h3>
                <div class="abstract">{{ paper.abstract }}</div>
                <div class="authors">{{ paper.authors }}</div>
                <div class="published">{{ paper.date | date: "%B %Y" }}; {{ paper.published }}</div>
            </div>
        </a>
        <div class="more-papers">
            {% for paper in category_name[1] offset:1 %}
            <a href="{{ paper.url }}" target="_blank" class="paper-entry-link">
                <div class="paper-entry">
                    <h3>{{ paper.title }}</h3>
                    <div class="abstract">{{ paper.abstract }}</div>
                    <div class="authors">{{ paper.authors }}</div>
                    <div class="published">{{ paper.date | date: "%B %Y" }}; {{ paper.published }})</div>
                </div>
            </a>
            {% endfor %}
        </div>
        {% if category_name[1].size > 1 %}
        <div class="toggle-link" style="text-align: center;">
            <a href="#" onclick="expandPapers('{{ category_name[0] }}', true); return false;">
                <i class="fas fa-chevron-down"></i>
            </a>
        </div>
        {% endif %}
    </div>
</div>
{% endfor %}
