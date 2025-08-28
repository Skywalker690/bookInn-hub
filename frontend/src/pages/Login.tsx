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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { LoginRequest } from '../types';
import { AuthUtils, ValidationUtils } from '../utils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginRequest>>({});

  // Get the intended destination from location state, default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const validateForm = (): boolean => {
    const errors: Partial<LoginRequest> = {};

    if (!ValidationUtils.isRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!ValidationUtils.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!ValidationUtils.isRequired(formData.password)) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name as keyof LoginRequest]) {
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

      const response = await authAPI.login(formData);
      
      if (response.statusCode === 200) {
        // Store auth data
        AuthUtils.setAuthData(
          response.token!,
          response.user!,
          response.role!
        );
        
        // Navigate to intended destination or home
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred during login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header className="text-center">
              <h3>Login to BookInn Hub</h3>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.email}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

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
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
              </Form>

              <hr />
              
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Sign up here
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

export default Login;