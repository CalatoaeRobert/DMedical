pragma solidity  0.8.4;

import "./Registration.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Files is Ownable, AccessControl{

    Registration _registration;

    struct Request {
        address patient;
        address doctor;
        uint index;
    }

    event RequestAdd(
        address patient,
        address doctor,
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

    
    mapping(address => address[]) historyAvailable;
    mapping(address => Files[]) historyFiles;
    mapping(address => Request[]) requestsOfAPatient;

    constructor(address registrationA) public {
        _registration = Registration(registrationA);
    }

    modifier onlyPatient {
        require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("PATIENT"))));
        _;
    }
    modifier onlyDoctor {
        require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("DOCTOR"))));
        _;
    }

    function addRequestToShareMedicalRecords(address _address) public onlyDoctor {
        requestsOfAPatient[_address].push(Request(_address, msg.sender, requestsOfAPatient[_address].length));

        emit RequestAdd(_address, msg.sender, requestsOfAPatient[_address].length);
    }

    function getHistoryAvailableForDoctor(address _address) public returns(address[] memory){
        return historyAvailable[_address];
    }

    function getRequestsOfAPatient(address _address) public returns(Request[] memory){
        return requestsOfAPatient[_address];
    }

    function acceptRequestFromDoctor(address _address, uint index, string memory _hash) public onlyPatient{
        historyAvailable[_address].push(msg.sender);
        
        delete requestsOfAPatient[msg.sender][index];
    }

    function addFilesToDoctor(address _address, string memory _hash) public onlyPatient{
        historyFiles[_address].push(Files(msg.sender, _hash));

        emit FilesAdd(msg.sender, _hash);
    }

    function getFilesHistory(address _address) public returns(Files[] memory){
        return historyFiles[_address];
    }

    function declineRequestFromDoctor(address _address, uint index) public onlyPatient{
        delete requestsOfAPatient[msg.sender][index];
    }
}