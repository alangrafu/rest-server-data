---
layout: container
title: Download
---

<div class="page-header">
  <h1>
    Download Recline
  </h1>
</div>

Besides the library itself, the download package contains full source code,
unit tests, files for debugging and a build system. The production files
(included the same way as in the code above) are in the dist folder.

<p><a href="https://github.com/okfn/recline/zipball/master" class="btn">Download Recline v0.5 (master)</a> (in-progress version)</p>

Just want the all-in-one file containing all of Recline library in a single file? Here it is:

<p><a href="recline.js" class="btn">recline.js all-in-one (master)</a></p>

[View Changelog](https://github.com/okfn/recline#changelog)

### Dependencies

Recline has dependencies on some third-party libraries, notably JQuery and Backbone:

* [JQuery](http://jquery.com/) >= 1.6
* [Backbone](http://backbonejs.org/) >= 0.5.1
* [Underscore](http://documentcloud.github.com/underscore/) &gt;= 1.0

Optional dependencies:

* JQuery Mustache (required for all views)
* [JQuery Flot](http://code.google.com/p/flot/) >= 0.7 (required for for graph view)
* [Leaflet](http://leaflet.cloudmade.com/) >= 0.3.1 (required for map view
* [Bootstrap](http://twitter.github.com/bootstrap/) &gt;= v2.0 (default option for CSS and UI JS but you can use your own)

### Example

Here is an example of the page setup for an app using every Recline component:

{% highlight html %}
  <!-- bootstrap -->
  <!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
  <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
  <link rel="stylesheet" href="vendor/bootstrap/2.0.2/css/bootstrap.css" />

{% include recline-deps.html %}
{% endhighlight %}

