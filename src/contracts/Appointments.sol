pragma solidity  0.8.4;

import "./Registration.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Appointments is Ownable, AccessControl{
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

    mapping(address => Appointment[]) appointmentsOfPatients;
    mapping(address => Appointment[]) appointmentsOfDoctor;
    mapping(address => address[]) doctorsOfPatient;
    mapping(address => address[]) patientsOfDoctor;
    mapping(address => mapping(string => string[])) appointmentsOfADoctorInADay;

    Registration _registration;

    constructor(address registrationA) public {
        _registration = Registration(registrationA);
    }

    modifier onlyPatient {
        require(keccak256(abi.encodePacked((_registration.getRole(tx.origin)))) == keccak256(abi.encodePacked(("PATIENT"))));
        _;
    }

    function addAppointment(Appointment memory appointment) public onlyPatient{
        appointmentsOfPatients[appointment.patient].push(appointment);
        doctorsOfPatient[appointment.patient].push(appointment.doctor);

        appointmentsOfDoctor[appointment.doctor].push(appointment);
        patientsOfDoctor[appointment.doctor].push(appointment.patient);

        appointmentsOfADoctorInADay[appointment.doctor][appointment.dateString].push(appointment.startingHour);

        emit AppointmentAdd(appointment.patient, appointment.doctor, appointment.date, appointment.startingHour, appointment.dateString);
    }

    function getAppointmentsOfDoctor(address _address) public returns(Appointment[] memory){
        return appointmentsOfDoctor[_address];
    }

    function getAppointmentsOfPatient(address _address) public returns(Appointment[] memory){
        return appointmentsOfPatients[_address];
    }

    function getPatientsOfADoctor(address _address) public returns(address[] memory){
        return patientsOfDoctor[_address];
    }

    function getDoctorsOfAPatient(address _address) public returns(address[] memory){
        return doctorsOfPatient[_address];
    }

    function getAppointmentsInADay(address _address, string memory day) public returns(string[] memory){
        return appointmentsOfADoctorInADay[_address][day];
    }
}