<?php
$settings = octavius_get_settings();
?>

(function(w,d){
  d.addEventListener("DOMContentLoaded", function(event) {
    var config = {
      api_key: '<?php echo $settings->api_key; ?>',
      service: '<?php echo $settings->url; ?>',
    };
    w.Octavius.init(config);
  });
}(window, document));