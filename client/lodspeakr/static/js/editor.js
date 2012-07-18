(function ($) {
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
    var sortVar = null;
    var sortOrder = null;
    
    
    
    window.AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function(){
          datasetCollection.bind('add', this.add(), this);
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
              appview.createGraph( undefined, editedObj.series, editedObj.group);            
            }
            if(editedObj.type == "vizon:MapVisualization"){
              appview.createMap(undefined, editedObj.latField, editedObj.lonField);
            }
          }
        },
        _addProvenance: function(obj){
          id = obj.id;
          visType = obj.visType;
          source = obj.source;
          creationDate = new Date();
          visClass = visType.charAt(0).toUpperCase() + visType.slice(1).toLowerCase();
          provenance = $.rdf.databank().base(baseUri+"/id/"+creationDate.getTime().toString()).prefix('foaf', 'http://xmlns.com/foaf/0.1/')
          .prefix('dc', 'http://purl.org/dc/terms/')
          .prefix('viz', 'http://graves.cl/vizon/')
          .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
          .prefix('prov', 'http://www.w3.org/ns/prov#')
          .prefix('void', 'http://rdfs.org/ns/void#');
          provenance.add('<> dc:source <'+source+'> .')
          .add('<> a viz:'+visClass+'Visualization .')
          .add('<> dc:created "'+creationDate.toISOString()+'" .');
          if(editedObj !==undefined){
            provenance.add('<> prov:wasDerivedFrom <'+editedObj.id+'> .')
          }
          
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
          console.log("provenances",provenances);
          var vizClass = $(e.target).closest('.viz').attr("data-vis-type")
          var dataId = $(e.target).closest(".viz-container").attr("data-id");
          var provId=dataId+"-"+vizClass;
          var datasetId='dataset'+dataId;
          prov = provenances[provId];
          
          data = prov.dump({format: "application/rdf+xml", serialize: true});
          parser = new DOMParser();
          rdfgraph = parser.parseFromString( data, "text/xml" );
          provenance = $.rdf();
          provenance.base(prov.base().toString()).prefix('dc', 'http://purl.org/dc/terms/')
          .prefix('viz', 'http://graves.cl/vizon/')
          .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
          .prefix('prov', 'http://www.w3.org/ns/prov#')
          .prefix('void', 'http://rdfs.org/ns/void#');
          provenance.load(rdfgraph, {});
          uri = provenances[provId+"-id"];
          var myBlank = "_:sort"+(Math.floor(Math.random()*100000));
          d = datasetCollection.get('dataset'+dataId);
          if(d.queryState.attributes.sort != undefined){
            for (i in d.queryState.attributes.sort[0]){
              provenance
              .add("<> viz:sortBy "+myBlank)
              .add(myBlank+" viz:parameterValue \""+i+"\"")
              .add(myBlank+" viz:sortOrder \""+d.queryState.attributes.sort[0][i]['order']+"\"");
            }                         
          }
          encodedgraph = provenance.databank.dump({format: 'text/turtle', serialize: true});
          console.log(encodedgraph);
          
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
          $(".step2").hide();
          $(".map-long-combo").empty();
          $(".map-lat-combo").empty();
          var containerId=$(e.target).parent().parent().attr("id");
          $("#map-id").val("#"+containerId+">.map");
          var el = $("#"+containerId+" .map");
          var fields = (datasetCollection.models[0]).fields.models;
          for( i in fields){
            $(".map-long-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
            $(".map-lat-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
          }
          $("#map-msg").modal('show');
        },
        createMap: function(e, _latitude, _longitude){
          $("#map-msg").modal('hide');
          mapDiv = $("#map-id").val();
          var el = $(mapDiv);
          el.empty();
          var lat = $(".map-lat-combo option:selected").val();
          if(_latitude !==undefined){
            lat = _latitude;
          }
          var lon = $(".map-long-combo option:selected").val();
          if(_longitude !== undefined){
            lon = _longitude;
          }
          var map = new recline.View.Map({
              model: datasetCollection.models[0],
              state: {
                lonField: lon,
                latField: lat,
              }
          });
          this._addProvenance({ id: $(mapDiv).attr("id"), visType: 'map', source: source, lat: lat, lon: lon});
          el.append(map.el);
          el.prepend('<div style="display:inline-block;"><button type="button" class="map-button btn-warning btn btn-small menu-button export-dialog"><i class="icon-share"></i> Share this visualization</button><span class="provenance"></span></div>');          
          map.redraw();
          $('body,html').animate({
              scrollTop: el.offset().top
          }, 800);
        },
        createGraphDialog: function(e){
          $(".step2").hide();
          $(".y-axis-combo").empty();
          $(".x-axis-combo").empty();
          var containerId=$(e.target).closest('.viz-container').attr("data-id");
          $("#graph-id").val("#mycontainer"+containerId+" .graph");
          var el = $("#graph-id").val();
          var fields = (datasetCollection.get("dataset"+containerId)).fields.models;
          for( i in fields){
            $(".y-axis-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
            $(".x-axis-combo").append("<option value='"+fields[i].id+"'>"+fields[i].id+"</option>");
          }
          $("#graph-msg").modal('show');
        },
        createGraph: function(e, seriesParam, groupParam){
          $("#graph-msg").modal('hide');
          graphDiv = $("#graph-id").val();
          console.log(graphDiv, "gaphDiv");
          var el = $(graphDiv);
          el.empty();
          var series = [];
          var group = $(".x-axis-combo option:selected").val();
          if(groupParam !== undefined){
            group = groupParam;
          }
          $(".y-axis-combo option:selected").each(function(i, item){
              series.push($(item).val());
          });
          if(seriesParam !== undefined){
            series = seriesParam;
          }
          var graph = new recline.View.Graph({
              model: datasetCollection.models[0],
              state: {
                graphType: "lines-and-points",
                group: group,
                series: series
              }
          });
          graphDivId = $("#graph-id").val();
          this._addProvenance({ id: $(graphDivId).closest(".viz-container").attr("data-id"), visType: 'graph', source: source, series: series, group: group});
          el.append(graph.el);
          el.prepend('<div style="display:inline-block;"><button type="button" class="graph-button btn-warning btn btn-small menu-button export-dialog"><i class="icon-share"></i> Share this visualization</button><span class="provenance"></span></div>');          
          graph.redraw();
          $('body,html').animate({
              scrollTop: el.offset().top
          }, 800);
        },
        add: function(){
          if(datasetCollection.length>1){
            console.log("mas de 2 datasets in colection");
            $("#add-dataset").attr("disabled", "disable");
          }
        },
        removeDataset: function(e){
          var $button  = $(e.target);
          datasetCollection.remove($button.attr("data-id"));
          $button.parent().parent().remove();
        },
        addDataset: function () {
          $("#import-url-dialog").modal('show');
        },
        importDataset: function(options){
          $(".step1").hide();
          $("#import-url-dialog").modal('hide'); 
          $("#wait-msg").modal('show');
          $("#progress-bar").css("width", "20%");          
          var source = $("#dataset-url").val();
          url = serverUri+'/dataset/'+source.replace(/^http:\/\//gi, '');
            var currentObj = this;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonpCallback: 'callback',
                success: function(d){
                  $("#progress-bar").css("width", "50%");          
                  source = d.data;
                  if(source == "nil" || source == ""){
                    $("#wait-msg").modal('hide');
                    $("#error-msg").modal('show');
                  }else{
                    var datasetInfo = {
                      id: 'dataset'+(counter),
                      url: source,
                      format: 'csv',
                      backend: 'dataproxy'

                    };
                    var dataset = null;
                    dataset = new recline.Model.Dataset(datasetInfo, type);
                    dataset.backend.dataproxy_url = dataProxyUri;
                    var xxx = datasetCollection.add(dataset);          
                    containerId = "mycontainer"+(counter);
                    newDiv = $('<div class="viz-container" id="'+containerId+'" data-id="'+counter+'"></div>');
                    newDiv.appendTo('#content');
                    gridViz = $('<div class="grid viz" data-vis-type="grid"><div style="min-height: 150px"></div></div>');
                    gridViz.prependTo(newDiv);
                    currentObj._addProvenance({ id: counter, visType: 'grid', source: source});
                    dataset.fetch().done(function() {
                        console.log("ASD");
                        if(sortVar != null && sortOrder != null){
                          var sort = [{}];
                          sort[0][sortVar] = {order: sortOrder};
                          dataset.query({sort: sort}); 
                          console.log("sorting!");
                        }
                    });
                    var $el = $('#'+containerId+' .grid div');
                    var gridView = new recline.View.SlickGrid({
                        model: dataset,
                        el: $el,
                        state: {
                          provenance: provenance
                        }
                    });
                    gridView.visible = true;
                    gridView.render();

                    $('<div class="button-container"><button data-id="'+dataset.id+'" type="button" class="btn menu-button btn-small btn-danger remove-dataset" >×</button><button type="button" class="btn-small btn-info btn menu-button create-graph-dialog"><i class="icon-picture"></i> Graph</button><button type="button" class="btn-info btn btn-small menu-button create-map-dialog"><i class="icon-map-marker"></i> Map</button><div id="content"><span class="step2 hide"><img style="position:absolute; top:50px;left:160px;"src="img/step2_en.png"/></span></div>').prependTo(newDiv);
                    $("<div class='graph viz' data-vis-type='graph'></div>").appendTo(newDiv);
                    $("<div class='map viz' data-vis-type='map'></div>").appendTo(newDiv);
                    $('<div style="display:inline-block;"><button type="button" class="grid-button btn-warning btn btn-small menu-button export-dialog"><i class="icon-share"></i> Share this visualization</button></div></div>').prependTo(gridViz);

                    $("#progress-bar").css("width", "90%");
                    currentObj._drawEditedVisualizations();
                    $(".step2").show();
                    $("#wait-msg").modal('hide');
                    counter++;
                  }
                },
                error: function(request,error){
                  $("#wait-msg").modal('hide');
                  $("#error-msg").modal('show');
                }
            });
        },
    });
    appview = new AppView;
    var code = window.location.hash.substr(1);    
    if(code != ""){
      $.ajax({
          url: code,
          dataType: 'json',
          success: function(d){
            if(d.sortVariable != null){
              sortVar = d.sortVariable;
              sortOrder = d.sortOrder;
            }
            $("#dataset-url").val(d.source);
            appview.importDataset();
            editedObj = d;
          }
      });
    }

})(jQuery);
// ensure modal is only shown on page load

