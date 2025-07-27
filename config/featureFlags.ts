// Feature Flags Configuration
// Set to false to disable freemium features and enable full app functionality for testing

export const FEATURE_FLAGS = {
  // Set to false to disable all freemium restrictions
  FREEMIUM_ENABLED: false,
  
  // Individual feature flags for granular control
  PREMIUM_UPGRADE_MODAL: false,
  BLURRED_OVERLAYS: false,
  PREMIUM_SETTINGS_RESTRICTIONS: false,
  UPLOAD_TRACKING: false,
} as const;

// Helper function to check if freemium is enabled
export const isFreemiumEnabled = (): boolean => {
  return FEATURE_FLAGS.FREEMIUM_ENABLED;
};

// Helper function to check if a specific feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
}; 