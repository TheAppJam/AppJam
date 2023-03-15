import { defaults } from "lodash";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import { appService } from "../_services";

const AppSettings = ({ settings, setSettings, ...props }) => {
  const [appSetting, setAppSetting] = useState(settings)

  useEffect(() => {
    setAppSetting(settings)
  }, [props.show])

  const handleSettingChange = (e) => {
    setAppSetting((appSetting) => {
      return {
        ...appSetting,
        [e.target.name]: e.target.value,
      };
    });
  };

  const saveSettings = () => {
    appService.saveSettings(props.appid, appSetting).then((data) => {
      data.text().then((value) => {
        const data = JSON.parse(value);
        const newSettings = defaults(data?.settings, settings);
        setSettings(newSettings);
        props.onHide();
      });
    });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Project Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "1.5rem" }}>
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={appSetting.name || ""}
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleSettingChange}
          />
          <label className="form-label">Slug</label>
          <input
            className="form-input"
            value={appSetting.slug || ""}
            type="text"
            placeholder="Slug"
            name="slug"
            onChange={handleSettingChange}
          />
          <label className="form-label">Project ID</label>
          <input
            className="form-input"
            value={appSetting.projectId || ""}
            type="text"
            placeholder="projectId"
            name="projectId"
            onChange={handleSettingChange}
          />
          <label className="form-label">Android Package</label>
          <input
            className="form-input"
            value={appSetting.androidPackage || ""}
            type="text"
            placeholder="com.android.package"
            name="androidPackage"
            onChange={handleSettingChange}
          />
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ backgroundColor: "#4E3CF0", fontWeight: 500 }}
          onClick={saveSettings}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppSettings;
