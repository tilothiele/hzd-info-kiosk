import bcrypt from 'bcryptjs'

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Hash the default password "startstart"
 * This is used to generate the hashed password for mock users
 */
export async function hashDefaultPassword(): Promise<string> {
  return await hashPassword('startstart')
}

// CLI usage
if (require.main === module) {
  hashDefaultPassword().then(hashed => {
    console.log('Hashed password for "startstart":', hashed)
    console.log('Use this in your mock user data')
  }).catch(console.error)
}
