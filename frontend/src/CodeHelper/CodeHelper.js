import React, {useState} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { handleChange } from "../_helpers/utils";
import 'codemirror/mode/handlebars/handlebars';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/mode/javascript/javascript';
import "codemirror/addon/display/placeholder";
import "codemirror/addon/search/match-highlighter";

const CodeHelper = ({ value, store, onChange, placeholder="" }) => {

  const valueChanged = (editor) => {
    handleChange(editor, store)
  }

  return (
    <>
      <div className={'code-hinter codehinter-default-input'}>
        <CodeMirror
          value={typeof value === 'string' ? value : ''}
          fontSize="12"
          height={'100%'}
          options={{
            lineWrapping: true,
            lineNumbers: false,
            tabSize: 2,
            singleLine: true,
            highlightSelectionMatches: true,
            mode: 'handlebars',
            scrollbarStyle: null,
            placeholder
          }}
          readOnly={false}
          viewportMargin={Infinity}
          onChange={(editor) => valueChanged(editor)}
          onBlur={(editor) => {
            const value = editor.getValue()?.trimEnd();
            onChange(value)
          }}
        />
      </div>
    </>
  );
};

export default CodeHelper;
