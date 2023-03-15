import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appService } from "../_services/app.service";
import LoadingSpinner from "../LoadingSpinner";
import { AiOutlinePlus } from "react-icons/ai";

const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    getAllApps();
  }, []);

  const getAllApps = () => {
    setLoading(true);
    appService.getAll().then((data) => {
      data.text().then((value) => {
        setLoading(false);
        const data = JSON.parse(value);
        setApps(data);
      });
    });
  };

  const createApp = () => {
    setLoading(true);
    appService.createApp().then((data) => {
      setLoading(false);
      getAllApps();
    });
  };

  return (
    <div>
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
        <Link to={"/"}>
          <img
            style={{ marginLeft: "10px" }}
            src="/images/icons/logo.svg"
          />
        </Link>
      </header>
      {loading && <LoadingSpinner show={true} />}
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <div
          style={{
            backgroundColor: "#4E3CF0",
            color: "#ffff",
            padding: "4px 35px",
            cursor: "pointer",
            fontSize: "1.05em",
            borderRadius: "4px",
            fontWeight: 500,
            display: "inline-block",
          }}
          onClick={createApp}>
          <span>
            <AiOutlinePlus style={{ position: "relative", top: "-1px" }} />
          </span>{" "}
          Create App
        </div>
        <div style={{ marginTop: "20px" }}>
          {apps.map((app, i) => {
            return (
              <div
                style={{ width: "180px" }}
                key={i}>
                <div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      color: "#3e525b",
                      textDecoration: "none",
                      padding: "20px",
                      boxShadow: "rgb(35 46 60 / 4%) 0 2px 4px 0",
                      border: "1px solid rgba(101,109,119,0.16)",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                    <Link to={`/editor/${app.id}`}>
                      <div>Appjam {i + 1}</div>
                    </Link>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await appService.remove(app.id);
                        getAllApps();
                      }}>
                      <img src="/images/icons/query-trash-icon.svg" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
