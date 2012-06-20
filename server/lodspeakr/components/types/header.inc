<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Page about {{lodspk.this.value}}</title>
    <link rel="alternate" type="application/rdf+xml" title="RDF/XML Version" href="{{lodspk.this.value}}.rdf" />
    <link rel="alternate" type="text/turtle" title="Turtle Version" href="{{lodspk.this.value}}.ttl" />
    <link rel="alternate" type="text/plain" title="N-Triples Version" href="{{lodspk.this.value}}.nt" />
    <link rel="alternate" type="application/json" title="RDFJSON Version" href="{{lodspk.this.value}}.json" />
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
<link rel="stylesheet" href="css/bootstrap.css">
<link rel="stylesheet" href="css/bootstrap-responsive.css">
    <script type="text/javascript" src="recline/vendor/jquery/1.7.1/jquery.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
<link rel="stylesheet" href="../recline/vendor/bootstrap/2.0.2/css/bootstrap.css" />


<link rel="stylesheet" href="../recline/vendor/leaflet/0.3.1/leaflet.css">
<!--[if lte IE 8]>
<link rel="stylesheet" href="../recline/vendor/leaflet/0.3.1/leaflet.ie.css" />
<![endif]-->
<link rel="stylesheet" href="../recline/vendor/slickgrid/2.0.1/slick.grid.css">

<!-- Recline CSS components -->
<link rel="stylesheet" href="../recline/css/grid.css">
<link rel="stylesheet" href="../recline/css/graph.css">
<link rel="stylesheet" href="../recline/css/map.css">
<link rel="stylesheet" href="../css/gov-explorer.css">
<link rel="stylesheet" href="../recline/css/multiview.css">
<!-- /Recline CSS components -->

<!-- 3rd party JS libraries -->

<!--
The recline library itself - this includes all components at once.

You can include just the components you need e.g.

<script type="text/javascript" src="../recline/src/model.js"></script>
<script type="text/javascript" src="../recline/src/backend/base.js"></script>
<script type="text/javascript" src="../recline/src/backend/memory.js"></script>
-->
<link rel="stylesheet" href="../recline/../recline/vendor/bootstrap/2.0.2/css/bootstrap-responsive.css">
<link href="../recline/../recline/css/site/pygments.css" rel="stylesheet" type="text/css" />
<link href="../recline/../recline/css/site/site.css" rel="stylesheet" type="text/css" />


  <script type="text/javascript" src="../recline/vendor/jquery/1.7.1/jquery.js"></script>
  <script type="text/javascript" src="../recline/vendor/underscore/1.1.6/underscore.js"></script>
  <script type="text/javascript" src="../recline/vendor/backbone/0.5.1/backbone.js"></script>
  <script type="text/javascript" src="../recline/vendor/moment/1.6.2/moment.js"></script>
  <script type="text/javascript" src="../recline/vendor/jquery.flot/0.7/jquery.flot.js"></script>
  <script type="text/javascript" src="../recline/vendor/mustache/0.5.0-dev/mustache.js"></script>
  <script type="text/javascript" src="../recline/vendor/bootstrap/2.0.2/bootstrap.js"></script>
  <script type="text/javascript" src="../recline/vendor/leaflet/0.3.1/leaflet.js"></script>
  <script type="text/javascript" src="../recline/vendor/slickgrid/2.0.1/jquery-ui-1.8.16.custom.min.js"></script>
  <script type="text/javascript" src="../recline/vendor/slickgrid/2.0.1/jquery.event.drag-2.0.min.js"></script>
  <script type="text/javascript" src="../recline/vendor/slickgrid/2.0.1/slick.grid.min.js"></script>
  <script type="text/javascript" src="../recline/vendor/timeline/20120520/js/timeline.js"></script>

  <!-- recline library -->
  <!-- in normal use would just the single recline.js library file. However, for testing it
  is easier to reference individual files. See built.html for example using just recline.js -->
  <script type="text/javascript" src="../recline/src/costco.js"></script>
  <script type="text/javascript" src="../recline/src/model.js"></script>
  <script type="text/javascript" src="../recline/src/backend/base.js"></script>
  <script type="text/javascript" src="../recline/src/backend/memory.js"></script>
  <script type="text/javascript" src="../recline/src/backend/dataproxy.js"></script>
  <script type="text/javascript" src="../recline/src/backend/elasticsearch.js"></script>
  <script type="text/javascript" src="../recline/src/backend/gdocs.js"></script>
  <script type="text/javascript" src="../recline/src/backend/csv.js"></script>

  <script type="text/javascript" src="../recline/src/view.grid.js"></script>
  <script type="text/javascript" src="../recline/src/view.slickgrid.js"></script>
  <script type="text/javascript" src="../recline/src/view.transform.js"></script>
  <script type="text/javascript" src="../recline/src/view.graph.js"></script>
  <script type="text/javascript" src="../recline/src/view.map.js"></script>
  <script type="text/javascript" src="../recline/src/view.timeline.js"></script>
  <script type="text/javascript" src="../recline/src/widget.pager.js"></script>
  <script type="text/javascript" src="../recline/src/widget.queryeditor.js"></script>
  <script type="text/javascript" src="../recline/src/widget.filtereditor.js"></script>
  <script type="text/javascript" src="../recline/src/widget.fields.js"></script>
  <script type="text/javascript" src="../recline/src/view.multiview.js"></script>
  <script type="text/javascript" src="../js/md5.js"></script>
  <script type="text/javascript" src="../js/rdfquery/jquery.rdfquery.core.min-1.0.js"></script>
  <script type="text/javascript" src="../js/rdfquery/jquery.rdf.js"></script>
  <script type="text/javascript" src="../js/rdfquery/jquery.rdf.xml.js"></script>
  <script type="text/javascript" src="../js/rdfquery/jquery.rdf.json.js"></script>
  <script type="text/javascript" src="../js/rdfquery/jquery.rdf.turtle.js"></script>
  </head>
  <body about="{{lodspk.this.value}}">
  {%include "../../menu.inc"%}
    <h1>Visualization</h1>