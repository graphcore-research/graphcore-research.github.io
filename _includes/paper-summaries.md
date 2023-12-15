Here's a summary of some of our favourite papers over the last month:

{% assign posts = site.posts | where_exp: "item", "item.potm_month == page.potm_month" | where_exp: "item", "item.potm_year == page.potm_year" | where_exp: "item", "item.category != 'papers-of-the-month'" | sort: "paper_order" %}

{% for post in posts %}
## [{{ post.title }}]({{ post.paper_link }}){:target="_blank"} 

<p class="paper__taxonomy"><strong><i class="fas fa-fw fa-users" aria-hidden="true"></i> Authors: </strong>{{
    post.paper_authors }} <i>({{ post.orgs }})</i></p>

{% include paper-tag-list.html %}

{{ post.content }}

**Full paper:** [{{ post.title }}]({{ post.paper_link }}){:target="_blank"} 
{% endfor %}

<hr>
