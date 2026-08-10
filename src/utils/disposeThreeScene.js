/**
 * disposeThreeScene.js — complete teardown for a three.js surface.
 *
 * `renderer.dispose()` alone is not enough, and every WebGL surface in this app
 * was relying on it:
 *
 *   - It frees three's internal caches, but does NOT release the underlying
 *     WebGL context. Browsers cap live contexts (commonly ~16) and silently drop
 *     the oldest when you exceed it, which shows up as a canvas that has gone
 *     black or stopped animating somewhere else in the app.
 *   - Geometries, materials, and textures are GPU-side handles. They are not
 *     garbage collected — they leak until explicitly disposed.
 *
 * This app has six WebGL surfaces (Orb, VoiceOrb3D, Home2Voyage, KnowledgeGalaxy,
 * HomePage3, Roadmap3) and no page reloads to reset any of it, so the leak is
 * cumulative across a session.
 *
 * Call from the useEffect cleanup, after cancelling the animation frame.
 */

/** Dispose a material and every texture it references. */
function disposeMaterial(material) {
  if (!material) return;
  for (const value of Object.values(material)) {
    // Textures, render targets, and cube maps all expose dispose().
    if (value && typeof value === 'object' && typeof value.dispose === 'function' && value.isTexture) {
      value.dispose();
    }
  }
  material.dispose?.();
}

/**
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 * @param {HTMLElement} [mount] Container to detach the canvas from.
 * @param {{preserveCanvas?: boolean}} [options] Keep a React-owned canvas and
 * its context alive when the scene is being recreated in place.
 */
export function disposeThreeScene(scene, renderer, mount, { preserveCanvas = false } = {}) {
  if (scene) {
    scene.traverse((object) => {
      object.geometry?.dispose?.();
      const material = object.material;
      if (Array.isArray(material)) material.forEach(disposeMaterial);
      else disposeMaterial(material);
    });
    scene.clear?.();
  }

  if (renderer) {
    renderer.dispose();
    if (preserveCanvas) return;
    // Release the GL context itself. Without this the context stays live for the
    // lifetime of the tab even though nothing references the renderer.
    renderer.forceContextLoss?.();
    const canvas = renderer.domElement;
    if (canvas && mount?.contains(canvas)) mount.removeChild(canvas);
    else canvas?.remove?.();
  }
}
