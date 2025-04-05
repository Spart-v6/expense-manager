export function getDeepestRouteName(navState) {
  if (!navState) return null;

  const route = navState.routes[navState.index];

  // If there's nested state, go deeper
  if (route.state) {
    return getDeepestRouteName(route.state);
  }

  // Handle edge case: App just loaded & we're in "Main" with no nested state yet
  if (route.name === 'Main' && !route.state) {
    return 'HomeScreen';
  }

  return route.name;
}
