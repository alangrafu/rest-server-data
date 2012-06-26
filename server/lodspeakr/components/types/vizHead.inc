{%include "../../header.inc"%}
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
  <body about="{{lodspk.this.value}}">
  {%include "../../menu.inc"%}
<div class="container-fluid">
  <div class="row-fluid">
    <div id="container" class="span8">
      {%include "../buttons.inc"%}
<script type='text/javascript'>
$(document).ready(function(){
var source = "{{first.data.source.value}}";                  
var dataproxy_url = '{{lodspk.serverUri}}:8000';

  var datasetInfo = {
                      id: 'my-dataset',
                      url: source,
                      format: 'csv',
                      webstore_url: source,
                    };
                    type = 'dataproxy';
                    var dataset = null;
                    dataset = new recline.Model.Dataset(datasetInfo, type);
                    dataset.backend.dataproxy_url = dataproxy_url;
                    containerId = "mycontainer";
                    newDiv = $('<div class="viz-container" id="'+containerId+'"><div class="grid recline-read-only"></div></div>');
                    newDiv.appendTo('#container');
                    var $el = $('#'+containerId+' .grid');
