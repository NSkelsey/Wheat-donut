function plotter(meow){
$(document).ready(function() {
    var ctx = $("#chart");
    var temp = ctx[0].getContext("2d");
    var preData = JSON.parse(meow);
    //console.log(preData);
    var data = [
//        	{
//		value: 30,
//		color:"#F7464A"
//	},
//	{
//		value : 50,
//		color : "#E2EAE9"
//	},
//	{
//		value : 100,
////		color : "#D4CCC5"
//	},
//	{
//		value : 40,
//		color : "#949FB1"
//	},
//	{
//		value : 120,
//		color : "#4D5360"
//	}
        {value: preData["facebook"],
         color: "#F7464A"},
        {value: preData["youtube"],
         color: "#E2EAE9"},
        {value: preData["reddit"], 
         color: "#D4CCC5"},
        {value: preData["twitter"],
         color: "#949FB1"},
        {value: preData["techcrunch"], 
         color: "#4D5360"},
        {value: preData["instagram"], 
         color: "#2E2360"},
        {value: preData["news.ycombinator"], 
         color: "#2D6FAE"},
        {value: preData["allother"], 
         color: "#000000"}
    ];
    var chart0 = new Chart(temp).Doughnut(data);
    console.log("INSIDE");
});
}
