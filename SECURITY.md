# Security Considerations

## Authentication & Authorization

### Token Storage
- **JWT tokens are stored in localStorage**: While this is a common practice for SPAs, be aware that localStorage is vulnerable to XSS attacks. Ensure proper XSS protection is in place.
- **Token in Query Parameters**: Currently, tokens are passed as query parameters in some API calls. For production use, consider migrating to Authorization headers using Bearer token format to prevent token exposure in logs.

### GitHub OAuth
- **Client Credentials**: Ensure GitHub OAuth credentials are never committed to version control. Use environment variables exclusively.
- **Callback URL**: The OAuth callback URL must be registered in your GitHub OAuth app settings.

## Dependencies

### Fixed Vulnerabilities
This project has updated dependencies to fix known security vulnerabilities:
- `fastapi`: Updated to 0.115.6 (from 0.104.1) - Fixed ReDoS vulnerability
- `python-multipart`: Updated to 0.0.22 (from 0.0.6) - Fixed file write and DoS vulnerabilities
- `python-jose`: Updated to 3.4.0 (from 3.3.0) - Fixed algorithm confusion vulnerability

### Known Development Issues
- **Vite/esbuild**: The frontend uses Vite 5.x which has a moderate severity vulnerability (GHSA-67mh-4wv8-2f99) related to the development server. This only affects development and does not impact production builds.

## Best Practices

### Secrets Management
- **SECRET_KEY**: Always set a strong, random SECRET_KEY environment variable in production
- **Never use default values**: The default SECRET_KEY in the code is for development only

### Database Security
- **SQLite**: While suitable for development and small deployments, consider PostgreSQL or MySQL for production
- **SQL Injection**: SQLAlchemy ORM provides protection against SQL injection attacks

### CORS Configuration
- The backend is configured to allow requests from `http://localhost:3000` by default
- Update the `FRONTEND_URL` environment variable for production deployments

## Production Deployment Recommendations

1. **Use HTTPS**: Always serve your application over HTTPS in production
2. **Secure Headers**: Implement security headers (HSTS, CSP, X-Frame-Options, etc.)
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **Token Refresh**: Implement token refresh mechanism for better security
5. **Input Validation**: All user inputs are validated using Pydantic models
6. **Environment Variables**: Use a secrets management service for production

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainer directly rather than opening a public issue.
