import { getInterfaceInfo } from ".";

getInterfaceInfo({ dir: ["./src/api-admin"] }).then((res) => {
  console.log(JSON.stringify(res.interfaces, null, 2));
});
