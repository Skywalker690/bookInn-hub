package com.sanjo.backend.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.regions.Regions;
import com.sanjo.backend.exception.OurException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class AwsS3Service {

    @Value("${bucket-name}")
    private String bucketName;
    @Value("${aws.s3.access.key}")
    private String accessKey;
    @Value("${aws.s3.secret.key}")
    private String secretKey;

    public String saveImageToS3(MultipartFile photo) {
        String s3LocationImage = null;

        try {
            // Get original file name (e.g., "image.jpg")
            String s3FileName = photo.getOriginalFilename();

            // Create AWS credentials using access and secret keys
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);

            // Build the Amazon S3 client with credentials and region
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion(Regions.EU_NORTH_1) // Ensure this matches your S3 bucket region
                    .build();

            // Convert uploaded file to InputStream
            InputStream inputStream = photo.getInputStream();

            // Set file metadata (MIME type, content size, etc.)
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/jpeg"); // Hardcoded — can be dynamic using photo.getContentType()

            // Create a request to put the object in the S3 bucket
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, inputStream, metadata);

            // Upload the file to S3
            s3Client.putObject(putObjectRequest);

            // Return the public S3 URL of the uploaded image
            return "https://" + bucketName + ".s3.amazonaws.com/" + s3FileName;

        } catch (Exception e) {
            throw new OurException("Unable to Upload image: " + e.getMessage());
        }
    }
}
