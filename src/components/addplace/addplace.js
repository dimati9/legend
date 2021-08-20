import React, {Component} from 'react';
import { CKEditor } from 'ckeditor4-react';


import './addplace.css';

class AddPlace extends Component {
    state = {
        name: "",
        text: "",
        icon: "",
    }

    componentDidMount() {

    }

    changeName = (e) => {
        let text = e.target.value;
        this.setState(() => {
            return {
                name: text,
            }
        })
    }

    changeText = (e) => {
        let text = e.editor.getData().trim();
        this.setState(() => {
            return {
                text: text,
            }
        })
    }




    changeUrl= (e) => {
        let url = e.target.value;
        this.setState(() => {
            return {
                icon: url,
            }
        })
    }

    check = (e) => {
        e.preventDefault();
        this.props.add(this.state);
    }

    render() {
        return (
            <div className="add-place">
                <form>
                    <label>
                        <p>Название</p>
                        <input type="text" onChange={this.changeName}/>
                    </label>
                    <label>
                        <p>URL иконки</p>
                        <input type="text" onChange={this.changeUrl}/>
                    </label>
                    <label>
                        <p>Текст</p>
                        <CKEditor
                            initData={<p>Hello from CKEditor 4!</p>}
                            onChange={this.changeText}
                        />
                    </label>
                    <div className="buttons">
                        <button onClick={this.check}>Сохранить</button>
                        <button className={"add-place__close"} onClick={this.props.closePlace}>Закрыть</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddPlace;