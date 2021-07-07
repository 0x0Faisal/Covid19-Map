import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";

import LoadData, { getColor, numberWithCommas as cummaNum } from "./LoadData.js";


const Map = ({ data }) => {

    var mymap      = null;
    var customInfo = null;

    const onEachRegion = (feature, layer) => {
        
        const prop = feature.properties;

        const name  = prop.name;
        const cases = prop.cases;

        layer.options.fillColor = feature.properties.color;

        //const text = popupText(name, cases);
        layer.bindPopup(infoTable(feature.properties, true));
        // layer.bindTooltip("string", {sticky: true});

        layer.on({
           mouseover: highlightSpot,
           mouseout: resetHighlight,
          click: ZoomToRegion,
        });
    };
    function highlightSpot(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#aad3df',
            //color: '#666',
            dashArray: '',
            fillOpacity: 0.9,
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        (customInfo ?
            customInfo.update(layer.feature.properties)
            : console.log("Error: No info refrence found in [customInfo]")
        );
    }
    function resetHighlight(e) {
            e.target.setStyle(e.target.options.style);
            (customInfo ?
                customInfo.update()
                : console.log("Error: No info refrence found in [customInfo]")
            );
    }
    function ZoomToRegion(e) {
        (mymap ?
            mymap.fitBounds(e.target.getBounds())
            :
            console.log("Error: mymap has no ref in ZoomToSpot")
        );
    }

    const Info = () => {
        const map = useMap();

        var info = L.control({position:'topright'});

        if(!customInfo) {
            customInfo = info;
        }
      
        info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info custom-info');
          this.update();
          return this._div;
        };
        info.update = function (props) {
           this._div.innerHTML = infoText(props, false);      
        };
        info.addTo(map);
        removeDuplicate("custom-info");
        return null;
    }

    const Panel = () => {
        const map = useMap();

        var info = L.control({position:'topleft'});

        info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info custom-panel');
          this.update();
          return this._div;
        };
        info.update = function (props) {
           this._div.innerHTML = "hello world";      
        };
        info.addTo(map);
        removeDuplicate("custom-panel");
        return null;
    }

    const Legend = () => {
        const map = useMap();
        mymap = map;

        var legend = L.control({position:'bottomright'});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 2000, 5000, 10_000, 20_000, 50_000, 100_000];

            for(let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div>' +
                        '<span class="legend-block" style="background-color: ' + getColor(grades[i]) + ';"></span>' +
                        '<span>' + (grades[i + 1] ? '&lt; ' + cummaNum(grades[i+1]) : ' ' + '+ ' + cummaNum(grades[i])) +
                    '</div>'
            }
            return div;
        };
        legend.addTo(map);
        removeDuplicate("legend");
        return null;
    }

     const removeDuplicate = (classname) => {
         const classes = document.getElementsByClassName(classname);
    
         if(classes && classes.length > 1) {
            var node = classes[1];
            node.parentNode.removeChild(node);
        }
        return true;
    }


    if(!data) {
        return null;
    } else {
        console.log(data)
    }
    return (
        <MapContainer className="Map" center={[26, 45]} zoom={5} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            <GeoJSON style={{color: "black", weight: 1, fillOpacity: 0.7}} data={data} onEachFeature={onEachRegion} />
        
            <Legend />
            <Info />
        </MapContainer>
    );
}

function infoText(props) {
    return (
        '<h5 class="info-header">Covid-19 Cases</h5>' + infoTable(props)
    );
}

const infoTable = (props, flag) => {
    const total = props ? props.population : 1;
    const cases = props ? props.casesNum : 1;
    return ( 
        (props ?
        '<table class="table table-dark table-bordered">' +
            '<thead>' +
                '<tr>' +
                    '<th id="table-head" colspan="2">' + props.name_en + '</th>' +
                    (flag ? 
                        '<th colspan="1">% of Pop.</th>' + 
                        '<th colspan="1"> % of Cases</th>'
                        : '' ) + 
                '</tr>' +
            '</thead>' +
            '<tr>' +
                '<th>Total</th><td>' + props.cases + '</td>' + 
                (flag ? 
                    '<td colspan="2"> ' + p(props.casesNum, total) + '% </td>' 
                    : '' ) + 
            '</tr>' +
            '<tr>' +
                '<th>Active</th><td>' + cummaNum(props.active) + '</td>' +
                (flag ? 
                    '<td> ' + p(props.active, total) + '% </td>' + 
                    '<td> ' + p(props.active, cases) + '% </td>'
                    : '' ) + 
            '</tr>' +
            '<tr>' +
                '<th>Recovered</th><td>' + cummaNum(props.recovered) + '</td>' +
                (flag ? 
                    '<td> ' + p(props.recovered, total) + '% </td>' + 
                    '<td> ' + p(props.recovered, cases) + '% </td>'
                    : '' ) + 
            '</tr>' +
            '</tr>' +
            '<tr>' +
                '<th>Deaths</th><td>' + cummaNum(props.deaths) + '</td>' +
                (flag ? 
                    '<td> ' + p(props.deaths, total) + '% </td>' + 
                    '<td> ' + p(props.deaths, cases) + '% </td>'
                    : '' ) + 
            '</tr>' +
            '</tr>' +
        '</table>'
            : '<div>Click or hover over a region.</div>')
    );
}

const p = (d, total) => {
    return ((d / total) * 100).toFixed(2);
}

export default Map;



const _infoText = (props) => {
    return (
        '<h4 class="info-header">Covid-19 total cases</h4>' +  (props ?
                '<b>' + props.name + '</b><br />' + props.cases
                : 'Hover over a region')
    );
}
