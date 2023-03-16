import React, { useEffect, useState, useCallback } from "react";
import WidgetManager from "../WidgetManager";
import Container from "./Container";
import { CustomDragLayer } from "./CustomDragLayer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { widgets } from "../WidgetManager/widgetConfig";
import { appService, dataqueryService } from "../_services";
import { isEqual, cloneDeep } from "lodash";
import { Snack } from "snack-sdk";
import createDefault from "./Components/Defaults";
import { diff } from "deep-object-diff";
import QueryManager from "./QueryManager";
import WidgetInspector from "../WidgetManager/WidgetInspector";
import _ from "lodash";
import { handleRunQuery, onEvent } from "../_helpers/utils";
import { componentTypes } from "../WidgetManager/components";
import ComponentTree from "./ComponentTree";
import { AiOutlinePlus, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineSetting } from "react-icons/ai";
import { findCard } from "../_helpers/utils";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuid } from 'uuid';
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import AppSettings from "./AppSettings";
import ScreenTree from "./ScreenTree";
import { Link } from "react-router-dom";

const defaultStore = {
  queries: {},
  components: {},
  variables: {},
  params: {}
};

const defaultSettings = {
  name: "my-app",
  slug: "my-app",
  androidPackage: "com.appjam.myapp",
  projectId: "",
};

const defaults = createDefault();

