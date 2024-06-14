import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import "./login.css";

import { encrypt } from "../../utils/encryptDecrypy";
import { LoginSuccess } from "../../Redux/auth/authSlice";
import useHttpErrorHandler from "../../utils/userHttpErrorHandler";

const Login = () => {
  const dispatch = useDispatch();
  const httpErrorHandler = useHttpErrorHandler();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    ClientId: "",
    url: `https://m24ssl.marwariplus.com`,
    clientIdResponse: [],
    Username: "",
    Password: "",
    DbKey: "",
    loginResponse: null,
  });

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    const localStorageUrl = localStorage.getItem("url");
    if (localStorageUrl) {
      setData((prevData) => ({ ...prevData, url: localStorageUrl }));
    }
  }, []);

  const handleClientIdSubmit = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);
      const response = await axios.get(`${data?.url}/api/ClientInfo`, {
        headers: {
          ClientId: data?.ClientId,
        },
      });

      if (response && response?.status === 200) {
        setData((prevData) => ({
          ...prevData,
          clientIdResponse: response?.data,
        }));

        localStorage.setItem("url", data?.url);

        setCurrentStep((prev) => prev + 1);
        setLoading(false);
      }
    } catch (error) {
      httpErrorHandler(error);
      setLoading(false);
    }
  };

  const handleLoginDetailsSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await axios.get(`${data?.url}/api/Login`, {
        headers: {
          ...data,
          platform: "Web",
          Version: "1.0.0.0",
        },
      });

      if (response && response?.status === 200) {
        setData((prevData) => ({ ...prevData, loginResponse: response?.data }));

        const loginData = { ...data, loginResponse: response?.data };
        const jsonData = JSON.stringify(loginData);
        const encryptedData = encrypt(jsonData);

        localStorage.setItem("m24", encryptedData);
        dispatch(
          LoginSuccess({ ...data, loginResponse: response?.data, Mode: "A" })
        );
      }
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div
      className="login-container"
      style={{ height: currentStep === 2 ? "340px" : "" }}
    >
      <form
        id="form1"
        className={currentStep === 1 ? "active login-form" : "login-form"}
        onSubmit={handleClientIdSubmit}
      >
        <h3>LOGIN</h3>
        <input
          type="ClientId"
          placeholder="ClientId"
          name="ClientId"
          value={data?.ClientId}
          onChange={handleOnChange}
          required
        />
        <input
          type="url"
          placeholder="URL"
          name="url"
          value={data?.url}
          onChange={handleOnChange}
          required
        />
        <div className="btn-box">
          <button type="submit" disabled={loading} id="next1">
            {loading ? "Please Wait..." : "Next"}
          </button>
        </div>
      </form>

      <form
        id="form2"
        className={currentStep === 2 ? "active login-form" : "login-form"}
        onSubmit={handleLoginDetailsSubmit}
      >
        <h3>LOGIN DETAILS</h3>
        <input
          type="text"
          name="Username"
          placeholder="Username"
          value={data?.Username || ""}
          onChange={handleOnChange}
          required
        />
        <input
          type="password"
          name="Password"
          placeholder="Password"
          value={data?.Password || ""}
          onChange={handleOnChange}
          autoComplete="password"
          required
        />
        <select
          name="DbKey"
          style={{ width: "100%", padding: "5px 2px", color: "#777" }}
          value={data?.DbKey}
          onChange={handleOnChange}
          placeholder="Select Businees"
          required
        >
          <option value="" style={{ color: "#777" }}>
            Select Businees
          </option>
          {data?.clientIdResponse &&
            data?.clientIdResponse?.length > 0 &&
            data?.clientIdResponse.map((item) => (
              <option key={item?.BusinessName} value={item?.DbKey}>
                {item?.BusinessName}
              </option>
            ))}
        </select>
        <div className="btn-box">
          <button type="button" id="back1" onClick={handleBack}>
            Back
          </button>{" "}
          &nbsp;
          <button type="submit" id="next2">
            {loading ? "Please Wait..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
