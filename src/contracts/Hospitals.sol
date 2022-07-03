pragma solidity  0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";

contract Hospitals is Ownable, AccessControl{

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

    mapping(string => Doctor[]) doctorsInHospital;
    mapping(address => Doctor) doctors;
    address[] public doctorsAccounts;
    mapping(address => string) encryptionPublicKeys;

    constructor(address registrationA) public {
        _registration = Registration(registrationA);
    }

    modifier onlyAdmin {
      require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("ADMIN"))));
      _;
    }
    modifier onlyDoctor {
        require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("DOCTOR"))));
        _;
    }

    function addDoctorToSystem(Doctor memory doc) public onlyAdmin{
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
        return doctors[_address];
    }

    function addEncryptionKey(string memory encryptionPublicKey) public onlyDoctor{
        encryptionPublicKeys[msg.sender] = encryptionPublicKey;
    }

    function getEncryptionPublicKey(address _address) public returns(string memory){
        return encryptionPublicKeys[_address];
    }
}