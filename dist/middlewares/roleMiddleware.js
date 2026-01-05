"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
/**
 * Role-based authorization middleware
 * Checks if the authenticated user has one of the required roles
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user is authenticated (req.payload should be set by isAuthenticated middleware)
            if (!req.payload) {
                return res.status(401).json({ message: "Authentication required" });
            }
            // Get user role from token payload
            const userRole = req.payload.role;
            // Check if user role is in the allowed roles list
            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "Access denied. Insufficient permissions.",
                    requiredRoles: allowedRoles,
                    userRole: userRole,
                });
            }
            // User has required role, proceed to next middleware
            next();
        }
        catch (error) {
            console.error("Role authorization error:", error);
            return res.status(500).json({ message: "Authorization error" });
        }
    };
};
exports.requireRole = requireRole;
exports.default = exports.requireRole;
