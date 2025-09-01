import { RequestHandler } from "express";

// Dummy user data for prototype
// const dummyUsers = [
//   { id: "user001", devices: ["Toyota Camry 2020", "Honda Civic 2019"] },
//   { id: "user002", devices: ["BMW X5 2021", "Mercedes C-Class 2022"] },
//   { id: "user003", devices: ["Ford F-150 2023"] },
//   { id: "admin", devices: ["Tesla Model S 2024", "Audi A4 2021", "Nissan Altima 2020"] },
//   { id: "test123", devices: ["Volkswagen Golf 2019"] },
// ];
const dummyUsers = [
  { id: "41651", devices: ["353691846067915", "353691846067907"], api_token: "FCrZ4HasaK25prlLw20Pdwq9eqsRISHuHleMNQXmkxD6P1yx2OOkFM0VTNVU" },
  { id: "41641", devices: ["353691846741238", "353691846741212", "353691846741311"], api_token: "7mI48BNlgVLHUcz3Sl8nFPJHoANS1UDGbr8CnbTYEWNmqD6LwRJhwCbnnsHU" },
  { id: "41634", devices: ["352503096245417", "352503097599697"], api_token: "lj6t8C29HziAzh3rV6hxWpE6fD9lrr9KmDJrBrrPso1nrn1j6G9zvlaRgg1n" },
  { id: "41564", devices: ["353691840153869", "353691845897312"], api_token: "xboInEFhBWuyrEGdUO7odsXHuPtY0eywLOqNHJJzrMCabBMVt7thoC61ddzY" },
];

export const checkUserIds: RequestHandler = (req, res) => {
  const query = req.query.q as string || '';
  const matchingUsers = dummyUsers
    .filter(user => user.id.toLowerCase().includes(query.toLowerCase()))
    .map(user => user.id)
    .slice(0, 5); // Limit to 5 suggestions
  
  res.json(matchingUsers);
};

export const getUserDevices: RequestHandler = (req, res) => {
  const userId = req.params.id;
  const user = dummyUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({
    user_id: userId,
    devices: user.devices,
    api_token: user.api_token
  });
};
