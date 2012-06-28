                        var viz=  new recline.View.Map({
                      model: dataset,
                      state: {
                        latField: "{{first.data.latField.value}}",
                        lonField: "{{first.data.lonField.value}}"
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
