import React, { useEffect, useState } from "react";
import _ from "lodash";
import { componentTypes } from "./components";
import { ActionTypes } from "../Editor/ActionTypes";
import Icon from "./Icon";
import CodeHelper from "../CodeHelper/CodeHelper";

const EventManager = ({
  component,
  eventsChanged,
  componentMeta,
  dataQueries,
  definition,
  screens
}) => {
  const events = component.component.definition.events || [];
  const possibleEvents = Object.keys(componentMeta.events);
  let actionOptions = ActionTypes.map((action) => {
    return { name: action.name, value: action.id };
  });
  const addEvent = () => {
    let newEvents = _.cloneDeep(component.component.definition.events);
    newEvents.push({
      eventId: Object.keys(componentMeta.events)[0],
      actionId: "show-alert",
      message: "Hello world!",
      alertType: "info",
    });
    eventsChanged(newEvents);
  };
  const removeHandler = (index) => {
    let newEvents = component.component.definition.events;
    newEvents.splice(index, 1);
    eventsChanged(newEvents);
  };

  const handleSelectionChange = (index, paramValues) => {
    let newEvents = _.cloneDeep(component.component.definition.events);
    let updatedEvent = newEvents[index];
    paramValues.forEach((item) => {
      updatedEvent[item.param] = item.value
    })
    newEvents[index] = updatedEvent;
    eventsChanged(newEvents);
  };

  const getModalOptions = () => {
    let modalOptions = [];
    Object.keys(definition || {}).forEach((key) => {
      if (definition[key].component.component === "Modal") {
        modalOptions.push({
          name: definition[key].component.name,
          value: key,
        });
      }
    });
    return modalOptions;
  };

  const getScreenOptions = () => {
    let screenOptions = [];
    Object.keys(screens).forEach((key) => {
      screenOptions.push({
        name: screens[key],
        id: key
      })
    })
    return screenOptions
  }
  return (
    <div>
      <div
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgba(0, 0, 0, 0.125)",
          borderRadius: "4px",
          padding: "5px",
          cursor: "pointer",
          display: "inline-block",
          marginBottom: "10px",
        }}
        onClick={addEvent}>
        + Add handler
      </div>
      {events.map((event, i) => {
        return (
          <div key={i}>
            <select
              value={event.eventId}
              onChange={(event) =>
                handleSelectionChange(i, [
                  { param: "eventId", value: event.target.value },
                ])
              }>
              {possibleEvents.map((pevent, i) => {
                return (
                  <option
                    key={i}
                    value={pevent}>
                    {componentMeta.events[pevent].displayName}
                  </option>
                );
              })}
            </select>
            <select
              value={event.actionId}
              onChange={(event) =>
                handleSelectionChange(i, [
                  { param: "actionId", value: event.target.value },
                ])
              }>
              {actionOptions.map((action, i) => {
                return (
                  <option
                    key={i}
                    value={action.value}>
                    {action.name}
                  </option>
                );
              })}
            </select>
            <div>Query</div>
            <select
              value={event.queryId}
              onChange={(event) => {
                const value = event.target.value;
                const index = event.target.selectedIndex;
                const el = event.target.childNodes[index];
                const option = el.getAttribute("id");
                handleSelectionChange(i, [
                  { param: "queryId", value: value },
                  { param: "queryName", value: option },
                ]);
              }}>
              {dataQueries.map((query, i) => {
                return (
                  <option
                    value={query.id}
                    id={query.name}
                    key={i}>
                    {query.name}
                  </option>
                );
              })}
            </select>
            <div>Modals</div>
            <select
              value={event.modal}
              onChange={(event) => {
                const value = event.target.value;
                handleSelectionChange(i, [{ param: "modal", value: value }]);
              }}>
              {getModalOptions().map((modal, i) => {
                return (
                  <option
                    value={modal.value}
                    key={i}>
                    {modal.name}
                  </option>
                );
              })}
            </select>
            <div>Screen</div>
            <select
              value={event.screenId}
              onChange={(event) => {
                const value = event.target.value;
                const index = event.target.selectedIndex;
                const el = event.target.childNodes[index];
                const option = el.getAttribute("id");
                handleSelectionChange(i, [
                  { param: "screenId", value: value },
                  { param: "screenName", value: option },
                ]);
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
            <div>Param Variables</div>
            <input
              value={event.paramKey || ""}
              type="text"
              onChange={(e) =>
                handleSelectionChange(i, [
                  { param: "paramKey", value: e.target.value },
                ])
              }
              placeholder="Key"
            />
            <input
              value={event.paramValue || ""}
              type="text"
              onChange={(e) =>
                handleSelectionChange(i, [
                  { param: "paramValue", value: e.target.value },
                ])
              }
              placeholder="Value"
            />
            <div>Variables</div>
            <input
              value={event.key || ""}
              type="text"
              onChange={(e) =>
                handleSelectionChange(i, [
                  { param: "key", value: e.target.value },
                ])
              }
              placeholder="Key"
            />
            <input
              value={event.value || ""}
              type="text"
              onChange={(e) =>
                handleSelectionChange(i, [
                  { param: "value", value: e.target.value },
                ])
              }
              placeholder="Value"
            />
            <div
              style={{ color: "#ea6c76", cursor: 'pointer' }}
              onClick={() => removeHandler(i)}>
              Delete
            </div>
          </div>
        );
      })}
    </div>
  );
};

