lang1 = ['ja-JP', 'ja']
lang2 = ['en-US', 'en']



function check_url_redirect(details) {
    var pattern, redirectUrl;

    function redirect_if_match(query, target, details) {
        try {
            pattern = new RegExp(['([^a-zA-Z0-9])', query, '([^a-zA-Z0-9])'].join(''), 'ig');
        } catch (err) {
            //bad pattern
            return false
        }
        match = details.url.match(pattern);
        if (match) {
            redirectUrl = details.url.replace(pattern, ['$1', target, '$2'].join(''));
            if (redirectUrl != details.url) {
                chrome.tabs.update(details.id, { url: redirectUrl });
                return true
            }
        }
        return false
    }
    var matched = false;
    lang1.forEach((l, ind) => {
        if (matched) { return }
        if (redirect_if_match(l, lang2[ind], details)) { matched = true }
    });
    lang2.forEach((l, ind) => {
        if (matched) { return }
        if (redirect_if_match(l, lang1[ind], details)) { matched = true }
    });
}

chrome.action.onClicked.addListener(check_url_redirect);


function update_extention_staus(details) {
    function is_match(query, details) {
        try {
            pattern = new RegExp(['([^a-zA-Z0-9])', query, '([^a-zA-Z0-9])'].join(''), 'ig');
        } catch (err) {
            //bad pattern
            return false
        }
        match = details.url.match(pattern);
        return match
    }

    if (details.url == 'about:blank') { return }
    if (details.parentFrameId != -1) { return }

    var matched = false;
    lang1.forEach((l, ind) => {
        if (matched) { return }
        if (is_match(l, details)) {
            chrome.action.setBadgeText(
                { text: l, tabId: details.tabId },
            );
            matched = true;

        }
    }
    )
    lang2.forEach((l, ind) => {
        if (matched) { return }
        if (is_match(l, details)) {
            chrome.action.setBadgeText(
                { text: l, tabId: details.tabId },
            )
            matched = true;
        }
    }
    )
    if (!matched) {
        chrome.action.setBadgeText(
            { text: "", tabId: details.tabId },
        )
    }
}


chrome.webNavigation.onDOMContentLoaded.addListener(
    update_extention_staus
)
