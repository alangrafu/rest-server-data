                    var viz = new recline.View.Grid({
                        model: dataset,
                    });
                    $el.append(viz.el);
                    viz.render();
                    dataset.fetch().done(function() {
                        dataset.query().done(function(data) {
                            // The grid will update automatically
                            // Log some data as an example
                        });
                    });
