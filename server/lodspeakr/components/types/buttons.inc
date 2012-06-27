<div id="button-content" style="display:inline-block">
        <button type="button" class="btn-warning btn btn-small export-dialog">
          <i class="icon-share"></i> Share this visualization
        </button>
        <button type="button" class="btn-info btn btn-small edit-visualization">
          <i class="icon-pencil"></i> Edit this visualization
        </button>
</div>

<script type='text/javascript'>
$(document).ready(function(){
    function showExport(e){
      console.log("ad", e.target);
      $("#export-msg").modal('show');
    }
    $('body').on('click', '.export-dialog', function(e){
      $("#export-msg").modal('show');
    });
        $('body').on('click', '.edit-visualization', function(e){
      window.location = "{{lodspk.home}}index.html#{{lodspk.this.value}}";
    });
});
</script>
<div class="modal hide fade" id="export-msg">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Share this visualization</h3>
  </div>
  <div class="modal-body">
    <h2>Copy this URI</h2>
    <p>{{lodspk.this.value}}</p>
    <h2>Embed this code</h2>
    <p>&lt;iframe prefix="foaf: http://xmlns.com/foaf/0.1/" prefix="vizon: http://graves.cl/vizon/" resource="{{lodspk.this.value}}" typeof="{{first.data.specificType.curie}}" name="inlineframe" src="{{lodspk.home}}embed/{{lodspk.this.value|urifier}}" frameborder="0" scrolling="auto" width="500" height="510" marginwidth="5" marginheight="5" &gt;&lt;/iframe&gt;</p>
  </div>
  <div class="modal-footer">
    <a href="#" class="btn" data-dismiss="modal">Close</a>
  </div>
</div>

