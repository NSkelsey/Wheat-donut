var MAXRES = 2000;

function parseUri (str) {
  var	o   = parseUri.options,
  m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
  uri = {},
  i   = 14;

  while (i--) uri[o.key[i]] = m[i] || "";

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  q:   {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

var blacklist = {"facebook":0,
  "youtube":0,
  "reddit":0,
  "twitter":0,
  "techcrunch":0,
  "instagram":0,
  "news.ycombinator":0,
  "allother":0};

  function hash_to_freqs(results){
    hash = {};
    results.forEach(function(item){
      domain = parseUri(item.url).host;
      if (hash[domain] != undefined && typeof domain === 'string'){
        hash[domain] = hash[domain] + item.length;
      } else {
        if (typeof item.length === 'number') {
          hash[domain] = item.length;
        }
      }
    });
    var freq_list = Array();
    for (var key in hash){
      freq_list.push([key, hash[key]]);
    }
    return freq_list;
  }

  function make_v2_donut(results){
    freq_list = hash_to_freqs(results);
    freq_list = freq_list.sort(function(a,b) {return b[1] - a[1];});
    var top = freq_list.slice(0,10);
    var rest = freq_list.slice(10);
    var i_rest = 0;
    rest.forEach(function(elem){i_rest += elem[1];});
    // there are too many other visits to produce a meaningful graph
    top.push(['Everything else',i_rest]);

    chart_data = [];
    top.forEach(function(item){
      var gaycolor = '#'+Math.floor(Math.random()*16777215).toString(16);
      var entry = {value: item[1],
        color: gaycolor};
        chart_data.push(entry);
    });
    console.log(i_rest);
    console.log(rest);
    console.log(top);

    var ctx = $("#chart");
    var temp = ctx[0].getContext("2d");
    new Chart(temp).Doughnut(chart_data);
  }

  function make_exp_bar(results){
    freq_list = hash_to_freqs(results);
    console.log(freq_list);
    freq_list = freq_list.sort(function(a,b) {return b[1] - a[1];});
    var top = freq_list.slice(0,30)
    var lbls = []
    top.forEach(function(item){lbls.push(item[0]);});
    var data = []
    top.forEach(function(item){data.push(item[1]);});

    var chart_data = {
      labels : lbls,
      datasets : [
        {
        fillColor : "rgba(220,220,220,0.5)",
        strokeColor : "rgba(0,0,255,1)",
        data : data
      },
      ],
    };
    var ctx = $("#expchart");
    var temp = ctx[0].getContext("2d");
    new Chart(temp).Bar(chart_data);
  }




  function make_donut(results){
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
                                 item.length = 0;
                                 vItems.forEach(function(elem){
                                    if (elem.transition == 'type' || elem.transition == 'link'){
                                        item.length += 1;
                                    }
                                 });
                               });
    });

    setTimeout(function(){
      console.log(full_hist.length);
      time_series(full_hist);
      make_v2_donut(results);
      make_exp_bar(results);
    }, 1000);
  }


  function callback(results){
    build_and_use_hist(results)
  }


  chrome.history.search(
    {'text': '',
      'maxResults': MAXRES,
      'startTime': 0},
      callback);