const WidgetInspector = ({
  definition,
  selectedComponent,
  componentDefinitionChanged,
  dataQueries,
  store,
  screens
}) => {
  const component = definition[selectedComponent];
  const componentMeta = componentTypes.find(
    (comp) => comp.component === component?.component?.component
  );

  const changeComponentDefinition = (value, property) => {
    const newComponent = _.cloneDeep(component);
    newComponent.component.definition.properties[property].value = value;
    componentDefinitionChanged(selectedComponent, newComponent);
  };

  const eventsChanged = (newEvents) => {
    const newComponent = _.cloneDeep(component);
    newComponent.component.definition.events = newEvents;
    componentDefinitionChanged(selectedComponent, newComponent);
  };

  const handleChange = (value, property) => {
    changeComponentDefinition(value, property);
  };

  const propertiesItem = Object.keys(componentMeta?.properties || {}).map(
    (property, i) => {
      const componentName = componentMeta.component;
      const propertyObj = componentMeta.properties[property];
      const propDefinition =
        component.component.definition.properties[property];
      if (componentName === "Icon") {
        return (
          <div key={i}>
            <Icon value={propDefinition.value} changeComponentDefinition={changeComponentDefinition} />
          </div>
        );
      }
      return (
        <div
          key={selectedComponent + i}
          style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", marginBottom: "5px" }}>
            <label>{propertyObj?.displayName}</label>
          </div>
          <CodeHelper
            onChange={(value) => handleChange(value, property)}
            store={store}
            value={propDefinition.value}
          />
        </div>
      );
    }
  );

  const changeComponentStyleDefinition = (value, style) => {
    const newComponent = _.cloneDeep(component);
    newComponent.component.definition.styles[style].value = value;
    componentDefinitionChanged(selectedComponent, newComponent);
  };

  const handleStyleChnage = (value, style) => {
    changeComponentStyleDefinition(value, style);
  };

  const styleItems = Object.keys(componentMeta?.styles || {}).map((style, i) => {
    const styleDefinition = component.component.definition.styles[style];
    const styleObj = componentMeta.styles[style];
    if (styleObj.type === "select") {
      return (
        <div
          key={i}
          style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", marginBottom: "5px" }}>
            <label>{styleObj.displayName}</label>
          </div>
          <select
            value={styleDefinition?.value}
            style={{ width: "185px", height: "30px" }}
            onChange={(event) =>
              handleStyleChnage(event.target.value, style)
            }>
            {styleObj?.options.map((option, i) => {
              return (
                <option
                  key={i}
                  value={option.value}>
                  {option.name}
                </option>
              );
            })}
          </select>
        </div>
      );
    } else if (styleObj.type === 'number') {
      return (
        <div
          key={i}
          style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", marginBottom: "5px" }}>
            <label>{styleObj.displayName}</label>
          </div>
          <input
            value={styleDefinition?.value}
            type="number"
            onChange={(e) => handleStyleChnage(parseInt(e.target.value), style)}
            placeholder="Style here"
          />
        </div>
      );
    } else {
      return (
        <div
          key={i}
          style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", marginBottom: "5px" }}>
            <label>{styleObj.displayName}</label>
          </div>
          <input
            value={styleDefinition?.value}
            type="text"
            onChange={(e) => handleStyleChnage(e.target.value, style)}
            placeholder="Style here"
          />
        </div>
      );
    }
  });

  const eventItems = Object.keys(componentMeta?.events || {});

  return (
    <div>
      <div
        style={{
          padding: "10px",
          border: "solid rgba(0, 0, 0, 0.125)",
          borderWidth: "0px 0px 1px 0px",
        }}>
        <div>Properties</div>
        {propertiesItem}
      </div>
      {eventItems.length > 0 && (
        <div
          style={{
            padding: "10px",
            border: "solid rgba(0, 0, 0, 0.125)",
            borderWidth: "0px 0px 1px 0px",
          }}>
          <div>Events</div>
          <EventManager
            componentMeta={componentMeta}
            component={component}
            eventsChanged={eventsChanged}
            dataQueries={dataQueries}
            definition={definition}
            screens={screens}
          />
        </div>
      )}
      <div
        style={{
          padding: "10px",
          border: "solid rgba(0, 0, 0, 0.125)",
          borderWidth: "0px 0px 1px 0px",
        }}>
        <div>Styles</div>
        {styleItems}
      </div>
    </div>
  );
};

export default WidgetInspector;
