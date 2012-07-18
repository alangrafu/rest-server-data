                    var viz = new recline.View.SlickGrid({
                        model: dataset,
                        el: $el                        
                    });
                    console.log($el);
                    viz.visible=true;
                    viz.render();
                    
