import _ from 'lodash';
import { dataqueryService } from '../_services';

export const resolveProperties = (definition, store, customResolvables) => {
  if (store) {
    return Object.entries(definition?.definition?.properties || {}).reduce(
      (properties, entry) => ({
        ...properties,
        ...{
          [entry[0]]: resolveReferences(entry[1].value, store, customResolvables)
        },
      }),
      {}
    );
  } else return {};
};

export const resolveStyles = (definition, store, customResolvables) => {
  if (store) {
    return Object.entries(definition?.definition?.styles || {}).reduce(
      (styles, entry) => ({
        ...styles,
        ...{
          [entry[0]]: resolveReferences(entry[1].value, store, customResolvables)
        },
      }),
      {}
    );
  } else return {};
}

export function getDynamicVariables(text) {
  const matchedParams = text.match(/\{\{(.*?)\}\}/g) || text.match(/\%\%(.*?)\%\%/g);
  return matchedParams;
}

export const resolveReferences = (object, store, customObjects) => {
  object = _.clone(object);
  const objectType = typeof object;
  switch (objectType) {
    case 'string': {
      if (object.startsWith('{{') && object.endsWith('}}')) {
        const code = object.replace('{{', '').replace('}}', '').split('.').join('?.');
        return resolveCode(code, store, customObjects, true);
      }

      const dynamicVariables = getDynamicVariables(object);

      if (dynamicVariables) {
        if (dynamicVariables.length === 1 && dynamicVariables[0] === object) {
          object = resolveReferences(dynamicVariables[0], store, customObjects);
        } else {
          for (const dynamicVariable of dynamicVariables) {
            const value = resolveReferences(dynamicVariable, store, customObjects);
            if (typeof value !== 'function') {
              object = object.replace(dynamicVariable, value);
            }
          }
        }
      }

      return object;
    }

    case 'object': {
      Object.keys(object).forEach((key) => {
        const resolved_object = resolveReferences(object[key], store, customObjects);
        object[key] = resolved_object;
      });
      return object;
    }

    default: {
      return object
    }
  }
}

const resolveCode = (code, store, customObjects = {}, isJsCode) => {
  let result = '';
  const evalFunction = Function(
    [
      'queries',
      'components',
      'variables',
      'params',
      ...Object.keys(customObjects)
    ],
    `return ${code || ''}`
  );
  result = evalFunction(
    isJsCode ? store.queries : undefined,
    isJsCode ? store.components : undefined,
    isJsCode ? store.variables : undefined,
    isJsCode ? store.params : undefined,
    ...Object.values(customObjects)
  );
  return result;
}


export const runQuery = (options) => {
  return dataqueryService.run(options)
}

const resolveQueryReferences = (query, store) => {
  query = _.cloneDeep(query)
  query.options.url = resolveReferences(query.options.url, store)
  if (query.options.headers) {
    const headers = query.options.headers.map((header) => {
      return header.map((item) => {
        return resolveReferences(item, store)
      })
    })
    query.options.headers = headers
  }
  if (query.options.body) {
    const body = query.options.body.map((b) => {
      return b.map((bodyItem) => {
        const resolvedBodyItem = resolveReferences(bodyItem, store)
        return resolvedBodyItem
      })
    })
    query.options.body = body
  }
  return query
}

export const handleRunQuery = (query, setStore, store) => {
  const newQuery = resolveQueryReferences(query, store)
  runQuery(newQuery?.options).then((data) => {
    data.text().then((value) => {
      const finalResult = JSON.parse(value);
      setStore((store) => {
        return ({
        ...store,
        queries: {
          ...store.queries,
          [query.name]: {
            ...store.queries[query.name],
            data: finalResult,
            isLoading: false
          }
        },
      })
    });
    });
  });
}

const handleShowModal = (modalName, show, setStore) => {
  setStore((store) => {
    return({
      ...store,
      components: {
        ...store.components,
        [modalName]: {
          ...store.components[modalName],
          show: show
        }
      }
    })
  })
}

export const computeComponentName = (componentType, currentComponents) => {
  const currentComponentsForKind = Object.values(currentComponents).filter(
    (component) => component.component.component === componentType
  );
  let found = false;
  let componentName = '';
  let currentNumber = currentComponentsForKind.length + 1;
  while (!found) {
    componentName = `${componentType.toLowerCase()}${currentNumber}`;
    if (
      Object.values(currentComponents).find((component) => component.component.name === componentName) === undefined
    ) {
      found = true;
    }
    currentNumber = currentNumber + 1;
  }

  return componentName;
}

