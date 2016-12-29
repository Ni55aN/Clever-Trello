var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-75172036-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

  chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){

      chrome.tabs.sendMessage(tab.id,{url: tab.url}, function(response) {});
  });
