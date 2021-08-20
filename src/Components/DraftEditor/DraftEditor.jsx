import React from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './draftEditor.scss'

export default class DraftEditor extends React.Component {
   constructor(props) {
      super(props);
      this.state = { editorState: EditorState.createEmpty() };

      this.onChange = (editorState) => {
         console.log('editorState ==>', editorState.toJS());
         this.setState({ editorState });
      }
   }
   render() {

      const { editorState } = this.state;

      return (
         <div
            id="editor-container"
            className="c-editor-container js-editor-container"
         >
            <div className="editor">
               < Editor
                  editorState={editorState}
                  onChange={this.onChange}
                  placeholder="писать текст здесь" />
            </div>
         </div>
      );
   }
};




