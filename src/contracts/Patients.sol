pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";
import "./DStorage.sol";

contract Patients is Ownable, AccessControl{

    Registration _registration;
    DStorage _dstorage;

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

    constructor() public {
        _registration = new Registration();
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
      uint birthDate
  );
    
    mapping(address => File[]) medical_records;
    // mapping(address => Doctor[]) doctors;
    mapping(address => mapping(address => bool)) doctors;

    mapping(address => Patient[]) patientsOfDoctor;
    mapping(address => mapping(address => File[])) patient_files;

    mapping(address => Patient) patients;
    mapping(address => mapping(address => bool)) history_approved;

    function giveHistoryPermission(address _address) public{
        history_approved[msg.sender][_address] = true;
    }

    function registerAPatientAsDoctor(string memory fname, string memory lname, string memory gender, string memory addressLocation,
        string memory city, string memory country, string memory cnp, address _address, uint birthDate) public{
        
        patients[_address] = Patient(fname, lname, country, city, gender, addressLocation, _address, cnp, birthDate);
        patientsOfDoctor[msg.sender].push(patients[_address]);
        doctors[_address][msg.sender] = true;
        
        _setupRole(_registration.PATIENT_ROLE(), _address);

        emit AddPatient(fname, lname, country, city, gender, addressLocation, _address, cnp, birthDate);
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
}