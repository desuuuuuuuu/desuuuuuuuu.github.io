import { Component } from 'react';

// Renders nothing if a WebGL canvas crashes, so a GPU/driver failure
// never takes down the whole page.
class CanvasGuard extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default CanvasGuard;
