/**
 * IdGenerate - A class for generating random IDs.
 *
 * @class
 */
class IdGenerate {
  /**
   * Create an IdGenerate instance.
   *
   * @constructor
   */
  constructor() {
    // No need for initialization in the constructor for this class
  }

  /**
   * Generate a random ID.
   *
   * @returns {string} The generated random ID.
   */
  create() {
    // Define the character set for the ID
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Initialize an empty string to store the generated ID
    let id = '';

    // Loop to generate each character of the ID
    for (let i = 0; i < 8; i++) {
      // Generate a random index within the character set
      const randomIndex = Math.floor(Math.random() * charset.length);

      // Append the randomly selected character to the ID
      id += charset[randomIndex];
    }

    // Return the generated ID
    return id;
  }
}

// Export the IdGenerate class for use in other modules
module.exports = IdGenerate;
