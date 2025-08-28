import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { RegisterRequest } from '../types';
import { ValidationUtils } from '../utils';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    name: '',
    phoneNumber: '',
    password: '',
    role: 'USER'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<RegisterRequest & { confirmPassword: string }>>({});

  const validateForm = (): boolean => {
    const errors: Partial<RegisterRequest & { confirmPassword: string }> = {};

    if (!ValidationUtils.isRequired(formData.name)) {
      errors.name = 'Name is required';
    }

    if (!ValidationUtils.isRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!ValidationUtils.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!ValidationUtils.isRequired(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!ValidationUtils.isValidPhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!ValidationUtils.isRequired(formData.password)) {
      errors.password = 'Password is required';
    } else if (!ValidationUtils.isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!ValidationUtils.isRequired(confirmPassword)) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear specific field error when user starts typing
    if (formErrors[name as keyof (RegisterRequest & { confirmPassword: string })]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await authAPI.register(formData);
      
      if (response.statusCode === 200) {
        setSuccess('Registration successful! You can now log in with your credentials.');
        // Reset form
        setFormData({
          email: '',
          name: '',
          phoneNumber: '',
          password: '',
          role: 'USER'
        });
        setConfirmPassword('');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="text-center">
              <h3>Create Your Account</h3>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.name}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.phoneNumber}
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.phoneNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.email}
                    placeholder="Enter your email address"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.password}
                        placeholder="Enter your password"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.confirmPassword}
                        placeholder="Confirm your password"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </Form>

              <hr />
              
              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;