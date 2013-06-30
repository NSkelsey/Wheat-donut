
function by_visits(a, b){
    return b.visitCount - a.visitCount;
}

function print_all (items){
    var sum = 0 
    for (var i = 0; i < items.length; ++i){
        sum = items[i].visitCount + sum;
    }
    var max = items.sort(by_visits);
    var html = '<ul>';
    for (var i = 0; i < max.length; ++i){
    html = html + '\n<li>' + max[i].visitCount  + '\t' + max[i].url;
    }
    html = html + '</ul>';
    document.write(sum)
    document.write('<br>'+items.length)
    document.write(html);
}

function early_date(items){
    function by_date(a, b){
      return a.visitTime, b.visitTime;
    }
    var allVisits = [];
    var j = 0;
    items.forEach(function(item) {
     chrome.history.getVisits({url:item.url}, 
        function(vItems){
          allVisits.push.apply(allVisits, vItems);
          j = j + vItems.length;
     });
    });
    var earliest = allVisits.sort(by_date).slice(1,20)
    var html = '<ul>';
    for (var i = 0; i < earliest.length; ++i){
      html = html + '\n<li>' + earliest[i].url
    }
    html = html + j + 'FINISHED</ul>';
    document.write(html)
}

chrome.history.search({
  'text': '',
  //'maxResults': 99999999,
  'maxResults': 300,
  'startTime': 0,
  },
early_date)


