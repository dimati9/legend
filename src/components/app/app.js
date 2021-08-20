import React, {Component} from 'react';

import './app.css';

class App extends Component {
    state = {
        server: "http://localhost:3100",
        objects: null,
        objects2: [
            {name:"Fox", coord:[58.52461842, 31.16543115], icon:"fox",desc:"Красивая лисичка здесь пробегала"},
            {name:"Wolf", coord:[58.5661842, 31.36943415], icon:"wolf",desc:"Я злой и страшный серый Волк, я в поросятах знаю толк"},
        ],
        showDesc: false,
        descText: "",
    };

    componentDidMount() {
        this.getObjects();
    }

    setMap = () => {
        function info(text) {
            alert(text);
        }

        window.ymaps.ready(() => {
            const myMap = new window.ymaps.Map('map', {
                center: [58.52461842, 31.26943415],
                zoom: 12
            });
            this.state.objects.map((object) => {
                let coords = object.coords.split(",");
                console.log(object.coords)
                let obj = new window.ymaps.Placemark(coords, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: `./images/map/${object.icon}.png`,
                    iconImageSize: [42, 42],
                    iconImageOffset: [0, 0]
                });
                myMap.geoObjects.add(obj)
                obj.events.add('click', () => {
                    this.setState(() => {
                        return {
                            showDesc: true,
                            descText: object.text,
                        }
                    })
                });
            });

        })
    }

    closeDesc = () => {
        this.setState(() => {
            return {
                showDesc: false,
                descText: "",
            }
        })
    }

    getObjects = async () => {
        const url = `${this.state.server}/getObjects/`;
        try {
            const response = await fetch(url, {
                method: 'GET', // или 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const json = await response.json();
            const data = JSON.parse(json.data);
            if(data !== undefined && data !== null) {
                this.setState(() => {
                    return {
                        objects: data,
                    }
                }, () => {
                    console.log(this.state.objects)
                    this.setMap();
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const {descText,showDesc} = this.state;
        return (
            <div className="map">
                {showDesc ?
                <div className="desc">
                   <div className="text">
                       {descText}
                   </div>
                    <div className="buttons">
                        <button className="adding">Построить маршрут</button>
                        <button onClick={this.closeDesc.bind(this)} className="close">Закрыть</button>
                    </div>
                </div>
                    : ""
                }
                <div id="map" style={{width: "100vw", height: "100vh"}}></div>
            </div>
        )
    }
}

export default App;