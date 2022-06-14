const DStorage = artifacts.require("DStorage");
const Registration = artifacts.require("Registration")
const Hospitals = artifacts.require("Hospitals")
const Patients = artifacts.require("Patients")
const Files = artifacts.require("Files")
const Appointments = artifacts.require("Appointments")

module.exports = function(deployer) {
  // deployer.deploy(DStorage);
  deployer.deploy(Registration).then(() =>
  deployer.deploy(Appointments),
    deployer.deploy(DStorage, Registration.address),
    deployer.deploy(Hospitals, Registration.address),
    deployer.deploy(Patients, Registration.address).then(() =>
      deployer.deploy(Files, Patients.address)));
  // deployer.deploy(Patients, Registration.address);
};
