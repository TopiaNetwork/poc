const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const account = "0x875E74e882a91Ec0ba119F8077d4c9b055b8446F";
const password = "123";

(async () => {
  try {
    await web3.eth.personal.unlockAccount(account, password, 360000);
    console.log("Account unlocked");
  } catch (error) {
    console.log("Failed to unlock account:", error.message);
  }
})();
 