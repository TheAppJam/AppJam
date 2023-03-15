import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authenticationService } from "../_services";
import Spinner from 'react-bootstrap/Spinner';

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = React.useState(false);

  const handleChange = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  const login = (e) => {
    setLoading(true);
    e.preventDefault();
    authenticationService.login(email, password).then((response) => {
      setLoading(false);
      props.history.push('/');
    });
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}>
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
          <img
            style={{ marginLeft: "10px" }}
            src="/images/icons/logo.svg"
          />
      </header>
      <div style={{ minHeight: "calc(100vh - 45px)", display: "grid" }}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div style={{fontSize: '30px'}}>Login</div>
          <div>
            <div>Email</div>
            <input
              onChange={handleChange}
              className="jam-text-input"
              name="email"
              type="email"
              placeholder={"Enter your email"}
              value={email}
            />
            <div>Password</div>
            <input
              onChange={handleChange}
              className="jam-text-input"
              name="password"
              type="password"
              placeholder={"Enter new password"}
              value={password}
            />
            <div
              style={{
                backgroundColor: "#4E3CF0",
                color: "#ffff",
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: "0.90em",
                borderRadius: "4px",
                fontWeight: 500,
                marginTop: '20px',
                marginBottom: '20px',
                textAlign: 'center'
              }}
              onClick={login}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
            </div>
            <Link to={"/signup"}>
              Create an account.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
