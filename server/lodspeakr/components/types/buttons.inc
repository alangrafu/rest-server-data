<div id="button-content" style="display:inline-block;">
        <button type="button" class="btn-warning btn btn-small menu-button export-dialog">
          <i class="icon-share"></i> Share this visualization
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
});
</script>
<div class="modal hide fade" id="export-msg">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Share this visualization</h3>
  </div>
  <div class="modal-body">
    <h2>Copy this URI</h2>
    <p><h3>{{lodspk.this.value}}</h3></p>
    <h2>Embed this code</h2>
    <p><h3>&lt;iframe name="inlineframe" src="{{lodspk.home}}embed/{{lodspk.this.value|urifier}}" frameborder="0" scrolling="auto" width="500" height="510" marginwidth="5" marginheight="5" &gt;&lt;/iframe&gt;</h3></p>
  </div>
  <div class="modal-footer">
    <a href="#" class="btn" data-dismiss="modal">Close</a>
  </div>
</div>

