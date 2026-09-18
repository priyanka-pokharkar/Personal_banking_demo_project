/// <reference types="jest" />
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Initialize Angular testing environment for Jest
setupZoneTestEnv();

// Global mock configuration for browser URL object
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'URL', {
    writable: true,
    value: {
      createObjectURL: jest.fn(() => 'blob:http://localhost/mocked-url'),
      revokeObjectURL: jest.fn(),
    },
  });
}