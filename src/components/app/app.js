import React, {Component} from 'react';

import './app.css';

class App extends Component {
    state = {
        objects: [
            {name:"Fox", coord:[58.52461842, 31.16543115], icon:"fox",desc:"Красивая лисичка здесь пробегала"},
            {name:"Wolf", coord:[58.5661842, 31.36943415], icon:"wolf",desc:"Я злой и страшный серый Волк, я в поросятах знаю толк"},
        ],
    };

    componentDidMount() {
        function info(text) {
            alert(text);
        }

        window.ymaps.ready(() => {
            const myMap = new window.ymaps.Map('map', {
                center: [58.52461842, 31.26943415],
                zoom: 12
            });
            this.state.objects.map((object) => {
                let obj = new window.ymaps.Placemark(object.coord, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: `./images/map/${object.icon}.png`,
                    iconImageSize: [42, 42],
                    iconImageOffset: [0, 0]
                });
                myMap.geoObjects.add(obj)
                obj.events.add('click', info.bind(this,object.desc));
            });

        })

    }

    render() {
        return (
            <div className="map">
                <div id="map" style={{width: "100vw", height: "100vh"}}></div>
            </div>
        )
    }
}

export default App;