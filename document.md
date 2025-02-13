# Chatbot Project Documentation

## Project Structure

```
chatbot_backend/
	chatbot/
		__init__.py
		__pycache__/
			__init__.cpython-312.pyc
			admin.cpython-312.pyc
			apps.cpython-312.pyc
			forms.cpython-312.pyc
			managers.cpython-312.pyc
			models.cpython-312.pyc
			serializers.cpython-312.pyc
			tests.cpython-312.pyc
			urls.cpython-312.pyc
			views.cpython-312.pyc
		admin.py
		apps.py
		managers.py
		migrations/
			__init__.py
			__pycache__/
				__init__.cpython-312.pyc
				0001_initial.cpython-312.pyc
				0002_customuser_is_superuser.cpython-312.pyc
				0003_remove_customuser_is_active_and_more.cpython-312.pyc
			0001_initial.py
			0002_customuser_is_superuser.py
			0003_remove_customuser_is_active_and_more.py
		models.py
		serializers.py
		tests.py
		urls.py
		views.py
	chatbot_backend/
		__init__.py
		__pycache__/
			__init__.cpython-312.pyc
			settings.cpython-312.pyc
			urls.cpython-312.pyc
			wsgi.cpython-312.pyc
		asgi.py
		settings.py
		urls.py
		wsgi.py
	chatbot_logs.log
	db.sqlite3
	manage.py
	Procfile
	requirements.txt
chatbot-frontend/
	eslint.config.js
	index.html
	package.json
	postcss.config.js
	public/
		vite.svg
	README.md
	src/
		App.css
		App.jsx
		assets/
			react.svg
		index.css
		main.jsx
		pages/
			Chat.jsx
			Login.jsx
			Signup.jsx
	tailwind.config.js
	vite.config.js
document.md
README.md
```

## Backend

The backend is built using Django and is located in the `chatbot_backend` directory. It handles the logic and processing of the chatbot's responses.

### Key Files

- `manage.py`: Django's command-line utility for administrative tasks.
- `settings.py`: Configuration for the Django project.
- `urls.py`: URL routing for the Django project.
- `wsgi.py`: WSGI configuration for the Django project.
- `asgi.py`: ASGI configuration for the Django project.
- `models.py`: Defines the data models for the application.
- `views.py`: Handles the logic for the application's views.
- `serializers.py`: Serializes and deserializes data for the API.
- `tests.py`: Contains tests for the application.
- `requirements.txt`: Lists the dependencies for the backend.
- `Procfile`: Configuration for deploying the application using Gunicorn.

## Frontend

The frontend is built using React and is located in the `chatbot-frontend` directory. It provides a dynamic and responsive user interface for interacting with the chatbot.

### Key Files

- `index.html`: The main HTML file for the frontend.
- `package.json`: Lists the dependencies and scripts for the frontend.
- `App.jsx`: The main React component for the application.
- `main.jsx`: The entry point for the React application.
- `index.css`: Global CSS styles for the application.
- `App.css`: CSS styles for the main React component.
- `Chat.jsx`: React component for the chat interface.
- `Login.jsx`: React component for the login interface.
- `Signup.jsx`: React component for the signup interface.
- `tailwind.config.js`: Configuration for Tailwind CSS.
- `vite.config.js`: Configuration for Vite.
- `postcss.config.js`: Configuration for PostCSS.
- `eslint.config.js`: Configuration for ESLint.

