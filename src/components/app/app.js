import React, {Component} from 'react';
import AddPlace from "../addplace";
import First from "../first";

import './app.css';

class App extends Component {
    state = {
        // server: "http://localhost:3100",
        server: "https://nov-legend.herokuapp.com",
        objects: null,
        objects2: [
            {name:"Fox", coord:[58.52461842, 31.16543115], icon:"fox",desc:"Красивая лисичка здесь пробегала"},
            {name:"Wolf", coord:[58.5661842, 31.36943415], icon:"wolf",desc:"Я злой и страшный серый Волк, я в поросятах знаю толк"},
        ],
        showDesc: false,
        descText: "",
        coords: null,
        place: false,
        message: "",
        places: null,
        first: true,
        intro: false,
    };

    componentDidMount() {
        this.getPlaces();
        this.getObjects();
        let this2 = this;
        window.addPlace = function (coords) {
            this2.addPlace();
        }
    }


    addPlace = () => {
        console.log(this.state.coords);
        this.setState(() => {
            return {
                place: true,
            }
        })
    };

    closePlace = () => {
        this.setState(() => {
            return {
                place: false,
            }
        })
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
            window.myMap = myMap;

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
            window.adding = adding;
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
            myMap.events.add('click', (e) => {
                if(adding.isSelected()) {
                    if (!myMap.balloon.isOpen()) {
                        var coords2 = e.get('coords');
                        this.setState(() => {
                            return {
                                coords: coords2,
                            }
                        })
                        myMap.balloon.open(coords2, {
                            contentHeader:'Отличное место!',
                            contentBody:'<p>Координаты: ' + [
                                coords2[0].toPrecision(6),
                                coords2[1].toPrecision(6)
                                ].join(', ') + '</p>',
                            contentFooter:'<button class="addPlace" onclick="addPlace()">Добавить здесь место</button>'
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
                    iconImageHref: `${object.icon}`,
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
            window.we = new window.ymaps.Placemark([58.52461842, 31.26943415], {
                balloonContent: '<strong>Вы здесь</strong>'
            }, {
                preset: 'islands#icon',
                iconColor: '#0095b6'
            });
            myMap.geoObjects.add(window.we);

            var multiRoute = new window.ymaps.multiRouter.MultiRoute({
                // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
                referencePoints: [
                    [58.52461842, 31.26943415],
                    [58.52461842, 31.16543115],
                    [58.544906109746826,31.22789209677736],
                    [58.5661842, 31.36943415], //wolf
                    //wolf
                ],
                params: {
                    viaIndexes: [1],
                }
            }, {
                // Автоматически устанавливать границы карты так,
                // чтобы маршрут был виден целиком.
                boundsAutoApply: true
            });
            myMap.geoObjects.add(multiRoute);

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

    closeFirst = () => {
        this.setState(() => {
            return {
                first: false,
                intro: true,
            }
        })
    }


    getPlaces = async () => {
        const url = `${this.state.server}/getPlaces/`;
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
                        places: data,
                    }
                }, () => {
                    console.log(this.state.places)
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    addObject = async(object) => {
        console.log(object);
        console.log(this.state.coords);

        const data = Object.assign(object,{coords: this.state.coords})

        const url = `${this.state.server}/newObject/`;
        try {
            const response = await fetch(url, {
                method: 'POST', // или 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const json = await response.json();
            console.log(json);
            if (json.ok === 1) {
                this.getObjects();
                this.closePlace();
                this.messageSet("Объект успешно добавлен", 3);
                window.adding.deselect();
                window.myMap.balloon.close();
            }
        } catch (error) {
            console.log(error);
        }
    }

    messageSet = (msg, time = 2) => {
        this.setState(() => {
            return {
                message: msg,
            }
        }, () => {
            setTimeout(() => {
                this.setState(() => {
                    return {
                        message: "",
                    }
                })
            }, time*1000)
        });
    }

    createMarkup = () => {
        return {__html: this.state.descText};
    }

    removeParent = (e) => {
        e.target.parentElement.remove();
    }

    render() {
        const {descText,showDesc,place, message,first, places,intro} = this.state;
        return (
            <div className="map">
                {first && places !== null ? <First closeFirst={this.closeFirst} places={places} /> : ""}
                <>
                    {intro ?
                    <div className="intro">
                        <div className="icon">
                            <h3>Нажимай на эконку любого места и читай описание о нём</h3>
                            <button className="ok" onClick={this.removeParent}>Ок</button>
                        </div>
                        <div className="added">
                            <h3>Если хочешь разместить новый объект:</h3>
                            <p>Зажми кнопку Добавить место и клики по карте</p>
                            <p>Заполни поля в редакторе и место сразу отобразится</p>
                            <button className="ok"  onClick={this.removeParent}>Ок</button>
                        </div>
                    </div>
                    : ""}
                    {message !== "" ? <div className="msg">{message}</div> : ""}
                    {showDesc && !place ?
                        <div className="desc">
                            <div className="text" dangerouslySetInnerHTML={this.createMarkup()}>

                            </div>
                            <div className="buttons">
                                <button className="adding">Построить маршрут</button>
                                <button onClick={this.closeDesc.bind(this)} className="close">Закрыть</button>
                            </div>
                        </div>
                        : ""
                    }
                    {place ?
                        <AddPlace add={this.addObject} closePlace={this.closePlace} />
                        : ""
                    }
                    <div id="map" style={{width: "100vw", height: "100vh"}}></div>
                </>

            </div>
        )
    }
}

export default App;