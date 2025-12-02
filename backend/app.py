"""
Simplified Flask Application Entry Point
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3

# Load environment variables BEFORE importing anything else
load_dotenv()

from flask import Flask
from flask_cors import CORS
from models import db
from controllers import project_bp, page_bp, template_bp, user_template_bp, export_bp, file_bp, material_bp


# Enable SQLite WAL mode for all connections
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_conn, connection_record):
    """
    Enable WAL mode and related PRAGMAs for each SQLite connection.
    Registered once at import time to avoid duplicate handlers when
    create_app() is called multiple times.
    """
    # Only apply to SQLite connections
    if not isinstance(dbapi_conn, sqlite3.Connection):
        return

    cursor = dbapi_conn.cursor()
    try:
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA busy_timeout=30000")  # 30 seconds timeout
    finally:
        cursor.close()


def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Basic configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Database configuration (use absolute path)
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    instance_dir = os.path.join(backend_dir, 'instance')
    os.makedirs(instance_dir, exist_ok=True)
    
    db_path = os.path.join(instance_dir, 'database.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    
    # File storage configuration
    project_root = os.path.dirname(backend_dir)
    upload_folder = os.path.join(project_root, 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    app.config['UPLOAD_FOLDER'] = upload_folder
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # AI configuration
    app.config['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY', '')
    app.config['GOOGLE_API_BASE'] = os.getenv('GOOGLE_API_BASE', '')
    app.config['MAX_DESCRIPTION_WORKERS'] = int(os.getenv('MAX_DESCRIPTION_WORKERS', '5'))
    app.config['MAX_IMAGE_WORKERS'] = int(os.getenv('MAX_IMAGE_WORKERS', '8'))
    app.config['DEFAULT_ASPECT_RATIO'] = "16:9"
    app.config['DEFAULT_RESOLUTION'] = "2K"
    
    # CORS configuration
    raw_cors = os.getenv('CORS_ORIGINS', 'http://localhost:5173')
    if raw_cors.strip() == '*':
        cors_origins = '*'
    else:
        cors_origins = [o.strip() for o in raw_cors.split(',') if o.strip()]
    app.config['CORS_ORIGINS'] = cors_origins
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=cors_origins)
    
    # Register blueprints
    app.register_blueprint(project_bp)
    app.register_blueprint(page_bp)
    app.register_blueprint(template_bp)
    app.register_blueprint(user_template_bp)
    app.register_blueprint(export_bp)
    app.register_blueprint(file_bp)
    app.register_blueprint(material_bp)
    
    with app.app_context():
        db.create_all()
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'message': 'Banana Slides API is running'}
    
    # Root endpoint
    @app.route('/')
    def index():
        return {
            'name': 'Banana Slides API',
            'version': '1.0.0',
            'description': 'AI-powered PPT generation service',
            'endpoints': {
                'health': '/health',
                'api_docs': '/api',
                'projects': '/api/projects'
            }
        }
    
    return app


# Create app instance
app = create_app()


if __name__ == '__main__':
    # Run development server
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f"""
    ╔══════════════════════════════════════╗
    ║   🍌 Banana Slides API Server 🍌   ║
    ╚══════════════════════════════════════╝
    
    Server starting on: http://localhost:{port}
    Environment: {os.getenv('FLASK_ENV', 'development')}
    Debug mode: {debug}
    
    API Base URL: http://localhost:{port}/api
    Database: {app.config['SQLALCHEMY_DATABASE_URI']}
    Uploads: {app.config['UPLOAD_FOLDER']}
    """)
    
    # Enable reloader for hot reload in development
    # Using absolute paths for database, so WSL path issues should not occur
    app.run(host='0.0.0.0', port=port, debug=debug, use_reloader=True)

