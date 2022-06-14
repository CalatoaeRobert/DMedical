pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";
import "./DStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Patients is Ownable, AccessControl, ReentrancyGuard {

    Registration _registration;

    struct File {
      string fileHash;
      uint fileSize;
      string fileType;
      string fileName;
      string fileDescription;
      uint uploadTime;
      address patient_address;
      address payable uploader;
    }

    event FileUploaded(
      string fileHash,
      uint fileSize,
      string fileType,
      string fileName,
      string fileDescription,
      uint uploadTime,
      address patient_address,
      address payable uploader
  );

    struct Doctor {
        uint age;
        string name;
        string specialization;
        uint hospitalId;
    }

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
    
    mapping(address => File[]) medical_records;
    // mapping(address => Doctor[]) doctors;
    mapping(address => mapping(address => bool)) doctors;

    mapping(address => Patient[]) patientsOfDoctor;
    mapping(address => mapping(address => File[])) patient_files;

    mapping(address => Patient) patients;
    address[] public patientAccounts;

    mapping(address => mapping(address => bool)) history_approved;

    mapping(address => uint[]) files;

    function addFileNft(uint _tokenId, address _to) public{
        files[_to].push(_tokenId);
    }

    function transferFileDoctor(IERC721 _nft, address _doctor, uint _tokenId) external {
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        _nft.transferFrom(address(this), _doctor, _tokenId);
    }

    function getFilesForUser(address _address) public returns(uint[] memory)
    {
        return files[_address];
    }

    function giveHistoryPermission(address _address) public{
        history_approved[msg.sender][_address] = true;
    }

    function registerAPatientAsDoctor(string memory fname, string memory lname, string memory gender, string memory addressLocation,
        string memory city, string memory country, string memory cnp, address _address, uint birthDate, string memory _hash) public{
        
        patients[_address] = Patient(fname, lname, country, city, gender, addressLocation, _address, cnp, birthDate, _hash);
        patientsOfDoctor[msg.sender].push(patients[_address]);
        doctors[_address][msg.sender] = true;
        
        // _setupRole(_registration.PATIENT_ROLE(), _address);
        // _registration.addUser(_address);

        emit AddPatient(fname, lname, country, city, gender, addressLocation, _address, cnp, birthDate, _hash);
    } 

    function registerPatient(string memory fname, string memory lname, string memory gender, string memory addressLocation,
        string memory city, string memory country, string memory cnp, uint birthDate, string memory _hash) public{
        
       
        patients[msg.sender] = Patient(fname, lname, country, city, gender, addressLocation, msg.sender, cnp, birthDate, _hash);
        patientAccounts.push(msg.sender);
        // _setupRole(_registration.PATIENT_ROLE(), 0x681536517EEd5a1622485bf61119F27F477A871f);
        // _registration.addUser(tx.origin);

        emit AddPatient(fname, lname, country, city, gender, addressLocation, msg.sender, cnp, birthDate, _hash);

    } 

    function getPatientFiles(address _address) view public returns(File[] memory){
        if(hasRole(_registration.DOCTOR_ROLE(), _address)){
            if (history_approved[_address][msg.sender] == true) {
                // is a doctor which has access to the medical history of the patient
                return medical_records[_address];
            }
            else {
                // is a doctor which has not access to the medical history of the patient
                // and will receive only the corresponding medical records
                return patient_files[msg.sender][_address];
            }
        }
        else if (hasRole(_registration.PATIENT_ROLE(), _address)) { 
            // is a patient who wants to retrieve his files
            return medical_records[_address];
        }
    }

    function addFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription, address patient_address) public onlyRole(_registration.DOCTOR_ROLE()){
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);

        // Make sure file type exists
        require(bytes(_fileType).length > 0);

        // Make sure file description exists
        require(bytes(_fileDescription).length > 0);

        // Make sure file fileName exists
        require(bytes(_fileName).length > 0);

        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Make sure file size is more than 0
        require(_fileSize > 0);

        medical_records[patient_address].push(File(_fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, patient_address, payable(msg.sender)));
        patient_files[msg.sender][patient_address].push(File(_fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, patient_address, payable(msg.sender)));
        // Trigger an event

        emit FileUploaded(_fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, patient_address, payable(msg.sender));
    }

    function getPatientsOfDoctor(address _address) view public returns(Patient[] memory){
        return patientsOfDoctor[_address];
    }

    function returnPatientFile() view public returns(string memory){
        return patients[msg.sender]._hash;
    }

    function getPatient(address _address) view public returns(Patient memory){
        return patients[_address];
    }

    function getPatientsAccount() view public returns(address[] memory){
        return patientAccounts;
    }
}