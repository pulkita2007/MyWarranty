// export default function authHeader() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (user && user.token) {
//     return { headers: { Authorization: "Bearer " + user.token } };
//   } else if (user && user.accessToken) {
//     // In case your backend sends `accessToken` instead of `token`
//     return { headers: { Authorization: "Bearer " + user.accessToken } };
//   } else {
//     return {};
//   }
// }
export default function authHeader() {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return { headers: { Authorization: "Bearer " + accessToken } };
  } else {
    return {};
  }
}

