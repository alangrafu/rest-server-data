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

