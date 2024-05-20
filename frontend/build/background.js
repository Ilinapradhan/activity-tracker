const tabTimeObjectKey = "tabTimeObject";
const lastActiveTabKey = "lastActiveTab";
chrome.runtime.onInstalled.addListener(function(){
    chrome.declarativeContent.onPageChanged.removeRules(undefined , function(){
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {},
            })
        ],
        // actions : [new chrome.declarativeContent.showPageAction()]
    }]);
    });
});

chrome.windows.onFocusChanged.addListener(function(windowID){
    if(windowID == chrome.windows.WINDOW_ID_NONE){
        processTabChange(false);
    }
    else{
        processTabChange(true);
    }
});

function processTabChange(isWindowActive){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ //change
        console.log("isWindowActive" + isWindowActive);
        console.log(tabs);

        if(tabs.length > 0 && tabs[0] != null){
            let currentTab = tabs[0];
            let url = currentTab.url;
            let title = currentTab.title;
            let hostName = url;
            try{
                let urlObject = new URL(url);
                hostName = urlObject.hostname;
            } catch(e){
                console.log(`could not construct url form ${currentTab.url} , error : ${e}`);
            }
            chrome.storage.local.get([tabTimeObjectKey , lastActiveTabKey] , function(result){
                let lastActiveTabString = result[lastActiveTabKey];
                let tabTimeObjectString = result[tabTimeObjectKey];
                console.log("background.js , get result");
                console.log(result);
                tabTimeObject = {};
                if(tabTimeObjectString != null && tabTimeObjectString != undefined){//change
                    tabTimeObject = JSON.parse(tabTimeObjectString);
                }
                if (lastActiveTabString != null){
                    lastActiveTab = JSON.parse(lastActiveTabString);
                }

                if (lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDateVal")){
                    let lastUrl = lastActiveTab["url"];
                    let currentDataVal_ = Date.now();
                    let passesSeconds = (currentDateVal_ - lastActiveTab["lastDateVal"]) * 0.001 ;

                    if(tabTimeObject.hasOwnProperty(lastUrl)){
                        let lastUrlObjectInfo = tabTimeObject[lastUrl];
                        if(lastUrlObjectInfo.hasOwnProperty("trackedSeconds")){
                            lastUrlObjectInfo["tracjedSeconds"] = lastUrlObjectInfo["trackedSeconds"] + passedSeconds;

                        }else{
                              lastUrlObjectInfo["trackedSeconds"] = passesSeconds;
                        }
                        lastUrlObjectInfo["lastDateVal"] = currentDateVal_;
                    } else{
                        let newUrlInfo = {url : lastUrl , trackedSeconds: passedSeconds , lastDataVal: currentDataVal_ , startDateVal : currentDataVal_};
                        tabTimeObject[lastUrl] = newUrlInfo ;
                    }
                }
                let currentDataValue = Date.now();
                let lastTabInfo = {"url":hostName , "lastDateVal" : currentDateValue};
                if (!isWindowActive){
                    lastTabInfo = {};
                }
                let newLastTabObject = {};
                newLastTabObject[lastActiveTabKey] = JSON.stringify(lastTabInfo);

                chrome.storage.local.set(newLastTabObject , function(){
                    console.log("lastActiveTab stored :" + hostName);
                    const tabTimeObjectString = JSON.stringify(tabTimeObject);
                    let newTabTimeObject ={};
                    newTabTimeObject[tabTimeObjectKey] = tabTimeObjectString;
                    chrome.storage.local.set(newTabTimeObject , function(){

                });
            });
        });
        }
});
}
function onTabTrack(activeInfo){
    let tabId = activeInfo.tabId;
    let windowId = activeInfo.windowId;
    processTabChange(true);
}

chrome.tabs.onActivated.addListener(onTabTrack);