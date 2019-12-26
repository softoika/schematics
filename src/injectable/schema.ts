export interface InjectableOptions {
  /**
   * The prefix name of the injectable class like User in UserService.
   */
  name: string;
  /**
   * The suffix name of the injectable class like Service in UserService.
   */
  type: string;
}
