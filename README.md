# React + Vite

Here are the instructions and information you requested:

1. How to run the application:


a. Prerequisites:

- Make sure you have Node.js and npm (Node Package Manager) installed on your system.


b. Installation:

- Open a terminal and navigate to your project directory.
- Run the following command to install dependencies:

```plaintext
npm install
```




c. Starting the development server:

- In the terminal, run:

```plaintext
npm run dev
```


- This will start the development server, typically on [http://localhost:3000](http://localhost:3000)


d. Accessing the application:

- Open a web browser and go to [http://localhost:3000](http://localhost:3000)
- You should see the login page of the application.


2. How the simulated authentication works:


The application uses a simplified authentication system for demonstration purposes:

- When you first access the application, you'll be presented with a login page.
- There are no predefined usernames or passwords. Instead, you choose a role (Admin, Editor, or Viewer) to log in.
- Upon selecting a role and clicking "Login", the application will:
a. Create a user object with the selected role.
b. Store this user object in localStorage to persist the session.
c. Update the AuthContext to reflect the logged-in state.
- The application then redirects you to the main user list page.
- Different functionalities are available based on the role you chose:

- Admins can view, add, edit, and delete users.
- Editors can view and edit user details but cannot add or delete users.
- Viewers can only view user details.



- Logging out will clear the user data from localStorage and reset the AuthContext.


3. Brief description of the approach and design decisions:


a. Architecture:

- The project uses React with functional components and hooks for state management.
- It follows a component-based architecture for modularity and reusability.


b. State Management:

- Global state (auth and theme) is managed using React Context (AuthContext).
- Complex local state in the UserList component is managed using useReducer for better organization and scalability.
- Simpler local state in the UserDetailsModal is managed using useState.


c. Data Persistence:

- User data is initially fetched from the Random User API and stored in localStorage.
- Subsequent loads use the data from localStorage to reduce API calls and improve performance.
- User list state (filters, sorting, pagination) is also persisted in localStorage for a better user experience across sessions.


d. Styling:

- The application uses Tailwind CSS for responsive and utility-first styling.
- A dark/light theme toggle is implemented for user preference.


e. User Experience:

- The application includes features like search, filtering, sorting, and pagination for better data management.
- A modal is used for viewing and editing user details, providing a smooth in-page experience.


f. Error Handling:

- Basic error handling is implemented for API requests, with user-friendly error messages displayed.


g. Testing:

- Integration tests are included to verify authentication and authorization functionality.


h. Performance Considerations:

- React.memo is used to prevent unnecessary re-renders of components.
- useMemo and useCallback are utilized for expensive computations and to stabilize function references.


This approach aims to create a scalable, maintainable, and user-friendly application that demonstrates best practices in React development while simulating a real-world user management system.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
