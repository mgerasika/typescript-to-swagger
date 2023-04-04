import { getSpecInfoAsync } from ".";

getSpecInfoAsync({ dir: ["./src/api-admin"] }).then((res) => {
  console.log(JSON.stringify(res.interfaces, null, 2));
});
