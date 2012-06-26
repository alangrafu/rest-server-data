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
          <li><b>Dataset:</b> <a href='{{row.datasetId.value}}'>{{row.hash.value}}</a> <div style='clear:both;margin-left:60px;font-size:90%'>(from <a href='{{row.datasetOriginalUrl.value}}'>{{row.datasetOriginalUrl.value}}</a>)</div></li>
          <li><b>Obtained:</b> {{row.datasetDate.value|date:'M dS Y'}} at {{row.datasetDate.value|date:'H:i'}}</li>
        </ul>
      </div>
    </div>
  </div>
</div>
  </body>
</html>
