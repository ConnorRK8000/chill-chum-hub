import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';
import { App } from './src/App';

// Register the component
AppRegistry.registerComponent('TeamCoco', () => App);

// For web, use hydrateRoot if the root has server-rendered content, or createRoot
if (typeof window !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    // Check if there's already content (server-rendered)
    if (rootTag.hasChildNodes()) {
      hydrateRoot(rootTag, React.createElement(App));
    } else {
      // Create a new root
      const root = hydrateRoot(rootTag, React.createElement(App));
    }
  }
}

export default App;