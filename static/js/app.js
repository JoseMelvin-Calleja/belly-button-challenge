const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// function to build default graphs
function init(){

    let optionsMenu = d3.select('#selDataset');

    d3.json(url).then((data) => {
        let samples = data.names;

        samples.forEach((id) => {
            optionsMenu.append("option").text(id).property("value", id);
        });

        let default_sample = data[0];
        console.log(default_sample);
        barChart(default_sample);
        bubbleChart(default_sample);
        metadataCard(default_sample);
    })
};

// function to build barchart
function barChart(sample){

    d3.json(url).then((data) => {
        let sample_info = data.samples;
        
        let sample_filtered = sample_info.filter(result => result.id == sample);

        let sample_data = sample_filtered[0];

        let otu_ids = sample_data.otu_ids;
        let otu_labels = sample_data.otu_labels;
        let sample_values = sample_data.sample_values;

        let x_values = sample_values.slice(0,10).reverse();
        let y_values = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        let trace = {
            x: x_values,
            y: y_values,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs"
        };

        Plotly.newPlot("bar", [trace], layout);
    });
};

// function to build bubble chart
function bubbleChart(sample){

    d3.json(url).then((data) => {
        let sample_info = data.samples;
        
        let sample_filtered = sample_info.filter(result => result.id == sample);

        let sample_data = sample_filtered[0];

        let otu_ids = sample_data.otu_ids;
        let otu_labels = sample_data.otu_labels;
        let sample_values = sample_data.sample_values;

        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace], layout);
    });
};

// function to form the metadata card
function metadataCard(sample) {

    d3.json(url).then((data) => {
        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample);

        let valueData = value[0];

        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

//function to change data
function optionChanged(value){
    barChart(value);
    bubbleChart(value);
    metadataCard(value);
};

init();