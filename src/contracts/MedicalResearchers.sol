pragma solidity  0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";

contract MedicalResearchers is Ownable{
    
    struct Researcher{
        string name;
        string city;
        string country;
        uint nrOfPatients;
        address _address;
    }

     event ResearcherAdd(
        string name,
        string city,
        string country,
        uint nrOfPatients,
        address _address
    );

    struct Request {
        address patient;
        address researcher;
        uint index;
    }

    event RequestAdd(
        address patient,
        address researcher,
        uint index
    );

     struct Files {
        address patient;
        string _hash;
    }

    event FilesAdd(
        address patient,
        string _hash
    );

    Registration _registration;
    
    mapping(address => address[]) historyAvailable;
    mapping(address => Files[]) historyFiles;
    mapping(address => Request[]) requestsOfAPatient;

    address[] public medicalReseachersAccounts;

    mapping(address => Researcher) researchers;
    mapping(address => address[]) patients;
    mapping(address => address[]) researchersOfPatient;

    mapping(address => string) encryptionPublicKeys;

    constructor(address registrationA) public {
        _registration = Registration(registrationA);
    }

    modifier onlyAdmin {
      require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("ADMIN"))));
      _;
    }
    modifier onlyPatient {
        require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("PATIENT"))));
        _;
    }
    modifier onlyMedicalResearcher {
        require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("RESEARCHER"))));
        _;
    }

    function getResearcher(address _address) public returns(Researcher memory){
        return researchers[_address];
    }

    function getPatientsOfAResearcher(address _address) public returns(address[] memory){
        return patients[_address];
    }

    function getReseachers() view public returns(address[] memory){
        return medicalReseachersAccounts;
    }

    function addEncryptionKey(string memory encryptionPublicKey) public onlyMedicalResearcher {
        encryptionPublicKeys[msg.sender] = encryptionPublicKey;
    }

    function getEncryptionPublicKey(address _address) public returns(string memory){
        return encryptionPublicKeys[_address];
    }

    function addResearcher(Researcher memory researcher) public onlyAdmin{
        researchers[researcher._address] = researcher;
        medicalReseachersAccounts.push(researcher._address);
        _registration.addResearcher(researcher._address);
        emit ResearcherAdd(researcher.name, researcher.city, researcher.country, 0, researcher._address);
    }

    function addRequest(address patient, address researcher) onlyMedicalResearcher public{
        requestsOfAPatient[patient].push(Request(patient, researcher, requestsOfAPatient[patient].length));

        emit RequestAdd(patient, researcher, requestsOfAPatient[patient].length);
    }

    function getHistoryAvailableForResearcher(address _address) public returns(address[] memory){
        return historyAvailable[_address];
    }

    function getRequestsOfAResearcher(address _address) public returns(Request[] memory){
        return requestsOfAPatient[_address];
    }

    function addFilesToResearcher(address _address, string memory _hash) onlyPatient public{
        historyFiles[_address].push(Files(msg.sender, _hash));
        
        emit FilesAdd(msg.sender, _hash);
    }

    function acceptRequestFromResearcher(address _address, uint index, string memory _hash) onlyPatient public{
        historyAvailable[_address].push(msg.sender);
        patients[_address].push(msg.sender);
        researchers[_address].nrOfPatients++;
        researchersOfPatient[msg.sender].push(_address);

        delete requestsOfAPatient[msg.sender][index];
    }

    function declineRequestFromResearcher(address _address, uint index) public onlyPatient{
        delete requestsOfAPatient[msg.sender][index];
    }

    function getFilesHistory(address _address) public returns(Files[] memory){
        return historyFiles[_address];
    }

    function getResearchersOfPatient(address _address) public view returns(address[] memory){
        return researchersOfPatient[_address];
    }
}