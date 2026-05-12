export async function loadGameConfig(path = 'config/game_config.json') {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load game config (${response.status}): ${path}`);
  }
  return response.json();
}

export async function loadLevelConfig(levelId, basePath = 'config') {
  const path = `${basePath}/level_${levelId}.json`;
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load level config (${response.status}): ${path}`);
  }
  return response.json();
}
