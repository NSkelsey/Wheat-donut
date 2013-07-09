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


function day_buckets(full_hist){
  function by_date(a, b){
    return a.visitTime - b.visitTime;
  }
  full_hist = full_hist.sort(by_date)
  var data = []
  var tmp = new Date(0);
  var yesterday = tmp.getDay();
  console.log(full_hist.length);
  for (var i = 0; i < full_hist.length; i++){
    var visit = full_hist[i];
    curday = (new Date(visit.visitTime)).getDay();
    if (visit.transition == 'link'  || visit.transition == 'typed'){
      if (curday != yesterday) {
        data.push(1);
        yesterday = curday;
      } else {
        data.push(1 + data.pop());
      }
    } else {
        //filtered
    }
  }
  return data
}


function bucket_hours(full_hist){
    var data = Array(24);
    for (var i = 0; i < data.length; i++){
        data[i] = 0;
    }
    for (var j = 1; j < full_hist.length; j++){
        msecs = full_hist[j].visitTime;
        hour = (new Date(msecs)).getHours();
        data[hour] += 1;
    }
    return data;
}

function time_series(full_hist){
  data = bucket_hours(full_hist)
  console.log(data.length);
  var lbls = [];
  for (var m = 1; m <= data.length; m++) {
    lbls.push(m);
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
  new Chart(ctx).Bar(data);
}


function build_and_use_hist(results){
    full_hist = [];
    var decr = results.length;
    results.forEach(function(item) {
     chrome.history.getVisits({url:item.url}, 
        function(vItems){
          full_hist.push.apply(full_hist, vItems);
     });
    });

  setTimeout(function(){
    console.log(full_hist.length);
    time_series(full_hist);
  }, 1000);
}


function callback(results){
  early_date(results);
  build_and_use_hist(results)
  console.log(hist.length);
}


chrome.history.search(
  {'text': '',
    'maxResults': 3000,
    'startTime': 0},
    callback);

