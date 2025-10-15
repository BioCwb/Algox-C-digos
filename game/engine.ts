import type { PlayerState, Level, Grid, SimpleBlockType } from '../types';

export function executeStep(player: PlayerState, block: SimpleBlockType, grid: Grid): { newPlayerState: PlayerState; grid: Grid } {
  let { x, y, dir, hasItem } = player;
  const newGrid = JSON.parse(JSON.stringify(grid));

  switch (block) {
    case 'forward':
      if (dir === 'right' && x < grid[0].length - 1 && grid[y][x + 1].type !== 'wall') x++;
      if (dir === 'left' && x > 0 && grid[y][x - 1].type !== 'wall') x--;
      if (dir === 'down' && y < grid.length - 1 && grid[y + 1][x].type !== 'wall') y++;
      if (dir === 'up' && y > 0 && grid[y - 1][x].type !== 'wall') y--;
      break;
    case 'left':
      if (dir === 'up') dir = 'left';
      else if (dir === 'left') dir = 'down';
      else if (dir === 'down') dir = 'right';
      else if (dir === 'right') dir = 'up';
      break;
    case 'right':
      if (dir === 'up') dir = 'right';
      else if (dir === 'right') dir = 'down';
      else if (dir === 'down') dir = 'left';
      else if (dir === 'left') dir = 'up';
      break;
    case 'pickup':
        if(newGrid[y][x].item) {
            hasItem = true;
            newGrid[y][x].item = false;
        }
        break;
  }
  return { newPlayerState: { x, y, dir, hasItem }, grid: newGrid };
}

export function checkSuccess(player: PlayerState, level: Level): boolean {
    let goalCoords = {x: -1, y: -1};
    for(let y=0; y<level.grid.length; y++) {
        for(let x=0; x<level.grid[0].length; x++) {
            if (level.grid[y][x].type === 'goal') {
                goalCoords = {x, y};
                break;
            }
        }
    }

    const levelHadItems = level.grid.flat().some(tile => tile.item);
    
    const atGoal = player.x === goalCoords.x && player.y === goalCoords.y;
    
    if (levelHadItems) {
        return atGoal && player.hasItem;
    }
    
    return atGoal;
}