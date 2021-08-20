import React, {Component} from 'react';

import './app.css';

class App extends Component {
    state = {
        serverLocal: "http://localhost:3100",
        server: "https://nov-legend.herokuapp.com",
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
                zoom: 12,
                controls: [],
                restrictMapArea: [
                    [58.52278425, 31.11547119],
                    [58.52354086, 31.35984110]
                ],

            }, {
                maxZoom: 12,
                minZoom: 9,
            });

            // Кнопка
            var adding = new window.ymaps.control.Button({
                data: {
                    // Зададим текст и иконку для кнопки.
                    content: "Добавить место",
                    // Иконка имеет размер 16х16 пикселей.
                    image: '/images/map/adding.png',
                    title: "Добавить место",
                },
                options: {
                    // Поскольку кнопка будет менять вид в зависимости от размера карты,
                    // зададим ей три разных значения maxWidth в массиве.
                    maxWidth: 300,
                }
            });
            myMap.controls.add(adding);

            adding.events.add('select', function (e) {
                myMap.behaviors
                    .disable(['drag', 'rightMouseButtonMagnifier'])
            })

            adding.events.add('deselect', function (e) {
                myMap.behaviors
                    .enable(['drag', 'rightMouseButtonMagnifier'])
            })

            // Событие добавление метки
            myMap.events.add('click', function (e) {
                if(adding.isSelected()) {
                    if (!myMap.balloon.isOpen()) {
                        var coords = e.get('coords');
                        myMap.balloon.open(coords, {
                            contentHeader:'Отличное место!',
                            contentBody:'<p>Координаты: ' + [
                                    coords[0].toPrecision(6),
                                    coords[1].toPrecision(6)
                                ].join(', ') + '</p>',
                            contentFooter:'<button class="addPlace">Добавить здесь место</button>'
                        });
                    }
                    else {
                        myMap.balloon.close();
                    }
                }

            });

            // Разбираем все объекты и размещаем на карте
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