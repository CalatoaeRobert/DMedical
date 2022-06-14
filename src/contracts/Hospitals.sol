pragma solidity  0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";

contract Hospitals is Ownable, AccessControlEnumerable {

    struct Hospital {
        string city;
        string country;
        string name;
    }

    event HospitalAdd(
        string city,
        string country,
        string name
    );

    struct Doctor {
        string firstName;
        string lastName;
        uint birthDate;
        string gender;
        string country;
        string city;
        string hospital;
        string specialization;
        string[] skills;
        address walletAddress;
        uint cnp;
        string _profileHash;
    }

    event DoctorAdd(
        string firstName,
        string lastName,
        uint birthDate,
        string gender,
        string country,
        string city,
        string hospital,
        string specialization,
        string[] skills,
        address walletAddress,
        uint cnp,
        string _profileHash
    );

    Registration _registration;

    mapping(uint => Hospital) hospitals;
    mapping(string => Doctor[]) doctorsInHospital;
    mapping(address => Doctor) doctors;
    address[] public doctorsAccounts;

    constructor(address registrationA) public {
        _registration = Registration(registrationA);
    }

    function addHospital(uint id, string memory name, string memory city, string memory country) public {
        hospitals[id] = Hospital(city, country, name);

        emit HospitalAdd(city, country, name);
    }

    function getHospital(uint id) public view returns (string memory, string memory, string memory) {
        return (hospitals[id].name, hospitals[id].country, hospitals[id].city);
    }

    function addDoctor(Doctor memory doc) public{
        doctors[doc.walletAddress] = doc;
        doctorsAccounts.push(doc.walletAddress);
        _registration.addDoctor(doc.walletAddress);
        doctorsInHospital[doc.hospital].push(doctors[doc.walletAddress]);

        emit DoctorAdd(doc.firstName, doc.lastName, doc.birthDate, doc.gender, doc.country, doc.city, doc.hospital,
        doc.specialization, doc.skills, doc.walletAddress, doc.cnp, doc._profileHash);
    }

    function getDoctors() view public returns(address[] memory){
        return doctorsAccounts;
    }

    function getDoctorsInAHospital(string memory hospital) view public returns(Doctor[] memory){
        return doctorsInHospital[hospital];
    }

    function getDoctor(address _address) view public returns (Doctor memory){
        // return (doctors[_address].age, doctors[_address].name, doctors[_address].specialization, doctors[_address].hospitalId);
        return doctors[_address];
    }

    // function getEncryptionKey(address _address) view public returns (string memory) {
    //     return doctors[_address].encryptionKey;
    // }
}