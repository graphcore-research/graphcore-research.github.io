---
title: "Publications"
permalink: /publications/
toc: true
toc_sticky: true
toc_label: "Publication categories"
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
function togglePapers(categoryId) {
    var morePapers = document.querySelector('#' + categoryId + ' .more-papers');
    var toggleLink = document.querySelector('#' + categoryId + ' .toggle-link a');
    var toggleIcon = toggleLink.querySelector('i');

    if (morePapers) {
        if (!morePapers.classList.contains('expanded')) {
            morePapers.style.maxHeight = morePapers.scrollHeight + 'px';
            morePapers.classList.add('expanded');
            toggleIcon.className = 'fas fa-chevron-up';
            setTimeout(function() {
                morePapers.style.maxHeight = 'none';
            }, 500); // Match transition duration
        } else {
            morePapers.style.maxHeight = morePapers.scrollHeight + 'px';
            morePapers.classList.remove('expanded');
            morePapers.offsetHeight;
            morePapers.style.maxHeight = '0';
            toggleIcon.className = 'fas fa-chevron-down';
        }
    }
}
</script>

{% for category_name in site.data.publications %}
<div class="publications-wrapper">
    <h2 id="{{ category_name[0] }}">{{ category_name[0] | capitalize }}</h2>
    <div class="category-papers" id="category-{{ forloop.index }}">
        <a href="{{ category_name[1][0].url }}" target="_blank" class="paper-entry-link">
            <div class="paper-entry">
                <h3>{{ category_name[1][0].title }}</h3>
                <div class="abstract">{{ category_name[1][0].abstract }}</div>
                <div class="authors">{{ category_name[1][0].authors }} ({{ category_name[1][0].date | date: "%B %Y" }})</div>
            </div>
        </a>
        <div class="more-papers">
            {% for paper in category_name[1] offset:1 %}
            <a href="{{ paper.url }}" target="_blank" class="paper-entry-link">
                <div class="paper-entry">
                    <h3>{{ paper.title }}</h3>
                    <div class="abstract">{{ paper.abstract }}</div>
                    <div class="authors">{{ paper.authors }} ({{ paper.date | date: "%B %Y" }})</div>
                </div>
            </a>
            {% endfor %}
        </div>
        {% if category_name[1].size > 1 %}
        <div class="toggle-link" style="text-align: center;">
            <a href="#" onclick="togglePapers('category-{{ forloop.index }}'); return false;">
                <i class="fas fa-chevron-down"></i>
            </a>
        </div>
        {% endif %}
    </div>
</div>
{% endfor %}
