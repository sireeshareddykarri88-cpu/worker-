const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));

if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_KEY
) {

  console.log("ENV FILE ERROR");

  process.exit(1);

}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      gender,
      qualification
    } = req.body;

    const { data, error } = await supabase
      .from("workers")
      .insert([
        {
          name,
          email,
          password,
          gender,
          qualification
        }
      ]);

    if (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

    res.json({
      success: true,
      message: "Successfully Registered",
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
