});
</script>
    </div>    
    <div class="span4 metadata">
      <div class="well"><h3>About this visualization</h3>
        <ul>
          <li><b>Identifier:</b> <a href='{{uri}}'>ID</a></dd>
          <li><b>Created:</b> {{row.date.value|date:'M dS Y'}} at {{row.date.value|date:'H:i'}}</li>
        </ul>
        <hr/>
        <h3>About the dataset used</h3>
        <ul>
          <li><b>Dataset:</b> <a href='{{first.data.datasetId.value}}'>{{first.data.hash.value}}</a> <div style='clear:both;margin-left:60px;font-size:90%'>(from <a href='{{first.data.datasetOriginalUrl.value}}'>{{first.data.datasetOriginalUrl.value}}</a>)</div></li>
          <li><b>Obtained:</b> {{first.data.datasetDate.value|date:'M dS Y'}} at {{first.data.datasetDate.value|date:'H:i'}}</li>
        </ul>
        {%if first.data.parentViz%}
        <hr/>
        <h3>Parent Visualization</h3>
        <p><a href='{{first.data.parentViz.value}}'>{{first.data.parentViz.curie}}</a></p>
        {%endif%}
      </div>
    </div>
  </div>
</div>
  </body>
</html>
