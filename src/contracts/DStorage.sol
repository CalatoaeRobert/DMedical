pragma solidity  0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Registration.sol";

contract DStorage is Ownable, AccessControl {

  string public name = "DStorage";
  // Number of files
  uint public fileCount = 0;
  // Mapping fileId=>Struct 
  mapping (uint => File) public files;

  mapping (address => bool) public members;

  Registration _registration;

  // bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
  // bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");

  // Struct
  struct File {
      uint fileId;
      string fileHash;
      uint fileSize;
      string fileType;
      string fileName;
      string fileDescription;
      uint uploadTime;
      address payable uploader;
  }

  // Event
  event FileUploaded(
      uint fileId,
      string fileHash,
      uint fileSize,
      string fileType,
      string fileName,
      string fileDescription,
      uint uploadTime,
      address payable uploader
  );

  constructor() public {
    _registration = new Registration();
    _setupRole(_registration.PATIENT_ROLE(), msg.sender);
    _setupRole(_registration.DOCTOR_ROLE(), 0xe2D18E6fffd6B2d36B3C7e2F44E33374c7d92B33);
    addMember(0xe2D18E6fffd6B2d36B3C7e2F44E33374c7d92B33);
  }

  function addMember(address _member) public onlyRole(_registration.PATIENT_ROLE())
   {
      members[_member] = true;
   }

  function isDoctor(address _address) public returns (bool)
  {
    if(hasRole(_registration.DOCTOR_ROLE(), _address)){
      return true;
    }
    return false;
  }

  // Upload File function
  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public onlyRole(_registration.PATIENT_ROLE()) {
    
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

    //addMember(msg.sender);

    fileCount++;

    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, payable(msg.sender));
    addMember(msg.sender);
    // Trigger an event

    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, payable(msg.sender));
  }

}