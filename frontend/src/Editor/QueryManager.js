import React, { useState, useEffect } from "react";
import CodeHelper from "../CodeHelper/CodeHelper";
import { dataqueryService } from "../_services";

const styles = {
  button: {
    backgroundColor: "rgb(78, 60, 240)",
    color: "#f4f6fa",
    cursor: "pointer",
    fontSize: ".75em",
    borderRadius: "2px",
    width: "72px",
    height: "28px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "20px",
  },
};

const defaultOptions = {
  headers: [],
  body: [],
};

const QueryManager = ({
  toggleQueryEditor,
  selectedQuery,
  fetchDataQueries,
  store,
  appId,
  screens,
}) => {
  const [queryPreviewData, setQueryPreviewData] = useState(null);
  const [name, setName] = useState("");
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    const name = selectedQuery.name || "";
    const options = selectedQuery.options || {};
    setName(name);
    setOptions(options);
  }, [selectedQuery]);

  const renderRawData = () => {
    if (setQueryPreviewData) {
      return JSON.stringify(queryPreviewData).toString();
    }
    return "ooo";
  };

  const handleHeaderChange = (value, id, index) => {
    let newOptions;
    if (!options["headers"]) {
      newOptions = { ...options, headers: [[]] };
    } else {
      newOptions = { ...options };
    }
    newOptions["headers"][index][id] = value;
    setOptions(newOptions);
  };

  const handleBodyChange = (value, id, index) => {
    let newOptions;
    if (!options["body"]) {
      newOptions = { ...options, body: [[]] };
    } else {
      newOptions = { ...options };
    }
    newOptions["body"][index][id] = value;
    setOptions(newOptions);
  };

  const handleChange = (e) => {
    setOptions((options) => ({
      ...options,
      url: e.target.value,
    }));
  };

  const handleMethodChange = (e) => {
    setOptions((options) => ({
      ...options,
      method: e.target.value,
    }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const toggleOption = (option) => {
    const currentValue = options[option] ? options[option] : false;
    setOptions((options) => ({
      ...options,
      [option]: !currentValue,
    }));
  };

  const setScreenIdOptions = (value) => {
    setOptions((options) => ({
      ...options,
      screenId: value,
    }));
  };

  const createQuery = () => {
    dataqueryService.create(appId, name, options).then((data) => {
      data.text().then((value) => {
        const data = JSON.parse(value);
        fetchDataQueries();
        console.log(data);
      });
    });
  };

  const saveQuery = () => {
    dataqueryService.update(selectedQuery.id, name, options).then((data) => {
      data.text().then((value) => {
        fetchDataQueries()
      })
    })
  }

  const getScreenOptions = () => {
    let screenOptions = [];
    Object.keys(screens).forEach((key) => {
      screenOptions.push({
        name: screens[key],
        id: key,
      });
    });
    return screenOptions;
  };

  const addQuery = !Object.keys(selectedQuery).length;

  return (
    <div>
      <div
        style={{
          minHeight: "41px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "end",
        }}>
        <div style={{ margin: "auto 0" }}>
          {addQuery ? (
            <div
              style={styles.button}
              onClick={() => createQuery()}>
              Create
            </div>
          ) : (
            <div
              style={styles.button}
              onClick={() => saveQuery()}>
              Save
            </div>
          )}
          <span
            onClick={() => toggleQueryEditor()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: "15px",
            }}
            className="cursor-pointer m-3"
            data-tip="Hide query editor">
            <svg
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
      </div>
      <div style={{ padding: "0 8px" }}>
        <div style={{ marginRight: "20px" }}>
          <input
            style={{
              borderRadius: "0px",
              outlineColor: "#dadcde !important",
              border: "1px solid #dadcde",
              marginBottom: "10px",
            }}
            onChange={handleNameChange}
            placeholder="Name"
            value={name}
          />
          <select
            value={options.method || ""}
            onChange={handleMethodChange}
          >
            <option value={'get'}>
              GET
            </option>
            <option value={'post'}>
              POST
            </option>
          </select>
          <input
            style={{
              height: "26px",
              borderRadius: "0px",
              outlineColor: "#dadcde !important",
              border: "1px solid #dadcde",
              width: "100%",
            }}
            placeholder="API"
            onChange={handleChange}
            value={options.url || ""}
          />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}>
            <label>Run on screen load:</label>
            <input
              type="checkbox"
              onChange={() => toggleOption("runOnPageLoad")}
              checked={options.runOnPageLoad || false}
            />
            <select
              value={options.screenId}
              onChange={(event) => {
                setScreenIdOptions(event.target.value);
              }}>
              {getScreenOptions().map((screen, i) => {
                return (
                  <option
                    value={screen.id}
                    id={screen.name.name}
                    key={i}>
                    {screen.name.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>Headers</div>
          {(options["headers"] || [["", ""]]).map((option, i) => {
            return (
              <div
                key={"headers" + i}
                style={{ display: "flex" }}>
                <div style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
                  <CodeHelper
                    onChange={(value) => handleHeaderChange(value, 0, i)}
                    store={store}
                    value={option[0]}
                    key={"header" + name + i + 1}
                    placeholder={"Key"}
                  />
                </div>
                <div style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
                  <CodeHelper
                    onChange={(value) => handleHeaderChange(value, 1, i)}
                    store={store}
                    value={option[1]}
                    key={"header" + name + i + 2}
                    placeholder={"Value"}
                  />
                </div>
              </div>
            );
          })}
          <div>Body</div>
          {(options["body"] || [["", ""]]).map((option, i) => {
            return (
              <div
                key={"body" + i}
                style={{ display: "flex" }}>
                  <div style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
                    <CodeHelper
                      onChange={(value) => handleBodyChange(value, 0, i)}
                      store={store}
                      value={option[0]}
                      key={"body" + name + i + 1}
                      placeholder={"Key"}
                    />
                  </div>
                  <div style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
                    <CodeHelper
                      onChange={(value) => handleBodyChange(value, 1, i)}
                      store={store}
                      value={option[1]}
                      key={"body" + name + i + 2}
                      placeholder={"Value"}
                    />
                  </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            border: "solid rgba(0,0,0,0.125)",
            borderWidth: "1px 0px 1px 0px",
            marginTop: "10px",
          }}>
          <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
            Preview
          </div>
        </div>
        <div>{renderRawData()}</div>
      </div>
    </div>
  );
};

export default QueryManager;
