const Registration = artifacts.require("Registration")
const Hospitals = artifacts.require("Hospitals")
const Patients = artifacts.require("Patients")
const Files = artifacts.require("Files")
const Appointments = artifacts.require("Appointments")
const MedicalResearchers = artifacts.require("MedicalResearchers")

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(Registration);
    await deployer.deploy(Appointments, Registration.address);
    await deployer.deploy(Hospitals, Registration.address);
    await deployer.deploy(Files, Registration.address);
    await deployer.deploy(Patients, Registration.address);
    await deployer.deploy(MedicalResearchers, Registration.address);
});
}
