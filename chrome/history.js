var B = 0;
var blacklist = {"facebook":0,
  "youtube":0,
  "reddit":0,
  "twitter":0,
  "techcrunch":0,
  "instagram":0,
  "news.ycombinator":0,
  "allother":0};

function early_date(results){
  for(var i = 0;i<results.length;i++){      
    clean_url(results[i].url);
  }
  console.log(blacklist);
  plotter(JSON.stringify(blacklist));
}

function clean_url(url){
  var blackList = "(facebook|youtube|reddit|twitter|techcrunch|instagram|news\.ycombinator)(.com)"
  var matchURL = new RegExp(blackList);
  matchURL.pass = matchURL.test(url),
  matchURL.url = matchURL.exec(url);
  if (matchURL.pass){
    blacklist[matchURL.url[1]] += 1;
  } else {
    var tmp = blacklist['allother'];
    blacklist['allother'] += 1;
  }
}

function time_series(full_hist){
  var data = []
  var tmp = new Date(0);
  var yesterday = tmp.getDay();
  console.log(full_hist[123]);
  for (var i = 0; i < full_hist.length; i++){
    var visit = full_hist[i];
    console.log(visit);
    curday = (new Date(visit.lastVisitTime)).getDay();
    if (curday != yesterday) {
      data.push(1);
      yesterday = curday;
    } else {
      data.push(1 + data.pop());
    }
  }
  var lbls = [];
  for (var i = 1; i <= data.length; i++) {
    lbls.push(i);
  }
  var data = {
    labels : lbls,
    datasets : [
      {
      fillColor : "rgba(220,220,220,0.5)",
      strokeColor : "rgba(0,0,255,1)",
      data : data
    },
    ],
  };
  var ctx = $('#timeseries')[0].getContext('2d');
  B = new Chart(ctx).Bar(data);
}


function build_full_hist(results){
    full_hist = [];
    var decr = results.length;
//    results.forEach(function(item) {
//     chrome.history.getVisits({url:item.url}, 
//        function(vItems){
//          full_hist.push.apply(full_hist, vItems);
//          decr -= 1;
//     });
//    });
    function by_date(a, b){
      return a.visitTime, b.visitTime;
    }
//
//    while (decr > 10){
//        var num = 1337*3;
//    }
//    return full_hist;
//  setTimeout(function(){
//    full_hist.sort(by_date);
//    console.log(full_hist.length);
//    return full_hist;
//  }, 5000);
    return results;
}


function callback(results){
  early_date(results);
  var hist = build_full_hist(results);
  console.log(hist.length);
  time_series(hist);
}

var d;

chrome.history.search(
  {'text': '',
    'maxResults': 9999999,
    'startTime': 0},
    callback);

