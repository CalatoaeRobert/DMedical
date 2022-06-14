pragma solidity  0.8.4;

contract Appointments {
    struct Appointment {
        address patient;
        address doctor;
        uint date;
        string startingHour;
        string dateString;
    }

    event AppointmentAdd(
        address patient,
        address doctor,
        uint date,
        string startingHour,
        string dateString
    );

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

    mapping(address => Appointment[]) appointmentsOfPatients;
    mapping(address => Appointment[]) appointmentsOfDoctor;
    mapping(address => address[]) doctorsOfPatient;
    mapping(address => address[]) patientsOfDoctor;
    mapping(address => mapping(string => string[])) appointmentsOfADoctorInADay;
    mapping(address => address[]) historyAvailable;
    mapping(address => Files) historyFiles;
    mapping(address => Request[]) requestsOfAPatient;
    mapping(address => string) encryptionPublicKeys;

    function addAppointment(Appointment memory appointment) public {
        appointmentsOfPatients[appointment.patient].push(appointment);
        doctorsOfPatient[appointment.patient].push(appointment.doctor);

        appointmentsOfDoctor[appointment.doctor].push(appointment);
        patientsOfDoctor[appointment.doctor].push(appointment.patient);

        appointmentsOfADoctorInADay[appointment.doctor][appointment.dateString].push(appointment.startingHour);

        emit AppointmentAdd(appointment.patient, appointment.doctor, appointment.date, appointment.startingHour, appointment.dateString);
    }

    function getAppointmentsOfDoctor(address _address) public returns(Appointment[] memory) {
        return appointmentsOfDoctor[_address];
    }

    function getAppointmentsOfPatient(address _address) public returns(Appointment[] memory) {
        return appointmentsOfPatients[_address];
    }

    function getPatientsOfADoctor(address _address) public returns(address[] memory) {
        return patientsOfDoctor[_address];
    }

    function getDoctorsOfAPatient(address _address) public returns(address[] memory) {
        return doctorsOfPatient[_address];
    }

    function getAppointmentsInADay(address _address, string memory day) public returns(string[] memory){
        return appointmentsOfADoctorInADay[_address][day];
    }

    function addRequestToShareMedicalRecords(address _address) public {
        requestsOfAPatient[_address].push(Request(_address, msg.sender, requestsOfAPatient[msg.sender].length));

        emit RequestAdd(_address, msg.sender, requestsOfAPatient[_address].length);
    }

    function getHistoryAvailableForDoctor(address _address) public returns(address[] memory){
        return historyAvailable[_address];
    }

    function getRequestsOfAPatient(address _address) public returns(Request[] memory){
        return requestsOfAPatient[_address];
    }

    function acceptRequestFromDoctor(address _address, uint index, string memory _hash) public{
        // historyFiles[_address][msg.sender].push(_hash);
        historyAvailable[_address].push(msg.sender);

        delete requestsOfAPatient[msg.sender][index];
    }

    function addFilesToDoctor(address _address, string memory _hash) public{
        historyFiles[_address] = Files(msg.sender, _hash);

        emit FilesAdd(_address, _hash);
    }

    function getFileHistoryFromPatient(address _address) public returns(Files memory){
        return historyFiles[_address];
    }

    function declineRequestFromDoctor(address _address, uint index) public{
        delete requestsOfAPatient[msg.sender][index];
    }

    function addEncryptionKey(string memory encryptionPublicKey) public {
        encryptionPublicKeys[msg.sender] = encryptionPublicKey;
    }

    function getEncryptionPublicKey(address _address) public returns(string memory){
        return encryptionPublicKeys[_address];
    }
}