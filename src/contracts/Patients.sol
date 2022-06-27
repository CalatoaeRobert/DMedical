pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Patients is Ownable, AccessControl, ReentrancyGuard {

    Registration _registration;

    constructor(address registrationA) public {
        _registration = Registration(registrationA);
    }

    struct Patient {
        string firstName;
        string lastName;
        string country;
        string city;
        string gender;
        string _addressLocation;
        address _address;
        string CNP;
        uint birthDate;
        string _hash;
    }

    event AddPatient(
      string firstName,
      string lastName,
      string country,
      string city,
      string gender,
      string _addressLocation,
      address _address,
      string CNP,
      uint birthDate,
      string _hash
  );

    mapping(address => Patient) patients;
    address[] public patientAccounts;

    function registerPatient(string memory fname, string memory lname, string memory gender, string memory addressLocation,
        string memory city, string memory country, string memory cnp, uint birthDate, string memory _hash) public{
        
        patients[msg.sender] = Patient(fname, lname, country, city, gender, addressLocation, msg.sender, cnp, birthDate, _hash);
        patientAccounts.push(msg.sender);

        _registration.addPatient(tx.origin);

        emit AddPatient(fname, lname, country, city, gender, addressLocation, msg.sender, cnp, birthDate, _hash);

    } 

    function getPatient(address _address) view public returns(Patient memory){
        return patients[_address];
    }

    function getPatientsAccount() view public returns(address[] memory){
        return patientAccounts;
    }
}