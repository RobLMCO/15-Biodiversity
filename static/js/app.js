var slider = document.getElementById(".myRange");
var output = document.getElementById(".sample");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;

}

//init function to execute on first load of index.html.
function init() {

  console.log("in init section.")
  //var notes = d3.select("#notes");
  //var allnotes = document.getElementById('#notes');

  Plotly.d3.json("/names",function(error,response){
    if(error) console.warn(error);
    var dropdown_select = Plotly.d3.select("#selDataset");
   for(var i=0;i<response.length;i++){
       dropdown_select.append("option").attr("value",response[i]).text(response[i]);
   }
   
   console.log("in /names ", response)
   console.log(response)
   optionChanged(response[0]);
  });
}

function buildMetadata(sample) {
  console.log("in buildMetadata:  ")
  console.log("sample:  " + sample)
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url="/metadata/"+sample;

  console.log(url);
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(response){
    // if(error) {console.warn(error)};
    console.log(response);
    var metadata_Sample= d3.select("#sample-metadata");
    // Remove old metadata
    metadata_Sample.selectAll("p").remove();
    metadata_Sample.text("No Sample");

    for(var key in response){
        if(response.hasOwnProperty(key)){
            metadata_Sample.append("p").text(key + ":   " + response[key]);
        }
    }
    console.log("Exiting  buildMetadata   ")
    buildGauge(response.WFREQ);
});
}  
    
//function to build a pie chart based on 10 samples. 
function Plotpie(sample){
  console.log("starting of plot for Pie Chart");
  var descriptions=[];
  d3.json("/samples/" + sample).then(function(response){
    console.log('Plot Pie Inside');
    console.log(response);
      var pielabels=response['otu_ids'].slice(0,11);
      var pievalues=response['sample_values'].slice(0,11);
      var piedescription=response['otu_labels'].slice(0,11);
      console.log("pielabels " + pielabels) ;
      console.log("pievalues " + pievalues) ;
      console.log("piedescription " + piedescription)   ; 
      var trace1 = { 
          values: pievalues,
          labels: pielabels,
          type:"pie",
          name:"Top 10 Samples",
          textinfo:"percent",
          text: piedescription,
          textposition: "inside",
          hoverinfo: 'label+value+text+percent'
      }
      var data=[trace1];
      var layout={
          title: "<b>Top 10 Samples: " + sample + "</b>"
      }
      Plotly.newPlot("pie",data,layout);
  })
}

function Plotscatter(sample){
  console.log("Plotting Scatter Plot");
      d3.json("/samples/"+sample).then(function(response){
      console.log("In plotscatter, logging response next")
      console.log(response)
      var scatter_description = response['otu_labels'];
      console.log("logging scatter_description list")
      console.log(scatter_description.slice(0,10))
      var trace1 = {
          x: response['otu_ids'],
          y: response['sample_values'],
          marker: {
              size: response['sample_values'],
              color: response['otu_ids'].map(d=>100+d*20),
              colorscale: "Earth"
          },
          type:"scatter",
          mode:"markers",
          text: scatter_description,
          hoverinfo: 'x+y+text',
      };
      console.log("trace1" + trace1)
      var data = [trace1];
      console.log(data)
      var layout = {
          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "# of germs in Sample",zeroline:true, hoverformat: '.2r'},
          height: 500,
          width:1200,
          margin: {
              l: 100,
              r: 10,
              b: 70,
              t: 10,
              pad: 5
            },
          hovermode: 'closest',
      };
      console.log(layout)
      console.log("starting scatter plot/bubble chart")
      Plotly.newPlot("bubble",data,layout);
      
  })
}

function optionChanged(newSample) {
  //console.clear()
  //var notes = d3.selectAll("#notes");
  // var allnotes = document.getElementById('notes');
  //notes.innerHTML = "";
  // allnotes.innerHTML = "";
  var foundAudio1 = new Audio('/static/audio/Bubbles.mp3');
  foundAudio1.play();
  var output = document.getElementById(".sample");
  output.innerHTML = slider.value; // Display the default slider value
  console.log("optionchanged detected and new sample selected")
  console.log("new sample: " + newSample )
  buildMetadata(newSample);

  // Plot the updated pie chart
  Plotpie(newSample);
  
  //Update the scatter plot for the new sample selected.
  Plotscatter(newSample);
}
  //Plot the updated gauge chart
  //Plotgauge(newSample);
  

// Initialize the dashboard
init();