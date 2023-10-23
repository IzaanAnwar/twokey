import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import twokeyLanding from "../assets/twokeyLanding.png";

// import { createClient } from "@supabase/supabase-js";

// // const supabaseUrl = process.env.SUPABASE_URL;
// // const supabaseKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_ANON_KEY
// );

const Login = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organization: "",
  });
  const [organizationData, setOrganizationData] = useState("");

  console.log(formData);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      formData.organization.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Check if the user's organization matches the provided organization
      // const user = await supabase
      //   .from("user_table_name") // Replace with the actual table name
      //   .select("organization")
      //   .eq("email", formData.email)
      //   .single();

      // if (!user || user.organization !== formData.organization) {
      //   alert("User does not belong to this organization.");
      //   return;
      // }

      setToken(data);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    const orgData = async () => {
      const org = await axios.get(
        "https://twokeybackend.onrender.com/org/list_orgs"
      );
      console.log(org.data);
      setOrganizationData(org.data);
    };

    orgData();
  }, []);
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 ">
        <img
          className="h-screen w-screen"
          src={twokeyLanding}
          alt="twokeyLandingImage"
        />
      </div>

      <div className="bg-white flex flex-col justify-center items-center w-full md:w-1/2">
        <h1 className="text-5xl text-center mt-4 font-semibold ">
          Welcome to Twokey
        </h1>

        <form
          onSubmit={handleSubmit}
          className="p-4 text-center w-full md:w-11/12"
        >
          <span className="my-4 flex flex-col justify-center ">
            <InputLabel
              className="text-md text-left mb-2 mt-4"
              id="demo-select-small-label"
            >
              Organization
            </InputLabel>
            <Select
              className="w-full bg-gray-100"
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={formData.organization}
              label="organizations"
              name="organization"
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="None">
                <em>None</em>
              </MenuItem>

              {organizationData.length &&
                organizationData.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
            <div className="w-full">
              <InputLabel className="text-md text-left mb-2 mt-4" id="email">
                Email
              </InputLabel>
              <span id="email" className="flex flex-row gap-2">
                <TextField
                  id="outlined-basic-email"
                  variant="outlined"
                  className="w-full bg-gray-100"
                  placeholder="Enter your Email here"
                  name="email"
                  onChange={handleChange}
                  size="small"
                />
              </span>
            </div>

            <InputLabel className="text-md text-left mb-2 mt-4" id="password">
              Password
            </InputLabel>

            <TextField
              id="password"
              variant="outlined"
              placeholder="Enter your Password"
              className="w-full bg-gray-100"
              name="password"
              type="password"
              onChange={handleChange}
              size="small"
            />
          </span>

          <button
            type="submit"
            className="bg-blue-600 text-white py-1 px-10 text-center mt-16 rounded-sm"
          >
            Sign In
          </button>
          <p className="text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;