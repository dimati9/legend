import React, {Component} from 'react';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time


import './first.css';

class First extends Component {

    state = {
        places: null,
        posX: 0,
        length: 0,
        current: 0,
        showPlaces: false,
    }

    componentDidMount() {
        if(this.props.places !== null) {
            this.setState(() => {
                return {
                    places: this.props.places,
                    length: Object.keys(this.props.places).length,
                }
            })
        }
        console.log(this.props.places);
    }

    eventLogger = (e, data) => {
        console.log('Event: ', e);
        console.log('Data: ', data);
    };

    onDrag = (e,data) => {
        console.log(data.x);
    };

    onStart = (e,data) => {
        this.setState(() => {
            return {
                posX: data.x
            }
        })
    }

    onEnd = (e,data) => {
        console.log(e);
        let target = (e.path[0].localName !== "h3" && e.path[0].localName !== "p" && e.path[0].localName !== "img") ? e.path[0] : e.path[1];
        let offset = data.x - this.state.posX;
        if(offset > 50) {
            this.setAnim(target, false,data.x);
        }   else if(offset < -50) {
            this.setAnim(target,true,data.x);
        }   else {
            target.style.transform = "translate(0px,0px)"
        }
    }

    setAnim = (e, left = true, pos) => {
        if(left) {
            let i = pos;
            e.style.background = "red";
            let p = setInterval(() => {
                i-=10;
                e.style.transform = `translate(${i}px,0px)`
            }, 10)
            setTimeout(() => {
                clearInterval(p);
                e.remove();
            }, 500)

        }   else {
            let i = pos;
            e.style.background = "green";
            let p = setInterval(() => {
                i+=10;
                e.style.transform = `translate(${i}px,0px)`
            }, 10)
            setTimeout(() => {
                clearInterval(p);
                e.remove();
            }, 500)
        }
        this.setState(() => {
            return {
                current: this.state.current+1,
            }
        })
    }

    close = () => {
        this.setState(() => {
            return {
                showPlaces: true,
            }
        })
    }

    render() {
        const {places, length,current,showPlaces} = this.state;
        return (
            <div className="first">
                {showPlaces ? <div className="show-places">
                    <h3>У нас есть для тебя следующие маршруты:</h3>
                    <ul>
                        <a href="#/" onClick={this.props.closeFirst}>Тропа здоровья</a>
                        <a href="#/" onClick={this.props.closeFirst}>Мировые художники</a>
                        <a href="#/" onClick={this.props.closeFirst}>Тёмная история</a>
                        <a href="#/" onClick={this.props.closeFirst}>Сказки народов</a>
                        <a href="#/" onClick={this.props.closeFirst}>Речной причал</a>
                    </ul>
                </div> : ""}
                {current > 0 && current === length ?
                <div className="success">
                    <h2>Отлично, у нас как раз есть для тебя маршрут, посмотрим?</h2>
                    <div className="save">
                        <h3>Сохранить и улучшивать ваши предпочтения?</h3>
                        <h3>Авторизация</h3>
                        <a href="#/" onClick={this.close}>
                            <img src="https://sun9-43.userapi.com/impg/3hVGJ3kALIM7WsNBqS-2XnP2qE_P1LhzA0F9ag/VUGyvXpmTaw.jpg?size=380x282&quality=96&sign=69afd55130e1bbb7b229f96916ad0b69&type=album" alt=""/>
                        </a>
                        <h4>или</h4>
                        <button className="skip2"  onClick={this.close}>Пропустить</button>
                    </div>
                </div>
                    :
                    <>
                        <h1>Привет, давай знакомится!</h1>
                        <h2>Давай определим что тебе нравится?</h2>
                        <h3>Двигай объекты вправо или влево</h3>
                        <div className="pos">
                            <div className="left"></div>
                            <div className="right"></div>
                        </div>
                        <div className="elements">
                            {places !== null && Object.keys(places).map((number,i) => {
                                let object = places[i];
                                return (
                                    <>
                                        <Draggable
                                            axis="x"
                                            onStart={this.onStart}
                                            onDrag={() => {}}
                                            onStop={this.onEnd.bind(this)}
                                        >
                                            <div className="element">
                                                <h3>{object.name}</h3>
                                                <img srcSet={object.image} alt="image"/>
                                                <p>{object.text}</p>
                                            </div>
                                        </Draggable>
                                    </>
                                )
                            })}
                        </div>
                        <button className="skip"  onClick={this.close}>Пропустить</button>
                    </>
                }

            </div>
        )
    }
}

export default First;