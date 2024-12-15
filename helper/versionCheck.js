export const isVersionLessThan = (currentVersion, targetVersion) => {
  const current = currentVersion.split(".").map(Number);
  const target = targetVersion.split(".").map(Number);

  for (let i = 0; i < target.length; i++) {
    if (current[i] < target[i]) return true;
    if (current[i] > target[i]) return false;
  }
  return false;
};
