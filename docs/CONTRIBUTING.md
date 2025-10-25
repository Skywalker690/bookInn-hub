# Contributing Guidelines

Thank you for considering contributing to BookInn Hub! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)
8. [Pull Request Process](#pull-request-process)
9. [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of age, body size, disability, ethnicity, gender identity, experience level, nationality, personal appearance, race, religion, or sexual identity.

### Expected Behavior

- Be respectful and constructive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or insulting comments
- Publishing others' private information
- Sexual language or imagery
- Other conduct considered inappropriate in a professional setting

---

## Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/BookInn-Hub.git
cd BookInn-Hub
```

### 3. Set Up Development Environment

Follow the [Development Setup Guide](./DEVELOPMENT_SETUP.md) to configure your local environment.

### 4. Add Upstream Remote

```bash
git remote add upstream https://github.com/Skywalker690/BookInn-Hub.git
```

### 5. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

---

## How to Contribute

### Ways to Contribute

1. **Code Contributions**
   - Fix bugs
   - Add new features
   - Improve performance
   - Refactor code

2. **Documentation**
   - Improve existing documentation
   - Add tutorials or guides
   - Fix typos or clarify instructions
   - Translate documentation

3. **Testing**
   - Write unit tests
   - Write integration tests
   - Report bugs
   - Test new features

4. **Design**
   - Improve UI/UX
   - Create mockups
   - Improve accessibility

5. **Community**
   - Answer questions in issues
   - Review pull requests
   - Help others get started

---

## Development Workflow

### 1. Sync Your Fork

Before starting work, sync with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes

- Write clean, maintainable code
- Follow coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

**Backend:**
```bash
cd backend
./mvnw test
```

**Frontend:**
```bash
cd frontend
npm test
```

### 5. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add amazing feature

- Implement feature X
- Update documentation
- Add tests for feature X"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Example:**
```
feat: Add room availability calendar

- Implement calendar component
- Add date range selection
- Integrate with availability API
- Add tests for calendar logic

Closes #123
```

### 6. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 7. Create Pull Request

Go to GitHub and create a pull request from your branch to the main repository's `main` branch.

---

## Coding Standards

### Backend (Java/Spring Boot)

#### Code Style

- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Use 4 spaces for indentation
- Maximum line length: 120 characters
- Use meaningful variable and method names

#### Best Practices

```java
// Good
public Response getRoomById(Long roomId) {
    Optional<Room> room = roomRepository.findById(roomId);
    if (room.isEmpty()) {
        throw new OurException("Room not found");
    }
    return buildSuccessResponse(room.get());
}

// Avoid
public Response r(Long id) {
    Room r = roomRepository.findById(id).get();  // Unsafe
    return new Response(200, "Success", r);
}
```

#### Lombok Usage

Use Lombok annotations appropriately:
```java
@Data
@Entity
@Table(name = "room")
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    // fields
}
```

#### Service Layer

- Keep controllers thin
- Put business logic in services
- Use interface-based service design

#### Exception Handling

- Use custom exceptions (`OurException`)
- Provide meaningful error messages
- Return appropriate HTTP status codes

### Frontend (React/TypeScript)

#### Code Style

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Use TypeScript for type safety

#### Component Structure

```tsx
// Good
interface RoomCardProps {
  room: Room;
  onBook: (roomId: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  const handleBook = () => {
    onBook(room.id);
  };

  return (
    <div className="room-card">
      <h3>{room.roomType}</h3>
      <button onClick={handleBook}>Book Now</button>
    </div>
  );
};

export default RoomCard;
```

#### Hooks Usage

- Use functional components
- Use hooks appropriately (useState, useEffect, etc.)
- Create custom hooks for reusable logic

```tsx
// Custom hook example
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthUtils.isAuthenticated()
  );

  const login = async (credentials: LoginRequest) => {
    // login logic
  };

  return { isAuthenticated, login };
};
```

#### State Management

- Use local state for component-specific data
- Use Context API for shared state (if needed)
- Keep state close to where it's used

#### API Calls

- Use the centralized API service
- Handle errors appropriately
- Show loading states

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchRooms = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await roomAPI.getAllRooms();
    setRooms(response.roomList);
  } catch (err) {
    setError('Failed to load rooms');
  } finally {
    setLoading(false);
  }
};
```

---

## Testing Guidelines

### Backend Testing

#### Unit Tests

Test individual methods and classes:

```java
@Test
public void testGetRoomById_Success() {
    // Arrange
    Long roomId = 1L;
    Room mockRoom = new Room();
    mockRoom.setId(roomId);
    when(roomRepository.findById(roomId))
        .thenReturn(Optional.of(mockRoom));

    // Act
    Response response = roomService.getRoomById(roomId);

    // Assert
    assertEquals(200, response.getStatusCode());
    assertNotNull(response.getRoom());
}
```

#### Integration Tests

Test controller endpoints:

```java
@SpringBootTest
@AutoConfigureMockMvc
public class RoomControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllRooms() throws Exception {
        mockMvc.perform(get("/rooms/all"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.statusCode").value(200));
    }
}
```

### Frontend Testing

#### Component Tests

```tsx
import { render, screen } from '@testing-library/react';
import RoomCard from './RoomCard';

test('renders room information', () => {
  const mockRoom = {
    id: 1,
    roomType: 'Deluxe',
    roomPrice: 150,
  };

  render(<RoomCard room={mockRoom} onBook={() => {}} />);
  
  expect(screen.getByText('Deluxe')).toBeInTheDocument();
});
```

#### Test Coverage

- Aim for at least 70% test coverage
- Focus on critical business logic
- Test edge cases and error conditions

---

## Documentation

### Code Documentation

**Backend:**
```java
/**
 * Retrieves a room by its ID.
 *
 * @param roomId the ID of the room to retrieve
 * @return Response object containing room details
 * @throws OurException if room is not found
 */
public Response getRoomById(Long roomId) {
    // implementation
}
```

**Frontend:**
```tsx
/**
 * RoomCard component displays room information and booking button.
 *
 * @param room - Room object with room details
 * @param onBook - Callback function when book button is clicked
 */
```

### README Updates

If your changes affect setup or usage:
- Update README.md
- Update relevant documentation files
- Add examples if applicable

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commits are clean and well-described
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes
- Include relevant details

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

1. Maintainers will review your PR
2. Address feedback and make requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged!

### After Merging

1. Delete your feature branch
2. Sync your fork with upstream
3. Celebrate your contribution! 🎉

---

## Issue Guidelines

### Creating Issues

**Bug Reports:**
```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 90]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

**Feature Requests:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
A clear description of what you want

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information
```

### Working on Issues

1. Comment on the issue to indicate you're working on it
2. Reference the issue in your PR (e.g., "Fixes #123")
3. Keep the issue updated with progress

---

## Questions?

If you have questions:
- Check existing documentation
- Search through issues (open and closed)
- Create a new issue with the "question" label
- Reach out to maintainers

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project acknowledgments
- Release notes (for significant contributions)

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for contributing to BookInn Hub! Your efforts help make this project better for everyone. 🚀
