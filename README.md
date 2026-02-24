# ♟️ PyChess Front

Frontend application built to interact with the PyChess API, providing a structured and interactive interface for chess game management and automated move analysis.

This project focuses on component organization, API consumption, state management and clean frontend architecture.

---

## 🏗 Architecture Overview

The application follows a structured component-based architecture:

- **Pages Layer** – Application views and route management
- **Components Layer** – Reusable UI components
- **Services Layer** – Centralized API communication
- **State Management** – Game state control and synchronization with backend
- **UI Layer** – Structured layout and interaction logic

This separation improves maintainability, readability and scalability.

---

## 🔍 Core Features

- Chess board interface
- Integration with PyChess API
- Real-time move validation
- Automated move analysis display
- Game history visualization
- Structured API request handling
- Error handling and feedback rendering

---

## 🔌 Backend Integration

The frontend communicates with the PyChess API through structured HTTP requests.

Responsibilities handled on frontend:

- Sending move requests
- Displaying move analysis
- Rendering board state
- Handling API errors
- Managing user interactions

All business rules remain centralized in the backend.

---

## ⚙️ Tech Stack

- React
- Next.js (if applicable)
- JavaScript / TypeScript
- REST API Integration
- Component-Based Architecture

---

## 🚀 Running Locally

### 1. Install dependencies

```bash
npm install

yarn install
```

### 2. Run development server

```bash
npm run dev

yarn dev
```

---

## 🌐 Application Flow

- User performs a move on the board
- Frontend sends request to backend
- Backend validates move and integrates with Stockfish
- Response is returned with move evaluation
- Frontend updates board and displays analysis

---

## 📌 Design Considerations

- Clean component separation
- Centralized API service layer
- Scalable structure for future features
- Prepared for authentication integration
- Responsive UI foundation

---

## 📈 Planned Improvements

- Global state management (Context API or Zustand)
- Authentication integration (JWT)
- Protected routes
- Performance optimization
- UI/UX refinements
- Docker setup
- Deployment configuration

---

## 🎯 Purpose of the Project
- This project was developed to demonstrate:
- Structured frontend architecture
- Clean API consumption
- Backend integration best practices
- Scalable component organization
- Real-world application workflow

---

## 🤝 Contributions

Contributions and architectural suggestions are welcome.
Feel free to open issues or submit pull requests.
