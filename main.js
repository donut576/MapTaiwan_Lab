
let data_url = "114年9月底各縣市人口數.csv";
let geo_url = "taiwan_geo.json";

Promise.all([
    d3.csv(data_url),  //倒數據data[0]
    d3.json(geo_url)    //倒地圖data[1]
]).then(function(data) {
    draw_map(data[0], data[1]);
});

function unpack(rows, key) {
    return rows.map(function(row){ 
        return row[key]; });
}

function draw_map(household_data, geo_data) {

    console.log(unpack(household_data, "縣市別").sort());
    let all_cities = [];
    for(let i=0; i<geo_data.features.length; i++) {
        all_cities.push(geo_data.features[i].properties.COUNTYNAME);
    }
    console.log(all_cities.sort());

    //確認可取得各縣市國中人數資料
    console.log(unpack(household_data, "人口數"));

    let trace1 = {
        name:"",
        type:"choropleth",
        locationmode: "geojson-id",
        featureidkey: "properties.COUNTYNAME",
        locations: unpack(household_data, "縣市別"),
        geojson:geo_data,
        z: unpack(household_data, "人口數"),
        colorscale: [
            [0, 'lightyellow'],
            [1, 'brown']
        ],
        hovertemplate: "%{location}:"+"%{z:,}人",
        hoverlabel: {
            bgcolor: "white",
            bordercolor: "black",
            font: {
                family: "Arial",
                size: 30,
                color: "black"
            }
        },
        
    };

    let data = [trace1];
    let layout = {
        title: {
            text: "114年9月底各縣市人口數",
            font: {
                size: 40,
                color: "black"
            },
            x: 0.5,
            y: 0.98,
        },
        geo:{
            center: {
                lon: 120.32,
                lat: 23.84
            },
            fitbounds: "locations",
            projection:{
                type: "mercator"
            },
            resolution: 50,
        },
        margin:{
            l:10,
            r:10,
            t:60,
            b:10,
        }
    };

    Plotly.newPlot("myGraph", data, layout);
}