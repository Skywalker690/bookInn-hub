package com.sanjo.backend.service.implementation;

import com.sanjo.backend.dto.LoginRequest;
import com.sanjo.backend.dto.Response;
import com.sanjo.backend.dto.UserDTO;
import com.sanjo.backend.entity.User;
import com.sanjo.backend.exception.OurException;
import com.sanjo.backend.repository.UserRepository;
import com.sanjo.backend.service.interfac.IUserService;
import com.sanjo.backend.utils.JWTUtils;
import com.sanjo.backend.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    public Response register(User user) {
        Response response = new Response();
        try {
            if (user.getRole() == null || user.getRole().isBlank() ) {
                user.setRole("USER");
            }

            if (userRepository.existsByEmail(user.getEmail())) {
                throw new OurException(user.getEmail() + "already exist");
                
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);

            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);

        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Registration "+e.getMessage());
        }

        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {

        Response response = new Response();

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new OurException("user Not found"));

            var token = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(token);
            response.setRole(user.getRole());
            response.setExpirationTime("7 Days");
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Login " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllUsers() {

        Response response = new Response();
        try {

            List<User> userList = userRepository.findAll();
            List<UserDTO> userDTOList =Utils.mapUserListEntityToUserListDTO(userList);
            response.setStatusCode(200);
            response.setMessage("Successful");
            response.setUserList(userDTOList);


        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred While Getting All Users "+e.getMessage());
        }
        return response;

    }

    @Override
    public Response getUserBookingHistory(String userId) {
        Response response = new Response();
        try {

            User user =userRepository.findById(Long.valueOf(userId)).orElseThrow(
                    () -> new OurException("User not Found"));
            UserDTO dto = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);

            response.setStatusCode(200);
            response.setMessage("Successful");
            response.setUser(dto);



        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred While Getting Booking History "+e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteUser(String userId) {
        Response response = new Response();
        try {
            User user =userRepository.findById(Long.valueOf(userId)).orElseThrow(
                    () -> new OurException("User not Found"));
            userRepository.deleteById(Long.valueOf(userId));

            response.setStatusCode(200);
            response.setMessage("Successful");

        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred While Getting Deleting User "+e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserById(String userId) {
        Response response = new Response();
        try {
            User user =userRepository.findById(Long.valueOf(userId)).orElseThrow(
                    () -> new OurException("User not Found"));
            UserDTO dto =Utils.mapUserEntityToUserDTO(user);

            response.setUser(dto);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred While Getting Deleting User "+e.getMessage());
        }
        return response;
    }

    @Override
    public Response getMyInfo(String email) {
        Response response = new Response();
        try {
            User user =userRepository.findByEmail(email).orElseThrow(
                    () -> new OurException("User not Found"));
            UserDTO dto =Utils.mapUserEntityToUserDTO(user);

            response.setUser(dto);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred While Getting Deleting User "+e.getMessage());
        }
        return response;
    }
}
