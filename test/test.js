const { assert } = require('chai')

const Hospitals = artifacts.require('./Hospitals.sol')
const Registration = artifacts.require('./Registration.sol')
const MedicalResearchers = artifacts.require('./MedicalResearchers.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Doctor', ([deployer, uploader]) => {
  let hospitals, registration

  before(async () => {
    hospitals = await Hospitals.deployed()
    registration = await Registration.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await hospitals.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

  })

  describe('doctor', async () => {
    let result, doctorCount, role
    const firstName = 'Robert'
    const lastName = 'Calatoae'
    const birthDate = '1212121212'
    const gender = 'Male'
    const country = 'Country'
    const city = 'City'
    const hospital = 'Hospital'
    const specialization = 'Specialization'
    const skills = ['Skills']
    const walletAddress = '0x3f3acA93C3a87d4A65e76836e7a93CFACe58fE7E'
    const cnp = 1223
    const _profileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await hospitals.addDoctorToSystem({
        firstName: firstName, lastName:lastName, birthDate:birthDate, gender:gender, country:country,
      city: city, hospital:hospital, specialization:specialization, 
      skills:skills, walletAddress:walletAddress, cnp:cnp, _profileHash:_profileHash})
      let doctors = await hospitals.getDoctors()
      doctorCount = doctors.length

      role = await registration.getRole(walletAddress);
    })

    //check event
    it('add doctor', async () => {
      // SUCESS
      assert.equal(doctorCount, 1)
      const event = result.logs[1].args
      assert.equal(event.firstName, firstName, 'First name is correct')
      assert.equal(event.lastName, lastName, 'Last name is correct')
      assert.equal(event.birthDate, birthDate, 'Birth date is correct')
      assert.equal(event.gender, gender, 'Gender is correct')
      assert.equal(event.country, country, 'Country is correct')
      assert.equal(event.city, city, 'City is correct')
      assert.equal(event.hospital, hospital, 'Hospital is correct')
      assert.equal(event.specialization, specialization, 'Specialization is correct')
      assert.equal(event.walletAddress, walletAddress, 'Wallet address is correct')
      assert.equal(event.cnp, cnp, 'CNP is correct')
      assert.equal(event._profileHash, _profileHash, 'Profile hash is correct')
      assert.equal(role, "DOCTOR", 'Role is correct')

      // FAILURE: Doctor must have an address
      await hospitals.addDoctorToSystem({
        firstName: firstName, lastName:lastName, birthDate:birthDate, gender:gender, country:country,
      city: city, hospital:hospital, specialization:specialization, 
      skills:skills, walletAddress:'', cnp:cnp, _profileHash:_profileHash}).should.be.rejected;
    })

    //check from Struct
    it('list doctor', async () => {
      const doctor = await hospitals.getDoctor(walletAddress)
      assert.equal(doctor.firstName, firstName, 'First name is correct')
      assert.equal(doctor.lastName, lastName, 'Last name is correct')
      assert.equal(doctor.birthDate, birthDate, 'Birth date is correct')
      assert.equal(doctor.gender, gender, 'Gender is correct')
      assert.equal(doctor.country, country, 'Country is correct')
      assert.equal(doctor.city, city, 'City is correct')
      assert.equal(doctor.hospital, hospital, 'Hospital is correct')
      assert.equal(doctor.specialization, specialization, 'Specialization is correct')
      assert.equal(doctor.walletAddress, walletAddress, 'Wallet address is correct')
      assert.equal(doctor.cnp, cnp, 'CNP is correct')
      assert.equal(doctor._profileHash, _profileHash, 'Profile hash is correct')
    })
  })
})

contract('Medical Researchers', ([deployer, uploader]) => {
  let researchers, registration

  before(async () => {
    researchers = await MedicalResearchers.deployed()
    registration = await Registration.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await researchers.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

  })

  describe('researchers', async () => {
    let result, researchersAccounts, researchersCount, role, resultAddKey
    const name = 'Researcher'
    const city = 'City'
    const country = 'Country'
    const nrOfPatients = 10
    const _address = '0x9224859716548cc353Ddf21B1A180970BC3706e8'

    const encryptionKey = "encryptionKey123"

    before(async () => {
      result = await researchers.addResearcher({
        name: name, city:city, country:country, nrOfPatients: nrOfPatients, _address:_address})
        researchersAccounts = await researchers.getReseachers()
      researchersCount = researchersAccounts.length

      role = await registration.getRole(_address);
    })

    //check event
    it('add medical researcher', async () => {
      // SUCESS
      assert.equal(researchersCount, 1)
      const event = result.logs[0].args
      
      assert.equal(event.name, name, 'Name is correct')
      assert.equal(event.city, city, 'City is correct')
      assert.equal(event.country, country, 'Country is correct')
      assert.equal(event.nrOfPatients, 0, 'Number of patients is correct')
      assert.equal(event._address, _address, 'Address is correct')
      
      //FAILURE: Medical researchers must have an address
      await researchers.addResearcher({
        name: name, city:city, country:country, nrOfPatients: nrOfPatients, _address:""}).should.be.rejected;
    })

    it('check role & insertion', async () => {
      assert.equal(researchersAccounts.includes(_address), true)
      assert.equal(role, "RESEARCHER", 'Address is correct')
    })
  })
})