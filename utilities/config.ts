class AppConfig {
  /**
   * fetches the base server url from env variables
   */
  get serverUrl(): string {
    if (process.env.NODE_ENV === "production") {
      return process.env.NEXT_PUBLIC_API_BASE_URL as string;
    }

    return process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  /**
   * whether the environment is development
   */
  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  /**
   * whether the environment is production
   */
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
}

export const config = new AppConfig();
