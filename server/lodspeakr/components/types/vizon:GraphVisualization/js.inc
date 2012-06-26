                    var viz=  new recline.View.Graph({
                      model: dataset,
                      state: {
                        graphType: "lines-and-points",
                        group: "{{first.data.group.value}}",
                        series: ["{{first.data.series.value}}"]
                      }
                   });
                    $el.append(viz.el);
                    viz.redraw();
                    dataset.fetch().done(function() {
                        dataset.query().done(function(data) {
                            // The grid will update automatically
                            // Log some data as an example
                        });
                    });
