lang1 = 'ja-JP'
lang2 = 'en-US'



function check_url_redirect(details) {
    var pattern, redirectUrl;
    
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


function update_extention_staus(details){
    console.log(details)
    function is_match(query, details){
        try {
            pattern = new RegExp(query, 'ig');
          } catch(err) {
            //bad pattern
            return false
          }
          match = details.url.match(pattern);
          return match
    }

    console.log(details.url)
    if (details.url == 'about:blank') { return }
    if (is_match(lang1, details)){
        chrome.action.setBadgeText(
            {text: lang1, tabId: details.tabId},
          )
        console.log(lang1)
    }
    else if (is_match(lang2, details)){
        chrome.action.setBadgeText(
            {text: lang2, tabId: details.tabId},
          )
        console.log(lang2)
    } else {
        chrome.action.setBadgeText(
            {text: "", tabId: details.tabId},
          )
    }
}


chrome.webNavigation.onDOMContentLoaded.addListener(
    update_extention_staus   
)
