(function ($) {
    var provenances = {};
    var baseUri = conf.baseUri;
    var serverUri = conf.serverUri;
    var dataProxyUri = conf.dataProxyUri;
    var DatasetCollection = Backbone.Collection.extend({
        model: recline.Model.Dataset,
        events: 'add'
    });
    var datasetCollection =  new DatasetCollection();
    
    var dataproxy_url = dataProxyUri;
    var counter=0;
    var editedObj = undefined;
    
    window.AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function(){
          datasetCollection.bind('add', this.add, this);
        },
        events: {
          "click #add-dataset":  "addDataset",
          "click #import-dataset": "importDataset",
          "click .remove-dataset": "removeDataset",
          "click .create-graph-dialog": "createGraphDialog",
          "click #create-graph": "createGraph",
          "click .create-map-dialog": "createMapDialog",
          "click #create-map": "createMap",
          "click .export-dialog": "exportDialog",
        },
        _drawEditedVisualizations: function(){
          if(editedObj !== undefined){
            if(editedObj.type == "vizon:GraphVisualization"){
              appview.createGraph( editedObj.series, editedObj.group);            
            }
            if(editedObj.type == "vizon:MapVisualization"){
              appview.createMap(editedObj.latField, editedObj.lonField);
            }
          }
        },
        _addProvenance: function(obj){
          id = obj.id;
          visType = obj.visType;
          source = obj.source;
          console.log(obj);
          creationDate = new Date();
          visClass = visType.charAt(0).toUpperCase() + visType.slice(1).toLowerCase();
          provenance = $.rdf.databank().base(baseUri+"/id/"+creationDate.getTime().toString()).prefix('foaf', 'http://xmlns.com/foaf/0.1/')
          .prefix('dc', 'http://purl.org/dc/terms/')
          .prefix('viz', 'http://graves.cl/vizon/')
          .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
          .prefix('void', 'http://rdfs.org/ns/void#');
          provenance.add('<> dc:source <'+source+'> .')
          .add('<> a viz:'+visClass+'Visualization .')
          .add('<> dc:created "'+creationDate.toISOString()+'" .');
          
          //Graph parameters
          if(obj.group != undefined){
            gId = '_:group1';
            provenance.add('<> viz:hasParameter '+gId).add(gId+' a viz:Parameter ').add(gId+' viz:parameterValue "'+obj.group+'"').add(gId+' rdfs:label "group" ');
          }          
          if(obj.series != undefined){
            for(seriesCounter = 0; seriesCounter< obj.series.length; seriesCounter++){
              sId = '_:series'+seriesCounter;
              provenance.add('<> viz:hasParameter '+sId).add(sId+' a viz:Parameter').add(sId+' viz:parameterValue "'+obj.series[seriesCounter]+'" ').add(sId+' rdfs:label "series" ');
            }
          }
          
          //Map parameters
          if(obj.lat != undefined){
            gId = '_:lat1';
            provenance.add('<> viz:hasParameter '+gId).add(gId+' a viz:Parameter ').add(gId+' viz:parameterValue "'+obj.lat+'"').add(gId+' rdfs:label "latField" ');
          }
          if(obj.lon != undefined){
            gId = '_:lon1';
            provenance.add('<> viz:hasParameter '+gId).add(gId+' a viz:Parameter ').add(gId+' viz:parameterValue "'+obj.lon+'"').add(gId+' rdfs:label "lonField" ');
          }          
          provenances[id+"-"+visType] = provenance;
          provenances[id+"-"+visType+"-id"] = baseUri+"/id/"+creationDate.getTime().toString();
        },
        exportDialog: function(e){
          var provId=$(e.target).attr("id");
          console.log(provId);
          provenance = provenances[provId];
          console.log(provenance);
          uri = provenances[provId+"-id"];
          console.log(provenance.dump({format: 'text/turtle', serialize: true}));
          encodedgraph = provenance.dump({format: 'text/turtle', serialize: true});
          url = serverUri+'/registerViz';
          $.ajax({
                url: url,
                dataType: 'jsonp',
                data:{
                  encodedgraph: encodedgraph,
                  uri: uri
                },
                jsonpCallback: 'callback',
                success: function(d){
                  var embedString = '&lt;iframe name="inlineframe" src="'+baseUri+'/embed/'+d.uri.replace('http:\/\/', 'http\/')+'" frameborder="0" scrolling="auto" width="800" height="550" marginwidth="5" marginheight="5" &gt;&lt;/iframe&gt;'
                  $("#share-uri").html(d.uri);
                  $("#share-embed").html(embedString);
                  $("#export-msg").modal('show');
                }
          });
        },
        createMapDialog: function(e){
          $(".map-long-combo").empty();
          $(".map-long-combo").empty();
          var containerId=$(e.target).parent().parent().attr("id");
          $("#map-id").val("#"+containerId+">.map");
          var el = $("#"+containerId+" .Map");
          var fields = (datasetCollection.models[0]).fields.models;
          for( i in fields){
            $(".map-long-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
            $(".map-lat-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
          }
          $("#map-msg").modal('show');
        },
        createMap: function(_lat, _lon){
          $("#map-msg").modal('hide');
          mapDiv = $("#map-id").val();
          var el = $(mapDiv);
          el.empty();
          var lat = $(".map-lat-combo option:selected").val();
          if(_lat !==undefined){
            lat = _lat;
          }
          var lon = $(".map-long-combo option:selected").val();
          if(_lon !==undefined){
            lon = _lon;
          }
          var map = new recline.View.Map({
              model: datasetCollection.models[0],
              state: {
                lonField: lon,
                latField: lat,
              }
          });
          console.log('map', map);
          this._addProvenance({ id: $(mapDiv).attr("id"), visType: 'map', source: source, lat: lat, lon: lon});
          el.append(map.el);
          console.log(mapDiv, map.el);
          visId = 'map'+counter;
          el.prepend('<div style="display:inline-block;"><button id="'+visId+'-map" type="button" class="btn-warning btn btn-small menu-button export-dialog"><i class="icon-share"></i> Share this visualization</button><span class="provenance"></span></div>');          
          map.redraw();
        },
        createGraphDialog: function(e){
          $(".y-axis-combo").empty();
          $(".x-axis-combo").empty();
          var containerId=$(e.target).parent().parent().attr("id");
          $("#graph-id").val("#"+containerId+">.graph");
          var el = $("#"+containerId+" .graph");
          var fields = (datasetCollection.models[0]).fields.models;
          for( i in fields){
            $(".y-axis-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
            $(".x-axis-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
          }
          $("#graph-msg").modal('show');
        },
        createGraph: function(s, g){
          $("#graph-msg").modal('hide');
          graphDiv = $("#graph-id").val();
          var el = $(graphDiv);
          console.log("graphDiv", el);         el.empty();
          var series = [];
          var group = $(".x-axis-combo option:selected").val();
          if(g !== undefined){
            group = g;
          }
          $(".y-axis-combo option:selected").each(function(i, item){
              series.push($(item).val());
          });
          if(s !== undefined){
            series = s;
          }
          var graph = new recline.View.Graph({
              model: datasetCollection.models[0],
              state: {
                graphType: "lines-and-points",
                group: group,
                series: series
              }
          });
          this._addProvenance({ id: $(graphDiv).attr("id"), visType: 'graph', source: source, series: series, group: group});
          el.append(graph.el);
          visId = 'graph'+counter;
          el.prepend('<div style="display:inline-block;"><button id="'+visId+'-graph" type="button" class="btn-warning btn btn-small menu-button export-dialog"><i class="icon-share"></i> Share this visualization</button><span class="provenance"></span></div>');          
          graph.redraw();
        },
        add: function(){
          if(datasetCollection.length>1){
            console.log("mas de 2 datasets in colection");
            $("#add-dataset").attr("disabled", "disable");
          }
        },
        removeDataset: function(){
          console.log("remove");
        },
        addDataset: function () {
          $("#import-url-dialog").modal('show');
        },
        importDataset: function(){
          $("#import-url-dialog").modal('hide'); 
          $("#wait-msg").modal('show');
          $("#progress-bar").css("width", "20%");          
          var source = $("#dataset-url").val();
          counter++;
          console.log("source: "+source);
          url = serverUri+'/dataset/'+source.replace(/^http:\/\//gi, '');
            var currentObj = this;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonpCallback: 'callback',
                success: function(d){
                  $("#progress-bar").css("width", "50%");          
                  console.log("Local identifier: "+d.data);
                  source = d.data;
                  if(source == "nil" || source == ""){
                    $("#wait-msg").modal('hide');
                    $("#error-msg").modal('show');
                  }else{
                    var datasetInfo = {
                      id: 'my-dataset'+(counter),
                      url: source,
                      format: 'csv',
                      webstore_url: source,
                    };
                    type = 'dataproxy';
                    var dataset = null;
                    dataset = new recline.Model.Dataset(datasetInfo, type);
                    dataset.backend.dataproxy_url = dataproxy_url;
                    containerId = "mycontainer"+(counter);
                    visId = "grid"+(counter);
                    newDiv = $('<div class="viz-container" id="'+containerId+'"><div class="grid recline-read-only" id="'+(visId)+'"><div style="display:inline-block;"><button id="'+visId+'-grid" type="button" class="btn-warning btn btn-small menu-button export-dialog"><i class="icon-share"></i> Share this visualization</button></div></div></div>');
                    newDiv.appendTo('#content');
                    currentObj._addProvenance({ id: visId, visType: 'grid', source: source});
                    $("<div class='graph' id='graph"+(counter)+"'></div>").appendTo(newDiv);
                    $("<div class='map' id='map"+(counter)+"'></div>").appendTo(newDiv);

                    var $el = $('#'+visId);
                    var grid = new recline.View.Grid({
                        model: dataset,
                        state: {
                          provenance: provenance
                        }
                    });
                    $el.append(grid.el);
                    grid.render();
                    datasetCollection.add(dataset);
                    dataset.fetch().done(function() {
                        dataset.query().done(function(data) {
                            // The grid will update automatically
                            // Log some data as an example
                        });
                    });
                    $("#progress-bar").css("width", "90%");
                    newDiv.prepend('<div data-id="${id}" class="button-container"><button data-id="${id}" type="button" class="btn menu-button btn-small btn-danger remove-dataset" >×</button><button data-id="${id}" type="button" class="btn-small btn-info btn menu-button create-graph-dialog"><i class="icon-picture"></i> Graph</button><button type="button" class="btn-info btn btn-small menu-button create-map-dialog"><i class="icon-map-marker"></i> Map</button></div>')
                    currentObj._drawEditedVisualizations();
                    $("#wait-msg").modal('hide');
                  }
                },
                error: function(request,error){
                  $("#wait-msg").modal('hide');
                  $("#error-msg").modal('show');
                }
            });
        },
    });
    var appview = new AppView;
    var code = window.location.hash.substr(1);    
    if(code != ""){
      $.ajax({
          url: code,
          dataType: 'json',
          success: function(d){
            $("#dataset-url").val(d.source);
            appview.importDataset();
            editedObj = d;
          }
      });
    }

})(jQuery);
// ensure modal is only shown on page load

