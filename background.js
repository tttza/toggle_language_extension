function check_url_redirect(details) {
    var pattern, redirectUrl;
    lang1 = 'ja-JP'
    lang2 = 'en-US'

    function redirect_if_match(query, target, details){
        try {
            pattern = new RegExp(query, 'ig');
          } catch(err) {
            //bad pattern
            return 
          }
          match = details.url.match(pattern);
          if (match) {
            redirectUrl = details.url.replace(pattern, target);
            if (redirectUrl != details.url) {
              chrome.tabs.update(details.id, { url: redirectUrl });
            }
          }
    }
    var r1 = redirect_if_match(lang1, lang2, details);
    var r2 = redirect_if_match(lang2, lang1, details);
  }

chrome.action.onClicked.addListener(check_url_redirect);
