export function getDeepestRoute(navState) {
  if (!navState) return null;

  const route = navState.routes[navState.index];

  if (route.state) {
    return getDeepestRoute(route.state);
  }

  // Special case for initial Main load
  if (route.name === 'Main' && !route.state) {
    return { name: 'HomeScreen', params: null };
  }

  return { name: route.name, params: route.params || null };
}