const executeActionsForEventId = (eventName, component, options) => {
  const events = component?.definition?.events || [];
  const filteredEvents = events.filter((event) => event.eventId === eventName);
  for (const event of filteredEvents) {
    executeAction(event, options);
  }
}

const executeAction = (event, options) => {
  if (event) {
    switch (event.actionId) {
      case 'run-query': {
        const { queryId, queryName } = event;
        const {queries, setStore, store} = options;
        const query = queries.filter((query) => query.id === queryId)[0]
        handleRunQuery(query, setStore, store)
        return
      }

      case 'show-modal': {
        const {modal} = event;
        const {definitions, setStore} = options;
        const modalName = definitions[modal].component.name
        handleShowModal(modalName, true, setStore)
        return
      }

      case 'close-modal': {
        const {modal} = event;
        const {definitions, setStore} = options;
        const modalName = definitions[modal].component.name
        handleShowModal(modalName, false, setStore)
        return
      }

      case 'set-custom-variable': {
        const {setStore, customVariables, store} = options;
        const key = event.key
        const value = resolveReferences(event.value, store, customVariables)
        setStore((store) => {
          return({
            ...store,
            variables: {
              ...store.variables,
              [key]: value
            }
          })
        })
        return
      }

      case 'navigate-screen': {
        const {
          navigateToScreen,
          setStore,
          customVariables,
          store
        } = options;
        const screenId = event.screenId
        const screenName = event.screenName
        const paramKey = event.paramKey
        const paramValue = resolveReferences(event.paramValue, store, customVariables)
        setStore((store) => {
          return({
            ...store,
            params: {
              ...store.params,
              [screenName]: {
                ...store.params[screenName],
                [paramKey]: paramValue
              }
            }
          })
        })
        navigateToScreen(screenId)
      }
    }
  }
}

export const onEvent = (eventName, options) => {
  if (eventName === "onClick") {
    const {component} = options;
    executeActionsForEventId(eventName, component, options)
  }
}

export const findCard = (id, boxes) => {
  const box = boxes.filter((c) => c.id === id)[0];
    return {
      box,
      index: boxes.indexOf(box),
    };
}

export function canShowHint(editor, ignoreBraces = false) {
  if (!editor.hasFocus()) return false;

  const cursor = editor.getCursor();
  const line = cursor.line;
  const ch = cursor.ch;
  const value = editor.getLine(line);

  if (ignoreBraces && value.length > 0) return true;

  return value.slice(ch, ch + 2) === '}}' || value.slice(ch, ch + 2) === '%%';
}

export function computeCurrentWord(editor, _cursorPosition, ignoreBraces = false) {
  const cursor = editor.getCursor();
  const line = cursor.line;
  const value = editor.getLine(line);
  const sliced = value.slice(0, _cursorPosition);

  const delimiter = sliced.includes('{{') ? '{{' : sliced.includes('%%') ? '%%' : ' ';

  const splitter = ignoreBraces ? ' ' : delimiter;

  const split = sliced.split(splitter);
  const splittedWord = split.slice(-1).pop();

  // Check if the word still has spaces, to avoid replacing entire code
  const lastWord = splittedWord.split(' ').slice(-1).pop();

  return lastWord;
}

function getResult(suggestionList, query) {
  const result = suggestionList.filter((key) => key.includes(query));

  const suggestions = result.filter((key) => {
    const hintsDelimiterCount = countDelimiter(key, '.');
    const queryDelimiterCount = countDelimiter(query, '.');
    const hintDepth = queryDelimiterCount + 1;

    if (
      hintDepth !== queryDelimiterCount &&
      (hintsDelimiterCount === hintDepth || hintsDelimiterCount === queryDelimiterCount)
    ) {
      return true;
    }
  });

  function countDelimiter(string, delimiter) {
    var stringsearch = delimiter;

    var str = string;
    var count = 0;
    for (var i = (count = 0); i < str.length; count += +(stringsearch === str[i++]));

    return count;
  }

  return suggestions;
}

