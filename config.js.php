<?php
$settings = octavius_get_settings();
?>

(function(){
  function _on_loaded(){
    var config = {
      api_key: '<?php echo $settings->api_key; ?>',
      service: '<?php echo $settings->url; ?>',
    };
    window.Octavius.init(config);
    window.Octavius.setAttribute('pagetype','cooler_node');
    window.Octavius.setAttribute('nodeid','123456789');
  }
  if(document.addEventListener){
    document.addEventListener("DOMContentLoaded", _on_loaded);
  } else {
    document.attachEvent('onDOMContentLoaded',function(){
      if ( document.readyState === "complete" ) {
        _on_loaded()
      }
    });
  }


}());