var blacklist = {"facebook":0,
                 "youtube":0,
                 "reddit":0,
                 "twitter":0,
                 "techcrunch":0,
                 "instagram":0,
                 "news.ycombinator":0};

function early_date(results){
    for(var i = 0;i<results.length;i++){      
        clean_url(results[i].url);
    }
    console.log(blacklist["facebook"]);
    plotter(JSON.stringify(blacklist));
}

function clean_url(url){
    var prodlist = 0;
    var blackList = "(facebook|youtube|reddit|twitter|techcrunch|instagram|news\.ycombinator)(.com)"
    var matchURL = new RegExp(blackList);
        matchURL.pass = matchURL.test(url),
        matchURL.url = matchURL.exec(url);
    
    if (matchURL.pass){
        blacklist[matchURL.url[1]] += 1;
    } else {
       prodlist += 1; 
    }
}

chrome.history.search(
  {'text': '',
   'startTime': 60},
  early_date);