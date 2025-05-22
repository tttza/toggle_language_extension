// 日本語と英語の言語コード
lang1 = ['ja-JP', 'ja', 'ja_JP']
lang2 = ['en-US', 'en', 'en_US']

function check_url_redirect(details) {
    var pattern, redirectUrl;
    
    function redirect_if_match(query, target, details) {
        try {
            pattern = new RegExp(['([^a-zA-Z0-9_])', query, '([^a-zA-Z0-9_])'].join(''), 'i');
        } catch (err) {
            return false
        }
        
        match = details.url.match(pattern);
        if (match) {
            const actualMatch = match[0].substring(1, match[0].length - 1);
            let targetLang = target;
            
            if (actualMatch === actualMatch.toUpperCase()) {
                targetLang = target.toUpperCase();
            } else if (actualMatch.includes('-')) {
                if (actualMatch[0] === actualMatch[0].toUpperCase()) {
                    const parts = target.split(/[-_]/);
                    if (parts.length > 1) {
                        targetLang = parts[0][0].toUpperCase() + parts[0].slice(1) + '-' + parts[1].toUpperCase();
                    }
                }
            } else if (actualMatch.includes('_')) {
                if (target.includes('-')) {
                    targetLang = target.replace('-', '_');
                }
                if (actualMatch === actualMatch.toLowerCase()) {
                    targetLang = targetLang.toLowerCase();
                } else if (actualMatch[0] === actualMatch[0].toUpperCase()) {
                    const parts = targetLang.split('_');
                    if (parts.length > 1) {
                        targetLang = parts[0][0].toUpperCase() + parts[0].slice(1) + '_' + parts[1].toUpperCase();
                    }
                }
            }
            
            redirectUrl = details.url.replace(match[0], match[0][0] + targetLang + match[0][match[0].length - 1]);
            if (redirectUrl != details.url) {
                chrome.tabs.update(details.id, { url: redirectUrl });
                return true
            }
        }
        return false
    }
    
    var matched = false;
    
    // 日本語から英語への変換
    for (let i = 0; i < lang1.length; i++) {
        if (matched) { break; }
        const targetIndex = Math.min(i, lang2.length - 1);
        if (redirect_if_match(lang1[i], lang2[targetIndex], details)) { 
            matched = true; 
        }
    }
    
    // 英語から日本語への変換
    if (!matched) {
        for (let i = 0; i < lang2.length; i++) {
            if (matched) { break; }
            const targetIndex = Math.min(i, lang1.length - 1);
            if (redirect_if_match(lang2[i], lang1[targetIndex], details)) { 
                matched = true; 
            }
        }
    }
}

chrome.action.onClicked.addListener(check_url_redirect);

function update_extention_staus(details) {
    function is_match(query, details) {
        try {
            pattern = new RegExp(['([^a-zA-Z0-9_])', query, '([^a-zA-Z0-9_])'].join(''), 'i');
        } catch (err) {
            return false
        }
        match = details.url.match(pattern);
        return match
    }

    if (details.url == 'about:blank') { return }
    if (details.parentFrameId != -1) { return }
    
    var matched = false;
    
    // 日本語関連の言語コード検出
    for (let i = 0; i < lang1.length; i++) {
        if (matched) { break; }
        if (is_match(lang1[i], details)) {
            chrome.action.setBadgeText(
                { text: lang1[i].length > 2 ? lang1[i].substring(0, 2) : lang1[i], tabId: details.tabId },
            );
            chrome.action.setBadgeBackgroundColor(
                { color: 'blue', tabId: details.tabId },
            )
            matched = true;
        }
    }
    
    // 英語関連の言語コード検出
    if (!matched) {
        for (let i = 0; i < lang2.length; i++) {
            if (matched) { break; }
            if (is_match(lang2[i], details)) {
                chrome.action.setBadgeText(
                    { text: lang2[i].length > 2 ? lang2[i].substring(0, 2) : lang2[i], tabId: details.tabId },
                )
                chrome.action.setBadgeBackgroundColor(
                    { color: 'red', tabId: details.tabId },
                )
                matched = true;
            }
        }
    }
    
    // 言語コードが見つからない場合はバッジをクリア
    if (!matched) {
        chrome.action.setBadgeText(
            { text: "", tabId: details.tabId },
        )
    }
}

// ナビゲーション時に言語コードを検出してバッジを設定
chrome.webNavigation.onCommitted.addListener(
    update_extention_staus
)
