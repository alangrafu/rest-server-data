});
</script>
    </div>    
    <div class="span4 metadata">
    <div  style="height:30px; display:inline-block">
</div>
      <div class="well"><h3>About this visualization</h3>
        <ul>
        <li><b>Identifier:</b> <a href='{{uri}}'>ID</a><span property="foaf:homepage" href=""></span></li>
          <li><b property="dcterms:created" content="{{first.data.date.value}}">Created:</b> {{first.data.date.value|date:'M dS Y'}} at {{first.data.date.value|date:'H:i'}}</li>
        </ul>
        <h3>Parameters of this visualization</h3>
        <ul>
        {%if first.data.series%}<li><strong>Series:</strong>  {{first.data.series.value}}</li>{%endif%}
        {%if first.data.group%}<li><strong>Group:</strong>  {{first.data.group.value}}</li>{%endif%}
        {%if first.data.latField%}<li><strong>latField:</strong>  {{first.data.latField.value}}</li>{%endif%}
        {%if first.data.lonField%}<li><strong>lonField:</strong>  {{first.data.lonField.value}}</li>{%endif%}
        </ul>
        <hr/>
        <h3>About the dataset used</h3>
        <ul>
        <li><b>Dataset:</b> <a rel="dcterms:source" href='{{first.data.datasetId.value}}'>{{first.data.hash.value}}</a> <div style='clear:both;margin-left:60px;font-size:90%'>(from <a href='{{first.data.datasetOriginalUrl.value}}'>{{first.data.datasetOriginalUrl.value}}</a>)</div></li>
          <li><b>Obtained:</b> {{first.data.datasetDate.value|date:'M dS Y'}} at {{first.data.datasetDate.value|date:'H:i'}}</li>
        </ul>
        {%if first.data.parentViz%}
        <hr/>
        <h3>Parent Visualization</h3>
        <p><a property="prov:wasDerivedFrom" href='{{first.data.parentViz.value}}'>{{first.data.parentViz.curie}}</a></p>
        {%endif%}
      </div>
    </div>
  </div>                               
</div>
  </body>
</html>
