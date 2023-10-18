maptilersdk.config.apiKey = 'U5L9BK8UnH7C2pZKrTlG'
const map = new maptilersdk.Map({
    container: 'map',
    style: "streets-v2-dark",
    // center: [36.2754, 54.5293],
    zoom: 10,
    geolocate: maptilersdk.GeolocationType.POINT
})

const Lat = 54.517791
const Lng = 36.262724

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
let geoJSON = {
    "type": "FeatureCollection",
    "features": []
}

const requestStations = async () => {
    axios({
        method: 'get',
        url: 'http://localhost:3000/getstations/' + Lat + "/" + Lng,
        responseType: 'json',
        validateStatus: async (status) => {
            if (status != 200) {
                await sleep(2000)
                requestStations()
            }
            return status == 200
        }
    }).then((res) => {
        res.data.forEach(el => {
            geoJSON.features.push({
                "type": "Feature",
                "properties": {
                    "name": "aboba",
                    "radio": el.Radio
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        el.Longitude,
                        el.Latitude
                    ]
                }
            },)
        })
        console.log(geoJSON)
        map.getSource('stations').setData(geoJSON)
    })
}

map.on('load', () => {
    map.addSource('stations', { //DataBase
        'type': 'geojson',
        'data': geoJSON,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    })
    map.addLayer({ //Clusters
        id: 'clusters',
        type: 'circle',
        source: 'stations',
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                25,
                '#f1f075',
                100,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                25,
                25,
                100,
                35
            ]
        }
    })
    map.addLayer({ //Single point properties
        id: 'unclustered-point',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-color': '#fff',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })
      map.addLayer({ //Text on circles
        id: 'cluster-count',
        type: 'symbol',
        source: 'stations',
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 11
        }
      })
})
requestStations()