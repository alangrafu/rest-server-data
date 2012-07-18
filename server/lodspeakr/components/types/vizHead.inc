{%include "../../header.inc"%}
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
  </head>
  <body about="{{lodspk.this.value}}" typeof="{{first.data.specificType.curie}}">
  {%include "../../menu.inc"%}
<div class="container-fluid">
  <div class="row-fluid">
    <div id="container" class="span8">
      {%include "../buttons.inc"%}
<script type='text/javascript'>
$(document).ready(function(){
var source = "{{first.data.source.value}}";
var baseUri = conf.baseUri;
var serverUri = conf.serverUri;
var dataProxyUri = conf.dataProxyUri;
var sortVar = {%if first.data.sortVar%}"{{first.data.sortVar.value}}"{%else%}null{%endif%};
var sortOrder = {%if first.data.sortOrder%}"{{first.data.sortOrder.value}}"{%else%}null{%endif%};
var dataproxy_url = '{{lodspk.serverUri}}:8000';

  var datasetInfo = {
                      id: 'my-dataset',
                      url: source,
                      format: 'csv',
                      backend: 'dataproxy'
                    };
                    type = 'dataproxy';
                    var dataset = null;
                    dataset = new recline.Model.Dataset(datasetInfo, type);
                    dataset.backend.dataproxy_url = dataProxyUri;
                    dataset.fetch().done(function() {
                        if(sortVar != null && sortOrder != null){
                          var sort = [{}];
                          sort[0][sortVar] = {order: sortOrder};
                          dataset.query({sort: sort}); 
                        }
                    });
                    containerId = "mycontainer";
                    newDiv = $('<div class="viz-container" id="'+containerId+'"><div class="grid" style="min-height: 150px"></div></div>');
                    newDiv.appendTo('#container');
                    var $el = $('#'+containerId+' .grid');
