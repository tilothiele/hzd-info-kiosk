/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * Calculate age in years from birth date
 * @param birthDate Birth date
 * @param deathDate Optional death date (if null, uses current date)
 * @returns Age in years with decimal places
 */
export declare function calculateAge(birthDate: Date, deathDate?: Date | null): number;
/**
 * Format age for display
 * @param age Age in years
 * @returns Formatted age string
 */
export declare function formatAge(age: number): string;
/**
 * Validate German postal code format
 * @param postalCode Postal code to validate
 * @returns True if valid German postal code
 */
export declare function isValidGermanPostalCode(postalCode: string): boolean;
/**
 * Format German postal code
 * @param postalCode Raw postal code
 * @returns Formatted postal code
 */
export declare function formatPostalCode(postalCode: string): string;
/**
 * Generate a random password
 * @param length Password length (default: 12)
 * @returns Random password string
 */
export declare function generatePassword(length?: number): string;
/**
 * Format phone number for display
 * @param phone Raw phone number
 * @returns Formatted phone number
 */
export declare function formatPhoneNumber(phone: string): string;
/**
 * Calculate Coefficient of Inbreeding (COI) for breeding planning
 * @param dogId Dog ID to calculate COI for
 * @param ancestors Array of ancestor IDs with their relationships
 * @returns COI value (0-1)
 */
export declare function calculateCOI(dogId: string, ancestors: Array<{
    id: string;
    motherId?: string;
    fatherId?: string;
}>): number;
/**
 * Generate breadcrumb navigation from path
 * @param path URL path
 * @returns Array of breadcrumb objects
 */
export declare function generateBreadcrumbs(path: string): Array<{
    label: string;
    href: string;
}>;
/**
 * Debounce function to limit function calls
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Format date for display in German format (d.M.yyyy)
 * @param date Date to format
 * @returns Formatted date string (e.g. "15.5.2023")
 */
export declare function formatDate(date: Date): string;
/**
 * Format date for display with full month name
 * @param date Date to format
 * @param locale Locale for formatting (default: 'de-DE')
 * @returns Formatted date string
 */
export declare function formatDateLong(date: Date, locale?: string): string;
/**
 * Format date and time for display
 * @param date Date to format
 * @param locale Locale for formatting (default: 'de-DE')
 * @returns Formatted date and time string
 */
export declare function formatDateTime(date: Date, locale?: string): string;
/**
 * Check if user has required role
 * @param userRoles Array of user roles
 * @param requiredRole Required role
 * @returns True if user has required role
 */
export declare function hasRole(userRoles: Array<{
    role: string;
    isActive: boolean;
}>, requiredRole: string): boolean;
/**
 * Check if user has any of the required roles
 * @param userRoles Array of user roles
 * @param requiredRoles Array of required roles
 * @returns True if user has any of the required roles
 */
export declare function hasAnyRole(userRoles: Array<{
    role: string;
    isActive: boolean;
}>, requiredRoles: string[]): boolean;
/**
 * Generate pagination info
 * @param page Current page
 * @param limit Items per page
 * @param total Total items
 * @returns Pagination information
 */
export declare function generatePagination(page: number, limit: number, total: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};
/**
 * Sanitize HTML content to prevent XSS
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Generate a slug from a string
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export declare function generateSlug(text: string): string;
/**
 * Get display text for gender value
 * @param gender Gender value (R or H)
 * @returns Display text (Rüde or Hündin)
 */
export declare function getGenderDisplay(gender: string): string;
/**
 * Get gender options for forms
 * @returns Array of gender options with value and label
 */
export declare function getGenderOptions(): Array<{
    value: string;
    label: string;
}>;
//# sourceMappingURL=index.d.ts.map