function Editor(props) {

  const defaultScreenId = uuid();

  const defaultAppDefinition = {
    homeScreenId: defaultScreenId,
    screens: {
      [defaultScreenId]: {
        components: {},
        handle: 'home',
        name: 'Home',
      }
    }
  }

  const defaultAppOrder = {
    homeScreenId: defaultScreenId,
    screens: {
      [defaultScreenId]: {
        components: [],
        handle: 'home',
        name: 'Home',
      }
    }
  }

  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [boxes, setBoxes] = useState(defaultAppOrder);
  const [fetched, isFetched] = useState(false);
  const [showQueryEditor, setShowQueryEditor] = useState(false);
  const [appDefinition, setAppDefinition] = useState(defaultAppDefinition);
  const [settings, setSettings] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [store, setStore] = useState(defaultStore);
  const [dataQueries, setDataQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState({});
  const [snackTemplate, setSnackTemplate] = useState(defaults);
  const [showComponentDirectory, setShowComponentDirectory] = useState(false);
  const [currentScreenId, setCurrentScreenId] = useState(defaultScreenId);
  const [newScreenName, setNewScreenName] = useState('')

  const appId = props.match.params.id;

  const numberOfComponent = (elements = []) => {
    let comps = 0;
    elements.forEach((ele) => {
      comps++;
      if (ele?.components && ele?.components.length > 0) {
        comps += numberOfComponent(ele.components);
      }
    });
    return comps;
  };

  const totalComponents = numberOfComponent(boxes?.screens[currentScreenId]?.components || []);

  const [snack] = useState(
    () =>
      new Snack({
        sdkVersion: '46.0.0',
        ...defaults,
      })
  );

  const [snackState, setSnackState] = useState(snack.getState());

  useEffect(() => {
    const listeners = [
      snack.addStateListener((state, prevState) => {
        console.log("State changed: ", diff(prevState, state));
        setSnackState(state);
      }),
      snack.addLogListener(({ message }) => console.log(message)),
    ];
    return () => listeners.forEach((listener) => listener());
  }, [snack]);

  useEffect(() => {
    snack.updateFiles(snackTemplate.files);
  }, [snackTemplate]);

  const {
    files,
    url,
    deviceId,
    online,
    onlineName,
    connectedClients,
    name,
    description,
    sdkVersion,
    webPreviewURL,
  } = snackState;

  const runQueries = (queries) => {
    queries.forEach((query) => {
      setStore((store) => {
        return {
          ...store,
          queries: {
            ...store.queries,
            [query.name]: {
              ...store.queries[query.name],
              isLoading: true,
              data: [],
            },
          },
        };
      });
      if (!query.options.runOnPageLoad && query.options.screenId !== currentScreenId) return;
      handleRunQuery(query, setStore, store);
    });
  };

  const fetchDataQueries = () => {
    dataqueryService.getAll(appId).then((data) => {
      data.text().then((value) => {
        const data = JSON.parse(value);
        setDataQueries(data);
        setSelectedQuery(data[0] || {});
      });
    });
  };

  const computeComponentState = (components = {}) => {
    let componentState = {};
    const currentComponents = store.components;
    Object.keys(components).forEach((key) => {
      const component = components[key];
      const componentMeta = componentTypes.find(
        (comp) => comp.component === component?.component?.component
      );

      const existingComponentName = Object.keys(currentComponents).find(
        (comp) => currentComponents[comp].id === key
      );
      const existingValues = currentComponents[existingComponentName];
      componentState[component?.component?.name] = {
        ...componentMeta.exposedVariables,
        id: key,
        ...existingValues,
      };
    });
    setStore((store) => ({
      ...store,
      components: {
        ...componentState,
      },
    }));
  };

  const fetchApp = () => {
    appService.getApp(appId).then((data) => {
      data.text().then((value) => {
        const data = JSON.parse(value);
        const appOrder = _.defaults(data?.order, defaultAppOrder)
        const definition = _.defaults(data?.definition, defaultAppDefinition);
        const settings = _.defaults(data?.settings, defaultSettings);
        const dataQueries = data?.data_queries;
        const homeScreenId = definition.homeScreenId;
        setCurrentScreenId(homeScreenId)
        setBoxes(appOrder);
        setAppDefinition(definition);
        setSettings(settings);
        computeComponentState(definition.screens[homeScreenId].components);
        runQueries(dataQueries);
        fetchDataQueries();
        isFetched(true);
      });
    });
  };

  const saveApp = (newBoxes) => {
    appService
      .save(appId, {
        order: newBoxes,
      })
      .then((data) => {
        console.log("====");
        data.text().then((text) => {
          // console.log(JSON.parse(text))
          if (online) {
            previewApp()
          }
        });
      });
  };

  const saveAppDefinition = (newDefinition) => {
    appService
      .saveDefinition(appId, {
        definition: newDefinition,
      })
      .then((data) => {
        console.log("++++");
        data.text().then((text) => {
          // console.log(JSON.parse(text))
          if (online) {
            previewApp()
          }
        });
      });
  };

  useEffect(() => {
    fetchApp();
  }, []);

  const parentAppOrderChanged = (newBoxes) => {
    if (isEqual(boxes.screens[currentScreenId]?.components, newBoxes)) return;
    const newAppOrder = _.cloneDeep(boxes);
    newAppOrder.screens[currentScreenId].components = newBoxes
    setBoxes(newAppOrder);
    saveApp(newAppOrder);
  };

  const parentDefinitionChanged = (newDefinition) => {
    if (isEqual(appDefinition.screens[currentScreenId].components, newDefinition)) return;
    const newAppDefinition = _.cloneDeep(appDefinition);
    newAppDefinition.screens[currentScreenId].components = newDefinition
    setAppDefinition(newAppDefinition);
    saveAppDefinition(newAppDefinition);
  };

  const goOffline = () => {
    snack.setOnline(!online);
  }

  const handlePreviewApp = async () => {
    console.log("preview pressed");
    if (!online) {
      await previewApp()
      console.log(url);
      snack.setOnline(!online);
    }
  }

  const previewApp = async () => {
    return appService.previewApp(appId).then((data) => {
      data.text().then((value) => {
        const appTemplate = createDefault(value);
        setSnackTemplate(appTemplate);
      });
    });
  };

  const publishApp = () => {
    console.log("publish pressed");
    appService.buildApp(appId).then((data) => {
      console.log("done");
    });
  };

  const toggleQueryEditor = () => {
    setShowQueryEditor(!showQueryEditor);
  };

  const navigateToScreen = (id) => {
    setSelectedComponent(null)
    setCurrentScreenId(id)
  }

  const handleEvents = (eventName, options) => {
    options["setStore"] = setStore;
    options["queries"] = dataQueries;
    options["definitions"] = appDefinition.screens[currentScreenId].components;
    options["store"] = store;
    options["navigateToScreen"] = navigateToScreen;
    onEvent(eventName, options);
  };

  const componentDefinitionChanged = (id, newDefinition) => {
    const newAppDefinition = _.cloneDeep(appDefinition.screens[currentScreenId].components);
    newAppDefinition[id] = newDefinition;
    parentDefinitionChanged(newAppDefinition)
  };

  const handleOnComponentOptionChanged = (component, optionName, value) => {
    const componentName = component.name;
    const components = store.components;
    let componentData = components[componentName];
    componentData = componentData || {};
    componentData[optionName] = value;
    setStore((store) => ({
      ...store,
      components: {
        ...store.components,
        [componentName]: componentData,
      },
    }));
  };

  const deleteChildComponents = (childBoxes, newDefinition) => {
    if (childBoxes?.components && childBoxes?.components.length > 0) {
      const cBoxes = childBoxes?.components;
      cBoxes.forEach((comp, i) => {
        deleteChildComponents(cBoxes[i], newDefinition);
        delete newDefinition[comp.id];
      });
    } else {
      return;
    }
  };

  const deleteNestedComponents = (id, boxes, definition) => {
    const { index } = findCard(id, boxes);
    if (index === -1) {
      for (let obj of boxes) {
        if (obj?.components && obj?.components.length > 0) {
          const found = deleteNestedComponents(id, obj.components, definition);
          if (found) break;
        }
      }
    } else {
      deleteChildComponents(boxes[index], definition);
      delete definition[id];
      boxes.splice(index, 1);
      return true;
    }
  };

  const removeComponent = (id) => {
    setSelectedComponent(null);
    const newBoxes = cloneDeep(boxes.screens[currentScreenId]?.components);
    const newDefinition = { ...appDefinition.screens[currentScreenId].components };
    deleteNestedComponents(id, newBoxes, newDefinition);
    parentAppOrderChanged(newBoxes);
    parentDefinitionChanged(newDefinition);
  };

  const removeScreen = (id) => {
    setCurrentScreenId(appDefinition.homeScreenId)
    const newBoxes = cloneDeep(boxes);
    const newDefinition = cloneDeep(appDefinition)
    delete newBoxes.screens[id]
    delete newDefinition.screens[id]
    setBoxes(newBoxes);
    saveApp(newBoxes);
    setAppDefinition(newDefinition);
    saveAppDefinition(newDefinition);
  }

  const addNewScreen = (name) => {
    const screenName = name
    const handleName = _.kebabCase(name.toLowerCase())
    const newScreenId = uuid()
    const newAppDefinition = {
      ...appDefinition,
      screens: {
        ...appDefinition.screens,
        [newScreenId]: {
          name: screenName,
          handle: handleName,
          components: {},
        }
      }
    }
    
    const newAppOrder = {
      ...boxes,
      screens: {
        ...boxes.screens,
        [newScreenId]: {
          name: screenName,
          handle: handleName,
          components: [],
        }
      }
    }

    setAppDefinition(newAppDefinition);
    setBoxes(newAppOrder);

    saveAppDefinition(newAppDefinition);
    saveApp(newAppOrder);
  }

  const popover = (
    <Popover
      id="popover-basic"
      style={{ width: "150px", maxWidth: "390px" }}>
      <Popover.Body style={{ padding: "10px 0.5rem" }}>
        {online && <QRCodeSVG value={url} />}
        <div style={{fontSize: '12px', marginTop: '5px'}}>
          Download <a style={{textDecoration: 'underline'}} href="https://expo.dev/client" target="_blank">Expo Go</a> to Preview.
        </div>
        {online && <div
          style={{
            backgroundColor: "rgba(78, 60, 240, 0.1)",
            color: "#4E3CF0",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: ".75em",
            borderRadius: "4px",
            fontWeight: 500,
            textAlign: 'center',
            marginTop: '10px'
          }}
          onClick={() => goOffline()}
          >
            Go Offline
          </div>}
          {online && <div
          style={{
            backgroundColor: "rgba(78, 60, 240, 0.1)",
            color: "#4E3CF0",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: ".75em",
            borderRadius: "4px",
            fontWeight: 500,
            textAlign: 'center',
            marginTop: '10px'
          }}
          onClick={() => previewApp()}
          >
            Refresh
          </div>}
      </Popover.Body>
    </Popover>
  );

  const screenPopover = (
    <Popover
      id="popover-basic"
      >
        <Popover.Body style={{ padding: "10px 0.5rem" }}>
          <input
            value={newScreenName}
            onChange={(e) => setNewScreenName(e.target.value)}
          />
          <div
            style={{
              backgroundColor: "#4E3CF0",
              color: "#ffff",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: ".75em",
              borderRadius: "4px",
              fontWeight: 500,
              width: 'min-content',
              marginTop: '10px'
            }}
            onClick={() => addNewScreen(newScreenName)}>
            Save
          </div>
        </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <div className="header">
        <header
          style={{
            height: "45px",
            backgroundColor: "#fff",
            boxShadow: "inset 0 -1px 0 0 rgb(101 109 119 / 16%)",
            display: "flex",
            flexWrap: "inherit",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
          }}>
            <Link to={'/'}>
              <img
                style={{ marginLeft: "10px" }}
                src="/images/icons/logo.svg"
              />
          </Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "rgba(78, 60, 240, 0.1)",
                color: "#4E3CF0",
                padding: "4px 6px",
                cursor: "pointer",
                fontSize: ".75em",
                borderRadius: "4px",
              }}
              onClick={() => setShowSettings(true)}>
              <AiOutlineSetting size="1.7em" />
            </div>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              rootClose
              overlay={popover}>
              <div
                style={{
                  backgroundColor: "rgba(78, 60, 240, 0.1)",
                  color: "#4E3CF0",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: ".75em",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
                onClick={() => handlePreviewApp()}>
                {online ? (
                  <AiOutlineEye
                    style={{ marginRight: "3px" }}
                    size="1.5em"
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    style={{ marginRight: "3px" }}
                    size="1.5em"
                  />
                )}
                {"Preview"}
              </div>
            </OverlayTrigger>
            {/* <div
              style={{
                backgroundColor: "#4E3CF0",
                color: "#ffff",
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: ".75em",
                borderRadius: "4px",
                fontWeight: 500,
              }}
              onClick={() => publishApp()}>
              Publish
            </div> */}
          </div>
        </header>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="editor wrapper">
          <div className="sub-section">
            <div className="editor-sidebar-left">
              <div
                style={{
                  border: "solid rgba(0, 0, 0, 0.125)",
                  borderWidth: "0px 0px 1px 0px",
                  paddingBottom: '25px'
                }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 4px 8px 12px",
                  }}>
                  <span>Screens</span>
                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      rootClose
                      overlay={screenPopover}
                    >
                      <span><AiOutlinePlus /></span>
                    </OverlayTrigger>
                </div>
                <ScreenTree
                  appDefinition={appDefinition}
                  setCurrentScreenId={setCurrentScreenId}
                  homeScreenId={appDefinition.homeScreenId}
                  removeScreen={removeScreen}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 4px 8px 12px",
                }}>
                <span>Components</span>
                <span
                  onClick={() =>
                    setShowComponentDirectory(!showComponentDirectory)
                  }>
                  <AiOutlinePlus />
                </span>
              </div>
              <ComponentTree
                setSelectedComponent={setSelectedComponent}
                boxes={boxes.screens[currentScreenId]?.components}
                appDefinition={
                  appDefinition.screens[currentScreenId].components
                }
                selectedComponent={selectedComponent}
                removeComponent={removeComponent}
              />
            </div>
            {showComponentDirectory && (
              <div className="component-left">
                <WidgetManager componentTypes={widgets} />
              </div>
            )}
            <div
              className="main main-editor-canvas"
              id="main-editor-canvas"
              onClick={(e) => {
                setSelectedComponent(null);
                setShowComponentDirectory(null);
              }}>
              <div className="canvas-container align-items-center">
                <div
                  className="canvas-area"
                  style={{
                    width: "358px",
                    maxWidth: "1292px",
                    backgroundColor: "#ffff",
                    overflow: "auto",
                    borderRadius: "40px",
                    border: "solid 4px #3f485a",
                    boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
                    marginTop: "30px",
                    height: "600px",
                    marginLeft: "500px",
                  }}>
                  <div
                    className="fixed-canvas"
                    style={{
                      height: "600px",
                      width: "350px",
                      position: "relative",
                    }}>
                    <div
                      className="real-canvas"
                      style={{
                        minHeight: 600,
                        maxWidth: 1292,
                        maxHeight: 2400,
                        backgroundColor: "#ffff",
                        position: "relative",
                        display: "grid",
                      }}>
                      {fetched && (
                        <Container
                          setSelectedComponent={setSelectedComponent}
                          selectedComponent={selectedComponent}
                          setHoveredComponent={setHoveredComponent}
                          hoveredComponent={hoveredComponent}
                          parentAppOrderChanged={parentAppOrderChanged}
                          parentDefinitionChanged={parentDefinitionChanged}
                          order={boxes.screens[currentScreenId]?.components}
                          definition={
                            appDefinition.screens[currentScreenId].components
                          }
                          store={store}
                          componentsLength={totalComponents}
                          onComponentOptionChanged={
                            handleOnComponentOptionChanged
                          }
                          onEvent={handleEvents}
                          removeComponent={removeComponent}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <CustomDragLayer />
              </div>
            </div>
            <AppSettings
              show={showSettings}
              onHide={() => setShowSettings(false)}
              settings={settings}
              setSettings={setSettings}
              appid={appId}
            />
            {!showQueryEditor ? (
              <div
                className="query-pane"
                style={{
                  height: 40,
                  background: "#fff",
                  padding: "8px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <h5 className="mb-0">QUERIES</h5>
                <span
                  onClick={() => toggleQueryEditor()}
                  className="cursor-pointer m-1"
                  data-tip="Show query editor">
                  <svg
                    style={{ transform: "rotate(180deg)" }}
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 1L9 9L17 1"
                      stroke="#61656F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            ) : (
              <div
                className="query-pane"
                style={{
                  height: "50%",
                }}>
                <div
                  style={{ display: "flex", flexWrap: "wrap", height: "100%" }}>
                  <div
                    style={{
                      width: "28%",
                      border: "solid rgba(0, 0, 0, 0.125)",
                      borderWidth: "0px 1px 0px 0px",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px",
                      }}>
                      <h5 className="mb-0">QUERIES</h5>
                      <div
                        onClick={() => {
                          setSelectedQuery({});
                        }}>
                        <AiOutlinePlus />
                      </div>
                    </div>
                    <div>
                      {dataQueries.map((query, i) => (
                        <div
                          className="queryItem"
                          style={{
                            margin: "0 8px",
                            borderRadius: "4px",
                            background:
                              query.id === selectedQuery.id ? "#d2ddec" : "",
                          }}
                          key={i}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "8px",
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              setSelectedQuery(query);
                            }}
                            >
                            <div>
                              {query.name}
                            </div>
                            <div
                              onClick={async () => {
                                await dataqueryService.remove(query.id);
                                fetchDataQueries();
                              }}>
                              <img src="/images/icons/query-trash-icon.svg" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: "72%" }}>
                    <QueryManager
                      toggleQueryEditor={toggleQueryEditor}
                      setStore={setStore}
                      selectedQuery={selectedQuery}
                      fetchDataQueries={fetchDataQueries}
                      store={store}
                      appId={appId}
                      screens={appDefinition.screens}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="editor-sidebar">
              {selectedComponent ? (
                <div>
                  <WidgetInspector
                    definition={
                      appDefinition.screens[currentScreenId].components
                    }
                    selectedComponent={selectedComponent}
                    componentDefinitionChanged={componentDefinitionChanged}
                    dataQueries={dataQueries}
                    store={store}
                    screens={appDefinition.screens}
                  />
                </div>
              ) : (
                <div>
                  Properties
                  <div>No Component selected</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default Editor;
