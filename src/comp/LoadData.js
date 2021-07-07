import { features } from "../data/regions.json";


class LoadData {

    setData   = null;
    countries = features;

    max = 0;
    min = 0;

    load = async (setData) => {
        console.log("Loading ...");
        this.setData = setData;

        const data = await fetch('https://services6.arcgis.com/bKYAIlQgwHslVRaK/arcgis/rest/services/CasesByRegion_ViewLayer/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json').then(response => response.json());

        
        this.#processData(data.features);
    }

    #processData(data) {
        console.log("yes work");
        for(let i = 0; i < this.countries.length; i++) {
            const reg      = this.countries[i].properties;

            const found = data.find(
                (covidreg) => {
                    return covidreg.attributes.REG_CODE === ("R" + ('0' + reg.region_id).slice(-2));
                }
            ).attributes;
            if(found) {
                const cases = found.TotalConfirmed;

                if(cases < this.min || this.min === 0 ) {
                    this.min = cases;
                }
                if(cases > this.max) {
                    this.max = cases;
                }
                reg.name  = found.Region_Name_AR;
                reg.color = getColor(cases);

                reg.casesNum = cases;
                reg.cases = numberWithCommas(cases);
                reg.active = found.TotalActive;
                reg.deaths = found.TotalDeaths;
                reg.recovered = found.TotalRecovered;

            }
        }
        console.log("this.max: " + this.max);
        console.log("this.min: " + this.min);
        setTimeout(() => this.setData(this.countries),
            2000);
    }
}


export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getColor = (d) => {
    return (
         d < 2_000   ? "#fee5d9" :
         d < 5_000   ? "#fcbba1" :
         d < 10_000  ? "#fc9272" :
         d < 20_000  ? "#fb6a4a" :
         d < 50_000  ? "#de2d26" :
         d < 100_000 ? "#cb181d" :
                      "#99000d"
    );
}


export default LoadData;


// 
// class LoadData {
// 
//     setHotspots = null;
//     hotspots    = features;
// 
//     load = (setHotspots, setLoading) => {
//         this.setHotspots = setHotspots;
//         console.log("loading...");
//         for(let i = 0; i < this.hotspots.length; i++) {
//             const spot = this.hotspots[i].properties;
//             spot.name = spot.name_ar;
//             spot.color  = getColor(spot.population);
//             spot.accidents = numberWithCommas(spot.population);
//         }
//         setHotspots(this.hotspots);
//         setTimeout(() => {                  /* DEBUG debug simulate waiting for loading !!! */
//            setLoading(false);
//         }, 2500);
//     }
// 
// }
// 
// const numberWithCommas = (x) => {
//     x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }
// 
// 
// const getColor = (d) => {
//     return (
//         d > 5_000_000 ? "#800026" :
//         d > 1_000_000  ? "#bd0026" :
//         d > 500_000  ? "#e31a1c" :
//         d > 100_000  ? "#fc4e2a" :
//         d > 50_000   ? "#fd8d3c" :
//         d > 10_000   ? "#feb24c" :
//         d > 5_000   ? "#fed976" :
//         d > 1_000   ? "#ffeda0" :
//                 "#ffffcc" 
//     );
// }
// 
// export default LoadData;
// 
