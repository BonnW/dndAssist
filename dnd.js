const axios = require("axios");

const testGet = () => {
  axios
    .get("https://www.dnd5eapi.co/api/spells/acid-arrow/")
    .then((res) => {
      console.log(res);
    })
    .catch((err) => res.json(err));
};

testGet();
