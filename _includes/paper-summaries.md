Here's our summary of this month's chosen papers:

{% assign posts = site.posts | where_exp: "item", "item.potm_month == page.potm_month" | where_exp: "item", "item.potm_year == page.potm_year" | where_exp: "item", "item.category != 'papers-of-the-month'" | sort: "paper_order" %}

{% for post in posts %}
## [{{ post.title }}]({{ post.paper_link }}){:target="_blank" rel="noopener noreferrer"} 

<p class="paper__taxonomy"><strong><i class="fas fa-fw fa-users" aria-hidden="true"></i> Authors: </strong>{{
    post.paper_authors }} <i>({{ post.orgs }})</i></p>

{% include paper-tag-list.html %}

{{ post.content }}

**Full paper:** [{{ post.title }}]({{ post.paper_link }}){:target="_blank" rel="noopener noreferrer"} 
{% endfor %}

<hr>
