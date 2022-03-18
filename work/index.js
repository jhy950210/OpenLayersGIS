import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
// OpenStreetMap
import LayerGroup from 'ol/layer/Group';
import Stamen from 'ol/source/Stamen';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import ImageWMS from 'ol/source/ImageWMS';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import {defaults as defaultControls, FullScreen, ZoomSlider, ScaleLine, MousePosition} from 'ol/control'
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultInteractions} from 'ol/interaction';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import KeyboardPan from 'ol/interaction/KeyboardPan';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Select from 'ol/interaction/Select';
import Translate from 'ol/interaction/Translate';

import LayerSwitcher from 'ol-layerswitcher';
import ContextMenu from 'ol-contextmenu';
import 'ol-contextmenu/dist/ol-contextmenu.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

const contextmenu = new ContextMenu({
    width:170,
    defaultItems: true,
    items: [
            {
                text: 'Center map here',
                callback: e => {

                }
            },
            {
                text: 'Add a Marker',
                callback: e => {

                }
            },
            '-', // 중간 구분선
            {
                text: '보여질 내용(타이틀)',
                callback: e => {

                }
            }
        
    ]
});

const layerswitcher = new LayerSwitcher({

});

const vWorldMap = new TileLayer({
    title: 'vWorld 배경지도',
    source: new XYZ({
        url: 'http://xdworld.vworld.kr:8080/2d/Base/201512/{z}/{x}/{y}.png'
    })
})

const geojsonsource = new VectorSource();
const layer = new VectorLayer({
    source: geojsonsource
});

const select = new Select();
const translate = new Translate({
    features: select.getFeatures()
});

const geoserverImageLayer = new TileLayer({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new TileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: {'LAYERS': 'topp:states', 'TILED': true},
        ratio: 1,
        serverType: 'geoserver'
    })

})

const staticImageLayer = new ImageLayer({
    source: new Static({
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/'+
        'British_National_Grid.svg/2000px-British_National_Grid.svg.png',
        projection: 'EPSG:27700',
        imageExtent: [0, 0, 700000, 1300000]
    })
})

const groupLayer = new LayerGroup({
    layers: [
        new TileLayer({
            source: new Stamen({
                layer: 'watercolor'
            })
        }),
        new TileLayer({
            source: new Stamen({
                layer: 'terrain-labels'
            })
        })
    ]
})

const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    target: 'coordinateDivId',
    undefinedHTML: '&nbsp'
})


const map = new Map({
    target: 'map',
    layers: [
        vWorldMap,
        new TileLayer({
            title: 'OSM',
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([127.4, 37.5]),
        zoom: 8,
        minZoom: 5,
        maxZoom: 17
    }),
    controls: defaultControls().extend([
        new FullScreen(), new ScaleLine(), new ZoomSlider(), mousePositionControl
    ]),
    interactions: defaultInteractions({
        mouseWheelZoom : true
    }).extend([
        //new MouseWheelZoom(), 
        new KeyboardPan(), 
        new KeyboardZoom(),
        select,
        translate
    ]),
    keyboardEventTarget: document
});

map.addLayer(layer);
map.addInteraction(new DragAndDrop({
    source: geojsonsource,
    formatConstructors: [GeoJSON]
}));

map.addControl(contextmenu);
map.addControl(layerswitcher);