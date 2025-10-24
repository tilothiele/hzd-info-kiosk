"use strict";
// Utility functions for the Hovawart database application
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
exports.calculateAge = calculateAge;
exports.formatAge = formatAge;
exports.isValidGermanPostalCode = isValidGermanPostalCode;
exports.formatPostalCode = formatPostalCode;
exports.generatePassword = generatePassword;
exports.formatPhoneNumber = formatPhoneNumber;
exports.calculateCOI = calculateCOI;
exports.generateBreadcrumbs = generateBreadcrumbs;
exports.debounce = debounce;
exports.formatDate = formatDate;
exports.formatDateLong = formatDateLong;
exports.formatDateTime = formatDateTime;
exports.hasRole = hasRole;
exports.hasAnyRole = hasAnyRole;
exports.generatePagination = generatePagination;
exports.sanitizeHtml = sanitizeHtml;
exports.generateSlug = generateSlug;
exports.getGenderDisplay = getGenderDisplay;
exports.getGenderOptions = getGenderOptions;
/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/**
 * Calculate age in years from birth date
 * @param birthDate Birth date
 * @param deathDate Optional death date (if null, uses current date)
 * @returns Age in years with decimal places
 */
function calculateAge(birthDate, deathDate) {
    const endDate = deathDate || new Date();
    const diffTime = endDate.getTime() - birthDate.getTime();
    return diffTime / (1000 * 60 * 60 * 24 * 365.25); // Account for leap years
}
/**
 * Format age for display
 * @param age Age in years
 * @returns Formatted age string
 */
function formatAge(age) {
    const years = Math.floor(age);
    const months = Math.floor((age - years) * 12);
    if (years === 0) {
        return `${months} Monat${months !== 1 ? 'e' : ''}`;
    }
    else if (months === 0) {
        return `${years} Jahr${years !== 1 ? 'e' : ''}`;
    }
    else {
        return `${years} Jahr${years !== 1 ? 'e' : ''} und ${months} Monat${months !== 1 ? 'e' : ''}`;
    }
}
/**
 * Validate German postal code format
 * @param postalCode Postal code to validate
 * @returns True if valid German postal code
 */
function isValidGermanPostalCode(postalCode) {
    return /^\d{5}$/.test(postalCode);
}
/**
 * Format German postal code
 * @param postalCode Raw postal code
 * @returns Formatted postal code
 */
function formatPostalCode(postalCode) {
    return postalCode.replace(/\D/g, '').slice(0, 5);
}
/**
 * Generate a random password
 * @param length Password length (default: 12)
 * @returns Random password string
 */
function generatePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}
/**
 * Format phone number for display
 * @param phone Raw phone number
 * @returns Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // German phone number formatting
    if (cleaned.startsWith('49')) {
        // International format: +49 123 4567890
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    else if (cleaned.startsWith('0')) {
        // National format: 0123 4567890
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    }
    return phone;
}
/**
 * Calculate Coefficient of Inbreeding (COI) for breeding planning
 * @param dogId Dog ID to calculate COI for
 * @param ancestors Array of ancestor IDs with their relationships
 * @returns COI value (0-1)
 */
function calculateCOI(dogId, ancestors) {
    // Simplified COI calculation
    // In a real implementation, this would use a more sophisticated algorithm
    const dog = ancestors.find(a => a.id === dogId);
    if (!dog || !dog.motherId || !dog.fatherId)
        return 0;
    const mother = ancestors.find(a => a.id === dog.motherId);
    const father = ancestors.find(a => a.id === dog.fatherId);
    if (!mother || !father)
        return 0;
    // Check for common ancestors
    const motherAncestors = getAncestors(mother, ancestors);
    const fatherAncestors = getAncestors(father, ancestors);
    const commonAncestors = motherAncestors.filter(id => fatherAncestors.includes(id));
    // Simplified COI calculation based on common ancestors
    return commonAncestors.length * 0.125; // Simplified formula
}
/**
 * Get all ancestors of a dog
 */
function getAncestors(dog, ancestors) {
    const result = [];
    if (dog.motherId) {
        result.push(dog.motherId);
        const mother = ancestors.find(a => a.id === dog.motherId);
        if (mother) {
            result.push(...getAncestors(mother, ancestors));
        }
    }
    if (dog.fatherId) {
        result.push(dog.fatherId);
        const father = ancestors.find(a => a.id === dog.fatherId);
        if (father) {
            result.push(...getAncestors(father, ancestors));
        }
    }
    return result;
}
/**
 * Generate breadcrumb navigation from path
 * @param path URL path
 * @returns Array of breadcrumb objects
 */
function generateBreadcrumbs(path) {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';
    for (const segment of segments) {
        currentPath += `/${segment}`;
        const label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        breadcrumbs.push({
            label,
            href: currentPath
        });
    }
    return breadcrumbs;
}
/**
 * Debounce function to limit function calls
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
/**
 * Format date for display in German format (d.M.yyyy)
 * @param date Date to format
 * @returns Formatted date string (e.g. "15.5.2023")
 */
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
/**
 * Format date for display with full month name
 * @param date Date to format
 * @param locale Locale for formatting (default: 'de-DE')
 * @returns Formatted date string
 */
function formatDateLong(date, locale = 'de-DE') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}
/**
 * Format date and time for display
 * @param date Date to format
 * @param locale Locale for formatting (default: 'de-DE')
 * @returns Formatted date and time string
 */
function formatDateTime(date, locale = 'de-DE') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
/**
 * Check if user has required role
 * @param userRoles Array of user roles
 * @param requiredRole Required role
 * @returns True if user has required role
 */
function hasRole(userRoles, requiredRole) {
    return userRoles.some(role => role.role === requiredRole && role.isActive);
}
/**
 * Check if user has any of the required roles
 * @param userRoles Array of user roles
 * @param requiredRoles Array of required roles
 * @returns True if user has any of the required roles
 */
function hasAnyRole(userRoles, requiredRoles) {
    return requiredRoles.some(role => hasRole(userRoles, role));
}
/**
 * Generate pagination info
 * @param page Current page
 * @param limit Items per page
 * @param total Total items
 * @returns Pagination information
 */
function generatePagination(page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
}
/**
 * Sanitize HTML content to prevent XSS
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
function sanitizeHtml(html) {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
/**
 * Generate a slug from a string
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
/**
 * Get display text for gender value
 * @param gender Gender value (R or H)
 * @returns Display text (Rüde or Hündin)
 */
function getGenderDisplay(gender) {
    switch (gender) {
        case 'R':
            return 'Rüde';
        case 'H':
            return 'Hündin';
        default:
            return gender;
    }
}
/**
 * Get gender options for forms
 * @returns Array of gender options with value and label
 */
function getGenderOptions() {
    return [
        { value: 'R', label: 'Rüde' },
        { value: 'H', label: 'Hündin' }
    ];
}
//# sourceMappingURL=index.js.map