const DStorage = artifacts.require("DStorage");
const Registration = artifacts.require("Registration")
const Hospitals = artifacts.require("Hospitals")

module.exports = function(deployer) {
  deployer.deploy(DStorage);
  deployer.deploy(Registration);
  deployer.deploy(Hospitals);
};
