package com.sanjo.backend.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    //Used for general HTTP-like status and success/error messages
    private int statusCode;
    private String message;

    // Useful for authentication responses (e.g., login/signup) or booking confirmation
    private String role;
    private String token;
    private String expirationTime;
    private String bookingConfirmationCode;

    //Individual DTO objects — for responses where only one user/room/booking needs to be returned
    private UserDTO user;
    private RoomDTO room;
    private BookingDTO booking;

    //Lists of DTOs — for responses like get all users, get all rooms
    private List<UserDTO> userList;
    private List<RoomDTO> roomList;
    private List<BookingDTO> bookingList;


}
