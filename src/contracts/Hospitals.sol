pragma solidity  0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Hospitals is Ownable, AccessControl {

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
        uint age;
        string name;
        string specialization;
        uint hospitalId;
    }

    event DoctorAdd(
        uint age,
        string name,
        string specialization,
        uint hostpitalId
    );

    mapping(uint => Hospital) hospitals;
    mapping(uint => Doctor[]) doctorsInHospital;
    mapping(address => Doctor) doctors;
    address[] public doctorsAccounts;

    function addHospital(uint id, string memory name, string memory city, string memory country) public {
        hospitals[id] = Hospital(city, country, name);

        emit HospitalAdd(city, country, name);
    }

    function getHospital(uint id) public view returns (string memory, string memory, string memory) {
        return (hospitals[id].name, hospitals[id].country, hospitals[id].city);
    }

    function addDoctor(address _address, uint _age, string memory _name, string memory _specialization, uint _hospitalId) public {
        doctors[_address] = Doctor(_age, _name, _specialization, _hospitalId);
        doctorsAccounts.push(_address);

        doctorsInHospital[_hospitalId].push(doctors[_address]);

        emit DoctorAdd(_age, _name, _specialization, _hospitalId);
    }

    function getDoctors() view public returns(address[] memory){
        return doctorsAccounts;
    }

    function getDoctorsInAHospital(uint _hospitalId) view public returns(Doctor[] memory){
        return doctorsInHospital[_hospitalId];
    }

    function getDoctor(address _address) view public returns (Doctor memory){
        // return (doctors[_address].age, doctors[_address].name, doctors[_address].specialization, doctors[_address].hospitalId);
        return doctors[_address];
    }
}