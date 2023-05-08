const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8546"));

const account = "0x4b0131DA1bE2cCe402169a5daCEB7c1e96580eF0";
const password = "123";

(async () => {
  try {
    await web3.eth.personal.unlockAccount(account, password, 360000);
    console.log("Account unlocked");
  } catch (error) {
    console.log("Failed to unlock account:", error.message);
  }
})();