export const getSuggestionKeys = (refState) => {
  const state = _.cloneDeep(refState);
  const queries = state['queries'];

  const actions = [
    'runQuery',
    'setVariable',
    'unSetVariable',
    'showAlert',
    'logout',
    'showModal',
    'closeModal',
    'setLocalStorage',
    'copyToClipboard',
    'goToApp',
    'generateFile',
  ];
  
  // eslint-disable-next-line no-unused-vars
  _.forIn(queries, (query, key) => {
    if (!query.hasOwnProperty('run')) {
      query.run = true;
    }
  });

  const currentState = _.merge(state, { queries });
  const suggestionList = [];
  const map = new Map();

  const buildMap = (data, path = '') => {
    const keys = Object.keys(data);
    keys.forEach((key, index) => {
      const value = data[key];
      const _type = Object.prototype.toString.call(value).slice(8, -1);
      const prevType = map.get(path)?.type;

      let newPath = '';
      if (path === '') {
        newPath = key;
      } else if (prevType === 'Array') {
        newPath = `${path}[${index}]`;
      } else {
        newPath = `${path}.${key}`;
      }

      if (_type === 'Object') {
        map.set(newPath, { type: _type });
        buildMap(value, newPath);
      }
      if (_type === 'Array') {
        map.set(newPath, { type: _type });
        buildMap(value, newPath);
      } else {
        map.set(newPath, { type: _type });
      }
    });
  };

  buildMap(currentState, '');
  map.forEach((__, key) => {
    if (key.endsWith('run') && key.startsWith('queries')) {
      return suggestionList.push(`${key}()`);
    }
    return suggestionList.push(key);
  });

  return suggestionList;

}

export function makeOverlay(style) {
  return {
    // eslint-disable-next-line no-unused-vars
    token: function (stream, state) {
      var ch;
      if (stream.match('{{')) {
        while ((ch = stream.next()) != null)
          if (ch === '}' && stream.next() === '}') {
            stream.eat('}');
            return style;
          }
      }
      // eslint-disable-next-line no-empty
      while (stream.next() != null && !stream.match('{{', false)) {}
      return null;
    },
  };
}

export function generateHints(word, suggestions, isEnvironmentVariable = false, fromRunJs) {
  if (word === '') {
    return suggestions;
  }
  const hints = getResult(suggestions, word);

  return hints.filter((hint) => {
    if (isEnvironmentVariable) {
      return hint.startsWith('client') || hint.startsWith('server');
    } else {
      if (fromRunJs) return hint;
      return !hint.startsWith('client') && !hint.startsWith('server');
    }
  });
}

function keystrokeChecker(editor) {
  const keyPromise = new Promise((resolve, reject) => {
    editor.on('keyup', function (editor, event) {
      if (event.key == 'Enter' || event.key == 'Backspace') {
        resolve(true);
      }
      reject(false);
    });
  });
  return keyPromise;
}


export const handleChange = (editor, currentState, ignoreBraces = false) => {
  const suggestions = getSuggestionKeys(currentState);
  let state = editor.state.matchHighlighter;
  editor.addOverlay((state.overlay = makeOverlay(state.options.style)));
  const cursor = editor.getCursor();
  const currentWord = computeCurrentWord(editor, cursor.ch, false);
  const isEnvironmentVariable = editor.getValue().startsWith('%%') ?? false;
  const hints =
    currentWord !== '' ? generateHints(currentWord, suggestions, isEnvironmentVariable, false) : [];

  const setCursorPosition = () => {
    const currentValue = editor.getValue();
    if (currentValue.slice(-4) === '{{}}' || currentValue.slice(-4) === '%%') {
      editor.setCursor({ line: 0, ch: currentValue.length - 2 });
    }
  };

  setCursorPosition();

  const options = {
    alignWithWord: false,
    completeSingle: false,
    hint: function () {
      return {
        from: { line: cursor.line, ch: cursor.ch - currentWord.length },
        to: cursor,
        list: hints,
      };
    },
  };
  if (canShowHint(editor, ignoreBraces)) {
    const keystrokeValue = keystrokeChecker(editor)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    const keystrokeCaller = async () => {
      const returnValue = await keystrokeValue;
      if (!returnValue) editor.showHint(options);
    };
    keystrokeCaller();
  }
}